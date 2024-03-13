import cv2

def join_videos(video1_path, video2_path, output_path):
    video1 = cv2.VideoCapture(video1_path)
    video2 = cv2.VideoCapture(video2_path)

    fps = int(video1.get(cv2.CAP_PROP_FPS))
    width = int(video1.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(video1.get(cv2.CAP_PROP_FRAME_HEIGHT))
    print(fps, width, height)
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (2*width, height))
    print("befor")
    while True:
        print("joiinglsdjfojasdf")
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


join_videos("./output_left.mp4", "./output_right.mp4", "./combined_video.mp4")