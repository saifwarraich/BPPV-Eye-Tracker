from flask import Flask, Response
from flask_cors import CORS
import uvc
import cv2

app = Flask(__name__)
CORS(app)

is_streaming = False

@app.route('/test')
def hello():
    dev_list = uvc.device_list()
    print(dev_list)
    return "Hello World!"

def draw_detector(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    # result = detector.detect(gray_img=gray, roi=None, color_img=frame)
    gray_BGR = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)
    # frame_detect_pupil = draw_pupil_outline(
    #     frame=gray_BGR,
    #     pupil_detection_result_2d=result,
    #     color_rgb=(0, 0, 225),
    # )
    return gray

def generate_frames():
    global is_streaming
    dev_list = uvc.device_list()
    capture = uvc.Capture(dev_list[1]["uid"])
    if capture is None:
        print( "VideoCa NOT ")
    else:
        if not is_streaming:
            is_streaming = True
            while is_streaming: 
                try:
                    frame = capture.get_frame_robust()
                    img = frame.img
                    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                    gray_BGR = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)
                    # frame_detect_pupil = draw_detector(
                    #         frame)
                    print(frame)

                    ret, jpeg = cv2.imencode('.jpg',gray_BGR)
                    frame = jpeg.tobytes()
                    yield (b'--frame\r\n'
                            b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
                except Exception as e:
                    print(e)
                    break
            is_streaming = False

@app.route('/start-video')
def start_video():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/stop-video')
def stop_video():
    global is_streaming
    if is_streaming:
        is_streaming = False
    return "True"

if __name__ == '__main__':
    app.run()