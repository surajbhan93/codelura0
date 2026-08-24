"use client";

import { TypeAnimation } from "react-type-animation";

interface TypeAnimationWrapperProps {
  sequences: (string | number)[];
  wrapper?: "span" | "div" | "p";
  speed?: number;
  deletionSpeed?: number;
  repeat?: number;
  cursor?: boolean;
  className?: string;
}

export default function TypeAnimationWrapper({
  sequences,
  wrapper = "span",
  speed = 50,
  deletionSpeed = 65,
  repeat = Infinity,
  cursor = true,
  className = "",
}: TypeAnimationWrapperProps) {
  return (
    <TypeAnimation
      sequence={sequences}
      wrapper={wrapper}
      speed={speed as never}
      deletionSpeed={deletionSpeed as never}
      repeat={repeat}
      cursor={cursor}
      className={className}
    />
  );
}