import { Card, CardFooter, Image, CardBody } from "@nextui-org/react";
import { useEffect } from "react";
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

export default function VideoPlayer({ imageData, label }: PreviewProps) {
  useEffect(() => {
    console.log(imageData);
  }, []);

  return (
    <StyledCard isFooterBlurred radius="lg" className="border-none">
      <CardBody className="overflow-visible p-0">
        {imageData ? (
          <Image width={400} height={400} src={imageData} alt="MJPEG Frame" />
        ) : (
          <CardBodyPlaceHolder></CardBodyPlaceHolder>
        )}
      </CardBody>
      <CardFooter className="text-small justify-between">
        <p style={{ zIndex: 99 }} className={`text-tiny  text-white/80`}>
          {label}
        </p>
      </CardFooter>
    </StyledCard>
  );
}
