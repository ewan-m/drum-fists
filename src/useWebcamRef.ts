import { useRef, useEffect } from "react";

export const useWebcamRef = () => {
  const webcamRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = webcamRef.current;
    if (video === null) {
      return;
    }

    (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          alert("Webcam is not found or supported by this browser.");
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "user" },
          },
        });

        video.srcObject = stream;
      } catch (error) {
        alert(error);
      }
    })();
  }, []);

  return webcamRef;
};
