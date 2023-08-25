import { FilesetResolver, ImageSegmenter } from "@mediapipe/tasks-vision";
import { useEffect, useRef } from "react";
import { baseUrl } from "./baseUrl";

export const gestures = {
  UNKNOWN: 0,
  CLOSED_FIST: 1,
  OPEN_PALM: 2,
  POINTING_UP: 3,
  THUMBS_DOWN: 4,
  THUMBS_UP: 5,
  VICTORY: 6,
  LOVE: 7,
};

export const useImageSegmenter = () => {
  const imageSegmenter = useRef<ImageSegmenter | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vision = useRef<any | null>(null);

  useEffect(() => {
    if (vision.current !== null) {
      return;
    }
    (async () => {
      vision.current = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
      );
      imageSegmenter.current = await ImageSegmenter.createFromOptions(
        vision.current,
        {
          baseOptions: {
            modelAssetPath: `${baseUrl}/deeplab_v3.tflite`,
            delegate: "GPU",
          },
          outputConfidenceMasks: false,
          outputCategoryMask: true,
          runningMode: "VIDEO",
        },
      );
    })();
  }, []);

  return imageSegmenter.current;
};
