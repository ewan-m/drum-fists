import { useEffect, useRef } from "react";

export const useSound = (fileName: string) => {
  // Create an AudioContext

  const buffer = useRef<AudioBuffer | null>(null);
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => {
    audioContext.current = new window.AudioContext();

    // Load the audio file
    fetch(fileName)
      .then((response) => response.arrayBuffer())
      .then((buffer) => audioContext.current?.decodeAudioData(buffer))
      .then((decodedBuffer) => {
        // Create a buffer source node

        if (decodedBuffer) {
          buffer.current = decodedBuffer;
        }
      })
      .catch((error) =>
        console.error("Error loading or playing audio:", error)
      );
  }, []);

  const lastPlayTime = useRef<number>(0);

  return () => {
    const time = new Date().getTime();
    if (buffer.current && audioContext.current) {
      if (time - lastPlayTime.current > 150) {
        lastPlayTime.current = time;
        const source = audioContext.current.createBufferSource();
        source.buffer = buffer.current;
        source.connect(audioContext.current.destination);
        return source.start();
      }
    }
  };
};
