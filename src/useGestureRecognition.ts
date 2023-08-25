import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";
import { useEffect, useRef } from "react";

export const gestures = [
  "None",
  "Closed_Fist",
  "Open_Palm",
  "Pointing_Up",
  "Thumb_Down",
  "Thumb_Up",
  "Victory",
  "ILoveYou",
] as const;

export type Gesture = (typeof gestures)[number];

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
