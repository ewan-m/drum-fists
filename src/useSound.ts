import { useEffect, useRef, useState } from "react";

const kicks = ["kick", "kick2", "kick3"];
const snares = ["snare", "snare2", "snare3", "snare4", "snare5"];

export const useSound = (type: "KICK" | "SNARE") => {
  // Create an AudioContext

  const [soundIndex, setSoundIndex] = useState(0);

  const buffer = useRef<AudioBuffer | null>(null);
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => {
    audioContext.current = new window.AudioContext();

    console.log(soundIndex);

    // Load the audio file
    fetch(`/${(type === "KICK" ? kicks : snares)[soundIndex]}.wav`)
      .then((response) => response.arrayBuffer())
      .then((buffer) => audioContext.current?.decodeAudioData(buffer))
      .then((decodedBuffer) => {
        // Create a buffer source node

        if (decodedBuffer) {
          buffer.current = decodedBuffer;
        }
      })
      .catch((error) =>
        console.error("Error loading or playing audio:", error),
      );
  }, [type, soundIndex]);

  const lastPlayTime = useRef<number>(0);

  return [
    () => {
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
    },
    () => {
      setSoundIndex(
        (current) =>
          (current + 1) % (type === "KICK" ? kicks.length : snares.length),
      );
    },
  ] as const;
};
