import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";
import { useEffect, useRef } from "react";

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

export const useGestureRecognition = () => {
  const gestureRecognizer = useRef<GestureRecognizer | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vision = useRef<any | null>(null);

  useEffect(() => {
    if (vision.current !== null) {
      return;
    }
    (async () => {
      vision.current = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      gestureRecognizer.current = await GestureRecognizer.createFromOptions(
        vision.current,
        {
          baseOptions: {
            modelAssetPath: "/gesture_recognizer.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
        }
      );
    })();
  }, []);

  return gestureRecognizer.current;
};
