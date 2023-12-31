import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { useEffect, useRef } from "react";
import { baseUrl } from "./baseUrl";

export const landmarkPoints = {
  WRIST: 0,
  THUMB_CMC: 1,
  THUMB_MCP: 2,
  THUMB_IP: 3,
  THUMB_TIP: 4,
  INDEX_FINGER_MCP: 5,
  INDEX_FINGER_PIP: 6,
  INDEX_FINGER_DIP: 7,
  INDEX_FINGER_TIP: 8,
  MIDDLE_FINGER_MCP: 9,
  MIDDLE_FINGER_PIP: 10,
  MIDDLE_FINGER_DIP: 11,
  MIDDLE_FINGER_TIP: 12,
  RING_FINGER_MCP: 13,
  RING_FINGER_PIP: 14,
  RING_FINGER_DIP: 15,
  RING_FINGER_TIP: 16,
  PINKY_MCP: 17,
  PINKY_PIP: 18,
  PINKY_DIP: 19,
  PINKY_TIP: 20,
};

export const useHandRecognition = () => {
  const handLandmarker = useRef<HandLandmarker | null>(null);

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
      handLandmarker.current = await HandLandmarker.createFromOptions(
        vision.current,
        {
          baseOptions: {
            modelAssetPath: `${baseUrl}/hand_landmarker.task`,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
        },
      );
    })();
  }, []);

  return handLandmarker.current;
};
