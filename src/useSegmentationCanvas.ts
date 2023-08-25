import { ImageSegmenterResult } from "@mediapipe/tasks-vision";
import { useImageSegmenter } from "./useImageSegmenter";
import { useInterval } from "./useInterval";
import { useRef } from "react";

const legendColors = [
  [0, 0, 0, 255], // PERSON
  [128, 62, 117, 255],
  [255, 104, 0, 255],
  [255, 255, 255, 200], // NOT_PERSON
  [193, 0, 32, 255],
  [206, 162, 98, 255], // Grayish Yellow
  [129, 112, 102, 255], // Medium Gray
  [0, 125, 52, 255], // Vivid Green
  [246, 118, 142, 255], // Strong Purplish Pink
  [0, 83, 138, 255], // Strong Blue
  [255, 112, 92, 255], // Strong Yellowish Pink
  [83, 55, 112, 255], // Strong Violet
  [255, 142, 0, 255], // Vivid Orange Yellow
  [179, 40, 81, 255], // Strong Purplish Red
  [244, 200, 0, 255], // Vivid Greenish Yellow
  [127, 24, 13, 255], // Strong Reddish Brown
  [147, 170, 0, 255], // Vivid Yellowish Green
  [89, 51, 21, 255], // Deep Yellowish Brown
  [241, 58, 19, 255], // Vivid Reddish Orange
  [35, 44, 22, 255], // Dark Olive Green
  [0, 161, 194, 255], // Vivid Blue
];

export const useSegmentationCanvas = (video: HTMLVideoElement | null) => {
  const imageSegmenter = useImageSegmenter();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processStream = useRef<{
    lastProcessTime: number;
    state: "idle" | "inFlight";
  }>({
    lastProcessTime: 0,
    state: "idle",
  });

  useInterval(() => {
    const newTime = (video?.currentTime ?? 0) * 1000;

    if (
      imageSegmenter &&
      video &&
      newTime > 0 &&
      newTime !== processStream.current.lastProcessTime &&
      processStream.current.state === "idle"
    ) {
      processStream.current.state = "inFlight";
      imageSegmenter.segmentForVideo(
        video,
        newTime,
        (result: ImageSegmenterResult) => {
          const canvasCtx = canvasRef.current?.getContext("2d");
          if (!result.categoryMask || !canvasCtx) {
            processStream.current = {
              lastProcessTime: newTime,
              state: "idle",
            };
            return;
          }

          const imageData = canvasCtx.getImageData(
            0,
            0,
            video.videoWidth,
            video.videoHeight,
          ).data;
          const mask = result.categoryMask.getAsFloat32Array();
          let j = 0;
          for (let i = 0; i < mask.length; ++i) {
            const maskVal = Math.round(mask[i] * 255.0);
            const legendColor = legendColors[maskVal % legendColors.length];
            imageData[j] = (legendColor[0] + imageData[j]) / 2;
            imageData[j + 1] = (legendColor[1] + imageData[j + 1]) / 2;
            imageData[j + 2] = (legendColor[2] + imageData[j + 2]) / 2;
            imageData[j + 3] = (legendColor[3] + imageData[j + 3]) / 2;
            j += 4;
          }
          const uint8Array = new Uint8ClampedArray(imageData.buffer);
          const dataNew = new ImageData(
            uint8Array,
            video.videoWidth,
            video.videoHeight,
          );
          canvasCtx.putImageData(dataNew, 0, 0);

          processStream.current = {
            state: "idle",
            lastProcessTime: newTime,
          };
        },
      );
    }
  }, 5);

  return canvasRef;
};
