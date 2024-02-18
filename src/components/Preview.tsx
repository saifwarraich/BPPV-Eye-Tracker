import React from "react";
import { Card, CardFooter, Image, Button } from "@nextui-org/react";

export default function Preview({ text, link }) {
  console.log("here", link);
  return (
    <div style={{ margin: "10px" }}>
      <Card isFooterBlurred radius="lg" className="border-none">
        <iframe
          width="400"
          height="400"
          src={link}
          // frameborder="0"
          allowfullscreen
        ></iframe>

        <CardFooter className="justify-between bottom-0 before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
          <p style={{ zIndex: 99 }} className={`text-tiny  text-white/80`}>
            {text}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
