"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = (theme === "system" ? resolvedTheme : theme) === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-zinc-800 dark:border-gray-700 dark:bg-zinc-900 dark:text-white"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <>
          <Sun className="h-5 w-5 text-yellow-400" />
          <span>Light</span>
        </>
      ) : (
        <>
          <Moon className="h-5 w-5 text-slate-700" />
          <span>Dark</span>
        </>
      )}
    </button>
  );
}