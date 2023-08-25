import { useRef, useState } from "react";
import { useWebcamRef } from "./useWebcamRef";
import { useInterval } from "./useInterval";
import style from "./App.module.css";
import { useResultsCanvas } from "./useResultsCanvas";
import { useSound } from "./useSound";
import { Gesture, useGestureRecognition } from "./useGestureRecognition";

const useRerender = () => {
  const [, setCount] = useState(0);

  return () => {
    setCount((count) => count + 1);
  };
};

export const App = () => {
  const gestureRecognizer = useGestureRecognition();
  const webcamRef = useWebcamRef();
  const [canvasRef, drawResult] = useResultsCanvas();
  const rerender = useRerender();

  const processStream = useRef<{
    lastProcessTime: number;
    state: "idle" | "inFlight";
    lastLeftGesture: Gesture;
    lastRightGesture: Gesture;
  }>({
    lastProcessTime: 0,
    state: "idle",
    lastLeftGesture: "None",
    lastRightGesture: "None",
  });

  useInterval(() => {
    const video = webcamRef.current;
    const newTime = (video?.currentTime ?? 0) * 1000;

    if (
      gestureRecognizer &&
      video &&
      newTime > 0 &&
      newTime !== processStream.current.lastProcessTime &&
      processStream.current.state === "idle"
    ) {
      processStream.current.state = "inFlight";
      const result = gestureRecognizer.recognizeForVideo(video, newTime);
      rerender();

      let leftGesture: Gesture = "None";
      let rightGesture: Gesture = "None";

      if (result && result.landmarks) {
        drawResult(result);

        leftGesture = result.gestures[0]?.[0]?.categoryName as Gesture;
        rightGesture = result.gestures[1]?.[0]?.categoryName as Gesture;

        if (
          leftGesture === "Closed_Fist" &&
          leftGesture !== processStream.current.lastLeftGesture
        ) {
          kick();
        }
        if (
          leftGesture === "Victory" &&
          leftGesture !== processStream.current.lastLeftGesture
        ) {
          cycleKick();
        }

        if (
          rightGesture === "Closed_Fist" &&
          rightGesture !== processStream.current.lastRightGesture
        ) {
          snare();
        }
        if (
          rightGesture === "Victory" &&
          rightGesture !== processStream.current.lastRightGesture
        ) {
          cycleSnare();
        }
      }

      processStream.current = {
        state: "idle",
        lastProcessTime: newTime,
        lastLeftGesture: leftGesture,
        lastRightGesture: rightGesture,
      };
    }
  }, 2);

  const [snare, cycleSnare] = useSound("SNARE");
  const [kick, cycleKick] = useSound("KICK");

  // const segmentationCanvas = useSegmentationCanvas(webcamRef.current);

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
