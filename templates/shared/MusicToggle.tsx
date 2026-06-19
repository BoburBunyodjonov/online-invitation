"use client";

import { useEffect, useRef, useState } from "react";
import { SpeakerHighIcon, SpeakerSlashIcon } from "@phosphor-icons/react";

export function MusicToggle({
  src,
  accent,
}: {
  src?: string;
  accent: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
    };
  }, []);

  if (!src) return null;

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        // Autoplay blocked
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause music" : "Play music"}
        className="glass-pill flex h-10 w-10 items-center justify-center text-white transition-transform active:scale-95"
      >
        {playing ? (
          <SpeakerHighIcon weight="duotone" size={20} color={accent} />
        ) : (
          <SpeakerSlashIcon weight="duotone" size={20} />
        )}
      </button>
    </>
  );
}
