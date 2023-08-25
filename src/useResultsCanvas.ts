import {
  DrawingUtils,
  NormalizedLandmark,
  HandLandmarkerResult,
  HandLandmarker,
} from "@mediapipe/tasks-vision";
import { useRef } from "react";
import { landmarkPoints } from "./useHandRecognition";

export const useResultsCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawResult = (result: HandLandmarkerResult) => {
    if (canvasRef.current) {
      const canvasCtx = canvasRef.current.getContext("2d");
      if (canvasCtx) {
        canvasCtx.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height,
        );

        const drawingUtils = new DrawingUtils(canvasCtx);
        for (const landmark of result.landmarks) {
          drawingUtils.drawConnectors(
            landmark,
            HandLandmarker.HAND_CONNECTIONS,
            {
              color: "#fff",
            },
          );
          drawingUtils.drawLandmarks(
            [
              landmark[landmarkPoints.THUMB_TIP],
              landmark[landmarkPoints.MIDDLE_FINGER_TIP],
              landmark[landmarkPoints.INDEX_FINGER_TIP],
              landmark[landmarkPoints.RING_FINGER_TIP],
              landmark[landmarkPoints.PINKY_TIP],
            ],
            {
              radius: (data) =>
                DrawingUtils.lerp(
                  (data.from as NormalizedLandmark).z,
                  -0.15,
                  0.1,
                  40,
                  1,
                ),
              fillColor: "#ef6fc7",
              color: "#ef6fc7",
            },
          );
        }
      }
    }
  };

  return [canvasRef, drawResult] as const;
};
