"use client";
import { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

export default function BlogContent({ html }: { html: string }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const highlightCode = () => {
      const codeBlocks = contentRef.current?.querySelectorAll<HTMLElement>(
        "pre code:not(.hljs)"
      );
      codeBlocks?.forEach((code) => {
        try {
          hljs.highlightElement(code);
        } catch {
          // silent fail
        }
      });
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(highlightCode, { timeout: 2000 });
    } else {
      setTimeout(highlightCode, 100);
    }
  }, [html]);

  return (
    <div
      ref={contentRef}
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}