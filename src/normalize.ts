import { HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { landmarkPoints } from "./useHandRecognition";

const getMeanCoordinates = (
  result: HandLandmarkerResult,
  bodyParts: number[]
): [x: number, y: number] => {
  let summedX = 0;
  let summedY = 0;

  result.landmarks?.[0]
    ?.filter((_, index) => bodyParts.includes(index))
    ?.forEach((keypoint) => {
      summedX += keypoint.x;
      summedY += keypoint.y;
    });
  return [summedX / bodyParts.length, summedY / bodyParts.length];
};

export const normalizeHand = (
  result: HandLandmarkerResult
): HandLandmarkerResult => {
  const clonedResult: HandLandmarkerResult = JSON.parse(JSON.stringify(result));

  const hand = clonedResult.landmarks[0];

  if (!hand) {
    return result;
  }

  const normalizationDistance =
    2 * hand[landmarkPoints.WRIST].y - hand[landmarkPoints.PINKY_MCP].y;

  const center = getMeanCoordinates(result, [
    landmarkPoints.WRIST,
    landmarkPoints.PINKY_MCP,
    landmarkPoints.INDEX_FINGER_MCP,
    landmarkPoints.RING_FINGER_MCP,
    landmarkPoints.MIDDLE_FINGER_MCP,
  ]);

  hand.forEach((point) => {
    point.y = 0.5 + (point.y - center[1]) / normalizationDistance;
    point.x = 0.5 + (point.x - center[0]) / normalizationDistance;
  });

  return clonedResult;
};
