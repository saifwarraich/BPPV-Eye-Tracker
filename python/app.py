from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import uvc
import cv2
import serial
import time
import datetime
import numpy as np
from typing import Dict, Tuple
from pupil_detectors import Detector2D
import json
import math
from utils.CONSTANST import ACCEL_SENSITIVITY, GYRO_SENSITIVITY
from flask_socketio import SocketIO
from threading import Lock

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
    now = datetime.now()
    return now.strftime("%m/%d/%Y %H:%M:%S")

def background_thread():
    print("Generating random sensor values")
    while True:
        ser = serial.Serial('/dev/ttyACM0', 115200, timeout=None)
        data = ser.readline()
        try:
            data = data.decode('ascii')
        except UnicodeDecodeError:
            data = "0 0 0 0 0 0"

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
            yaw_rad = gyro_x_rad * delta_time  # Simplified integration
            
            # Convert yaw angle from radians to degrees
            yaw_deg = math.degrees(yaw_rad)

            position_data = [-1*(pitch_deg+72), roll_deg , yaw_deg]
    
            # val =   # Convert to JSON string
            socketio.emit('updateSensorData', {'value': position_data})
        socketio.sleep(1)

@socketio.on('connect')
def connect():
    global thread
    print('Client connected')

    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(background_thread)

"""
Decorator for disconnect
"""
@socketio.on('disconnect')
def disconnect():
    print('Client disconnected',  request.sid)
    global thread
    with thread_lock:
        if thread is not None:
            thread.stop()

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
            out = cv2.VideoWriter('../public/output_right.mp4', fourcc, 20.0, (192, 192))
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
            out = cv2.VideoWriter('../public/output_left.mp4', fourcc, 20.0, (192, 192))
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
    return "True"

if __name__ == '__main__':
    socketio.run(app)
    # app.run()