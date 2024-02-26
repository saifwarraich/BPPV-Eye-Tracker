import { Card, CardFooter, Image, Button, CardBody } from "@nextui-org/react";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player/lazy";
import { styled } from "styled-components";

const StyledCard = styled(Card)`
  margin-right: 15px;
  margin-bottom: 15px;
  margin-top: 15px;
  /* background: linear-gradient(to bottom right, violet, fuchsia); */
`;

const CardBodyPlaceHolder = styled("div")`
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface PreviewProps {
  imageData: string;
  eye: string;
  label: string;
}

export default function VideoPlayer({ imageData, label, eye }: PreviewProps) {
  useEffect(() => {
    console.log(imageData);
  }, []);

  return (
    <StyledCard isFooterBlurred radius="lg" className="border-none">
      <CardBody className="overflow-visible p-0">
        {imageData ? (
          <img
            style={{ width: "400px", height: "400px" }}
            src={imageData}
            alt="MJPEG Frame"
          />
        ) : (
          <CardBodyPlaceHolder></CardBodyPlaceHolder>
        )}
        {/* <ReactPlayer url={"http://127.0.0.1:5000/start-video"} playing />
        <video width={"400"} height={"400"} autoPlay={true}>
          {true && (
            <source
              src={"http://127.0.0.1:5000/start-video"}
              type="application/x-mpegURL"
            ></source>
          )}
        </video> */}
        {/* <iframe
          width="400"
          height="400"
          src={
            "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          }
          // frameborder="0"
          // allowfullscreen
        ></iframe> */}
      </CardBody>
      <CardFooter className="text-small justify-between">
        <p style={{ zIndex: 99 }} className={`text-tiny  text-white/80`}>
          {label}
        </p>
      </CardFooter>
    </StyledCard>
  );
}
