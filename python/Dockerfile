FROM python

RUN apt-get update -y && apt-get install -y \
    libusb-1.0-0-dev \
    libturbojpeg-dev \
    ffmpeg \
    libsm6 \
    libxext6 \
    libeigen3-dev \
    libopencv-dev \
    git

RUN git clone https://github.com/pupil-labs/pyuvc --recursive
ENV FORCE_LOCAL_LIBUVC_BUILD=ON
RUN pip3 install ./pyuvc

COPY requirements.txt /app/
WORKDIR /app
RUN pip3 install -r requirements.txt

COPY . .

CMD ["python", "app.py"]