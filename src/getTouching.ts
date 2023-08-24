import {
  HandLandmarkerResult,
  NormalizedLandmark,
} from "@mediapipe/tasks-vision";
import { landmarkPoints } from "./useHandRecognition";

export const fingerTips = [landmarkPoints.MIDDLE_FINGER_TIP];

const getDistance = (
  pointA: NormalizedLandmark,
  pointB: NormalizedLandmark
): number => {
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;

  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance;
};

const getTouchingFingerOnHand = (
  landmarks: NormalizedLandmark[] | undefined
): number | null => {
  if (!landmarks) {
    return null;
  }

  console.log(landmarks);

  const thumb = landmarks[landmarkPoints.THUMB_TIP];

  let bestFinger = null;
  let bestDistance = 1.0;

  const fixedWristToPinkyDistance = getDistance(
    landmarks[landmarkPoints.WRIST],
    landmarks[landmarkPoints.PINKY_MCP]
  );

  for (const tip of fingerTips) {
    const distance = getDistance(thumb, landmarks[tip]);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestFinger = tip;
    }
  }

  return bestDistance < 0.4 * fixedWristToPinkyDistance ? bestFinger : null;
};

export const getTouching = (
  result: HandLandmarkerResult
): {
  right: number | null;
  left: number | null;
} => {
  const leftIndex =
    result.handednesses.find(
      (category) => category[0].categoryName === "Left"
    )?.[0].index ?? -1;
  const rightIndex =
    result.handednesses.find(
      (category) => category[0].categoryName === "Right"
    )?.[0].index ?? -1;

  return {
    left:
      leftIndex !== -1
        ? getTouchingFingerOnHand(result.landmarks[leftIndex])
        : null,
    right:
      rightIndex !== -1
        ? getTouchingFingerOnHand(
            result.landmarks[leftIndex !== -1 ? rightIndex : 0]
          )
        : null,
  };
};
