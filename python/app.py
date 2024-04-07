from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import uvc
import cv2
import serial
import time
import numpy as np
from typing import Dict, Tuple
from pupil_detectors import Detector2D
import math
from utils.CONSTANST import ACCEL_SENSITIVITY, GYRO_SENSITIVITY
from flask_socketio import SocketIO
from threading import Lock
import requests
import json
import subprocess
import os

is_streaming_right = False
is_streaming_left = False
detector = Detector2D()
thread = None
thread_lock = Lock()

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'donsky!'
socketio = SocketIO(app, cors_allowed_origins='*')

def get_current_datetime():
    current_time_seconds = time.time()
    current_time_milliseconds = int(current_time_seconds * 1000)
    return current_time_milliseconds

def background_thread():
    print("Generating random sensor values")
    while thread:
        ser = serial.Serial('/dev/ttyACM0', 115200, timeout=None)
        data = ser.readline()
        print("data")
        try:
            data = data.decode('ascii')
        except UnicodeDecodeError:
            data = "0 0 0 0 0 0"
        print("here")
        data_split = data.split()

        if len(data_split) >= 6 and data_split[0] != 'ACC_x':
            raw_accel_x  = float(data_split[0])
            raw_accel_y  = float(data_split[1])
            raw_accel_z  = float(data_split[2])
            raw_gyro_x  = float(data_split[3])
            raw_gyro_y  = float(data_split[4])
            raw_gyro_z  = float(data_split[5])

                # Conversion to meaningful units
            accel_x_g = raw_accel_x / ACCEL_SENSITIVITY
            accel_y_g = raw_accel_y / ACCEL_SENSITIVITY
            accel_z_g = raw_accel_z / ACCEL_SENSITIVITY
            gyro_x_dps = raw_gyro_x / GYRO_SENSITIVITY
            gyro_y_dps = raw_gyro_y / GYRO_SENSITIVITY
            gyro_z_dps = raw_gyro_z / GYRO_SENSITIVITY

            # Calculate pitch and roll angles using accelerometer data
            pitch_rad = math.atan2(accel_x_g, math.sqrt(accel_y_g**2 + accel_z_g**2))
            roll_rad = math.atan2(accel_y_g, math.sqrt(accel_x_g**2 + accel_z_g**2))
            
            # Convert angles from radians to degrees
            pitch_deg = math.degrees(pitch_rad)
            roll_deg = math.degrees(roll_rad)
            
            # Calculate yaw angle using gyroscope data (simplified integration)
            delta_time = 1.0  # Example time interval between measurements (seconds)
            gyro_x_rad = math.radians(gyro_x_dps)
            yaw_rad = gyro_x_rad * delta_time 
            
            # Convert yaw angle from radians to degrees
            yaw_deg = math.degrees(yaw_rad)

            position_data = [-1*(pitch_deg+72), roll_deg , yaw_deg]
            sensor_data = [raw_accel_x, raw_accel_y, raw_accel_z, raw_gyro_x, raw_gyro_y, raw_gyro_z]
    
            socketio.emit('updateSensorData', {'angleValues': position_data, 'sensorData': sensor_data, 'timestamp': get_current_datetime()})
        socketio.sleep(1)

@socketio.on('connect')
def connect():
    global thread
    print('Client connected')

    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(background_thread)

@socketio.on('disconnect')
def disconnect():
    print('Client disconnected',  request.sid)
    global thread
    with thread_lock:
        if thread is not None:
            thread = None

def remove_video_files():
    current_dir = os.getcwd()

    for filename in os.listdir(current_dir):
        if filename.endswith(".mp4"):
            filepath = os.path.join(current_dir, filename)
            os.remove(filepath)


