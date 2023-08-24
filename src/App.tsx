import { useRef, useState } from "react";
import { landmarkPoints, useHandRecognition } from "./useHandRecognition";
import { useWebcamRef } from "./useWebcamRef";
import { useInterval } from "./useInterval";
import style from "./App.module.css";
import { useResultsCanvas } from "./useResultsCanvas";
import { getTouching } from "./getTouching";
import { useSound } from "./useSound";

const useRerender = () => {
  const [, setCount] = useState(0);

  return () => {
    setCount((count) => count + 1);
  };
};

export const App = () => {
  const handLandmarker = useHandRecognition();
  const webcamRef = useWebcamRef();
  const [canvasRef, drawResult] = useResultsCanvas();
  const rerender = useRerender();

  const processStream = useRef<{
    lastProcessTime: number;
    state: "idle" | "inFlight" | "paused" | "loopMode";
  }>({
    lastProcessTime: 0,
    state: "idle",
  });

  useInterval(() => {
    const video = webcamRef.current;
    const newTime = (video?.currentTime ?? 0) * 1000;

    if (
      handLandmarker &&
      video &&
      newTime > 0 &&
      newTime !== processStream.current.lastProcessTime &&
      processStream.current.state === "idle"
    ) {
      processStream.current.state = "inFlight";
      const result = handLandmarker.detectForVideo(video, newTime);
      rerender();

      if (result && result.landmarks) {
        drawResult(result);
        const touching = getTouching(result);

        console.log(touching);

        if (touching.right === landmarkPoints.MIDDLE_FINGER_TIP) {
          kick();
        } else if (touching.left === landmarkPoints.MIDDLE_FINGER_TIP) {
          snare();
        }
      }

      processStream.current = {
        state: "idle",
        lastProcessTime: newTime,
      };
    }
  }, 5);

  const kick = useSound("/kick2.wav");
  const snare = useSound("/snare3.wav");

  return (
    <div className={style.pageContainer}>
      <div className={style.poseContainer} id="poseContainer">
        <video
          className={style.webcam}
          ref={webcamRef}
          autoPlay
          muted
          playsInline
        ></video>
        <canvas
          className={style.webcam}
          ref={canvasRef}
          width={1920}
          height={1080}
        ></canvas>
      </div>
    </div>
  );
};
