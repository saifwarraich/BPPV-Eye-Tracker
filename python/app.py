from flask import Flask, Response
from flask_cors import CORS
import uvc
import cv2
import numpy as np
from typing import Dict, Tuple
from pupil_detectors import Detector2D

app = Flask(__name__)
CORS(app)

is_streaming_right = False
is_streaming_left = False
detector = Detector2D()

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
    app.run()