def join_videos(video1_path, video2_path, output_path):
    video1 = cv2.VideoCapture(video1_path)
    video2 = cv2.VideoCapture(video2_path)

    fps = int(video1.get(cv2.CAP_PROP_FPS))
    width = int(video1.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(video1.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (2*width, height))

    while True:
        ret1, frame1 = video1.read()
        ret2, frame2 = video2.read()

        if not ret1 or not ret2:
            break
        frame2 = cv2.resize(frame2, (width, height))
        combined_frame = cv2.hconcat([frame1, frame2])
        out.write(combined_frame)

    video1.release()
    video2.release()
    out.release()
    cv2.destroyAllWindows()

@app.route('/test')
def hello():
    dev_list = uvc.device_list()
    print(dev_list)
    return "Hello World!"

def draw_ellipse(frame: np.ndarray, ellipse: Dict, rgb: Tuple, thickness: float, draw_center: bool = False):
    try:
        # draw the ellipse outline onto the input image
        # note that cv2.ellipse() cannot deal with float values
        # also it expects the axes to be semi-axes (half the size)
        cv2.ellipse(
            frame,
            tuple(int(v) for v in ellipse["center"]),
            tuple(int(v / 2) for v in ellipse["axes"]),
            ellipse["angle"],
            0, 360,  # start/end angle for drawing
            rgb,
            thickness  # color (BGR): red
        )
        if draw_center:
            cv2.circle(frame, tuple(int(v) for v in ellipse["center"]), int(
                ellipse['diameter']/5), (0, 0, 225), -1)

        return frame
    except Exception as e:
        print(
            "Error drawing ellipse! Skipping...\n"
            f"Ellipse: {ellipse}\n"
            f"Color: {rgb}\n"
            f"Error: {type(e)}: {e}"
        )
        return

def draw_pupil_outline(frame, pupil_detection_result_2d, color_rgb=(0, 0, 225)):
    ellipse = pupil_detection_result_2d["ellipse"]
    if pupil_detection_result_2d["confidence"] <= 0.0:
        return frame
    else:
        ellipse['diameter'] = pupil_detection_result_2d['diameter'] 
        frame = draw_ellipse(
            frame=frame,
            ellipse=ellipse,
            rgb=color_rgb,
            thickness=1,
            draw_center=True,
        )
        return frame

def draw_detector(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    result = detector.detect(gray_img=gray, roi=None, color_img=frame)
    gray_BGR = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)
    frame_detect_pupil = draw_pupil_outline(
        frame=gray_BGR,
        pupil_detection_result_2d=result,
        color_rgb=(0, 0, 225),
    )
    return frame_detect_pupil

def generate_frames_right():
    global is_streaming_right
    capture = None
    dev_list = uvc.device_list()
    capture = uvc.Capture(dev_list[2]["uid"])
    if capture is None:
        print( "VideoCa NOT ")
    else:
        if not is_streaming_right:
            is_streaming_right = True
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter('./output_right_t.mp4', fourcc, 20.0, (192, 192))
            while is_streaming_right: 
                try:
                    frame_to_display = gen_frame(capture=capture)
                    frame_to_display = cv2.rotate(frame_to_display, cv2.ROTATE_180)
                    out.write(frame_to_display)
                    ret, jpeg = cv2.imencode('.jpg',frame_to_display)
                    frame = jpeg.tobytes()
                    yield (b'--frame\r\n'
                        b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
                except Exception as e:
                    print(e)
                    break
            is_streaming_right = False
            out.release()

def generate_frames_left():
    global is_streaming_left
    capture = None
    dev_list = uvc.device_list()
    capture = uvc.Capture(dev_list[1]["uid"])
    if capture is None:
        print( "VideoCa NOT ")
    else:
        if not is_streaming_left:
            is_streaming_left = True
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter('./output_left_t.mp4', fourcc, 20.0, (192, 192))
            while is_streaming_left: 
                try:
                    gray_BGR = gen_frame(capture=capture)
                    out.write(gray_BGR)
                    ret, jpeg = cv2.imencode('.jpg',gray_BGR)
                    frame = jpeg.tobytes()
                    yield (b'--frame\r\n'
                        b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
                except Exception as e:
                    print(e)
                    break
            is_streaming_left = False
            out.release()

def gen_frame(capture):
    frame = capture.get_frame_robust()
    img = frame.img
    # gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # gray_BGR = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)
    # img = cv2.rotate(img, cv2.ROTATE_180)
    # frame2display = cv2.rotate(frame2display, cv2.ROTATE_180)
    frame_detect_pupil = draw_detector(
            img)
    return frame_detect_pupil

@app.route('/start-video-right')
def start_video():
    remove_video_files()
    return Response(generate_frames_right(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/start-video-left')
def start_video_left():
    return Response(generate_frames_left(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/stop-video')
def stop_video():
    global is_streaming_right, is_streaming_left
    if is_streaming_right:
        is_streaming_left = False
        is_streaming_right = False
        time.sleep(1)
        join_videos("./output_left_t.mp4", "./output_right_t.mp4", "./combined_video_t.mp4")
        commands = [
            ['ffmpeg', '-i', 'combined_video_t.mp4', '-c:v', 'libx264', '-c:a', 'aac', 'combined_video.mp4'],
            ['ffmpeg', '-i', 'output_left_t.mp4', '-c:v', 'libx264', '-c:a', 'aac', 'output_left.mp4'],
            ['ffmpeg', '-i', 'output_right_t.mp4', '-c:v', 'libx264', '-c:a', 'aac', 'output_right.mp4']
        ]
        for command in commands:
            subprocess.run(command)
        time.sleep(3)
    return "True"

@app.route("/save-video", methods=['POST'])
def save_video():
    data = request.json
    data["label"] = json.dumps([i for i in data["label"]])
    data["headMovementData"] = json.dumps([i for i in data["headMovementData"]])
    files = {}
    file_path = "./output_left.mp4"
    with open(file_path, 'rb') as file:
        files["leftEyeVideo"] = (file_path, file.read(), 'multipart/form-data')
    
    file_path = "./output_right.mp4"
    with open(file_path, 'rb') as file:
        files["rightEyeVideo"] = (file_path, file.read(), 'multipart/form-data')
    
    file_path = "./combined_video.mp4"
    with open(file_path, 'rb') as file:
        files["combinedVideo"] = (file_path, file.read(), 'multipart/form-data')
    try:
        response = requests.post("http://localhost:4000/v1/video-detail/", data=data, files=files)
        if response.status_code != 200:
            data = response.json()
            errors = data.get("error")
            return jsonify(errors), 400
    except Exception as e:
        print(e)
    return "done"

if __name__ == '__main__':
    socketio.run(app, allow_unsafe_werkzeug=True)
    # app.run()