"use client";

import { useEffect, useState } from "react";

const WORDS = ["Scale You", "Build Faster", "Ship Better", "Grow Smarter"];

/* Smallest possible client island — a setTimeout loop and one
   span. Everything around it in HeroSection.tsx stays server
   rendered, so this is the only hydration cost for the headline. */
export default function TypingWord() {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    const current = WORDS[wordIdx];
    if (charIdx < current.length) {
      const t = setTimeout(() => {
        setText((prev) => prev + current[charIdx]);
        setCharIdx(charIdx + 1);
      }, 85);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setText("");
      setCharIdx(0);
      setWordIdx((wordIdx + 1) % WORDS.length);
    }, 1600);
    return () => clearTimeout(t);
  }, [charIdx, wordIdx]);

  return (
    <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
      {text}
      <span className="animate-pulse text-violet-400">|</span>
    </span>
  );
}