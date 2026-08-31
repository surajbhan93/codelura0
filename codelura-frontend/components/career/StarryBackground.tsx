"use client";

import { useEffect, useRef } from "react";

export default function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    
    // Size immediately to bounding client rect (or window viewport fallback)
    const rect = canvas.getBoundingClientRect();
    let width = (canvas.width = rect.width || window.innerWidth);
    let height = (canvas.height = rect.height || window.innerHeight);

    // Star properties
    const numStars = 150;
    const stars: Array<{
      x: number;
      y: number;
      radius: number;
      opacity: number;
      speed: number;
      factor: number;
      color: string;
    }> = [];

    const colors = [
      "rgba(255, 255, 255,", // White stars
      "rgba(165, 180, 252,", // Indigo stars
      "rgba(103, 232, 249,", // Cyan stars
      "rgba(216, 180, 254,", // Purple stars
    ];

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.4 + 0.4,
        opacity: Math.random() * 0.8 + 0.2, // Start with higher initial visibility
        speed: 0.004 + Math.random() * 0.012,
        factor: Math.random() > 0.5 ? 1 : -1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Large Sparkle Stars (4-point cross sparkles)
    const numSparkles = 10;
    const sparkles: Array<{
      x: number;
      y: number;
      size: number;
      rotation: number;
      rotSpeed: number;
      opacity: number;
      fadeSpeed: number;
      factor: number;
    }> = [];

    for (let i = 0; i < numSparkles; i++) {
      sparkles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 14 + Math.random() * 14,
        rotation: Math.random() * Math.PI,
        rotSpeed: 0.002 + Math.random() * 0.003,
        opacity: 0.2 + Math.random() * 0.5,
        fadeSpeed: 0.003 + Math.random() * 0.004,
        factor: Math.random() > 0.5 ? 1 : -1,
      });
    }

    // Large floating space orbs / nebulae
    const orbs: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
    }> = [
      { x: width * 0.25, y: height * 0.3, radius: 280, vx: 0.08, vy: -0.04, color: "rgba(124, 58, 237, 0.05)" }, // Violet
      { x: width * 0.75, y: height * 0.5, radius: 320, vx: -0.06, vy: 0.05, color: "rgba(79, 70, 229, 0.04)" },  // Indigo
      { x: width * 0.5,  y: height * 0.2, radius: 220, vx: 0.04, vy: 0.06, color: "rgba(6, 182, 212, 0.03)" },  // Cyan
      { x: width * 0.1,  y: height * 0.7, radius: 300, vx: 0.05, vy: -0.05, color: "rgba(219, 39, 119, 0.03)" }, // Pink
    ];

    // Shooting stars
    const meteors: Array<{
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      active: boolean;
    }> = [];

    const spawnMeteor = () => {
      meteors.push({
        x: Math.random() * width * 0.7,
        y: Math.random() * height * 0.3,
        length: 70 + Math.random() * 80,
        speed: 3.5 + Math.random() * 4,
        opacity: 0.7 + Math.random() * 0.3,
        active: true,
      });
    };

    const interval = setInterval(() => {
      if (meteors.length < 2) spawnMeteor();
    }, 7000);

    const handleResize = () => {
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      width = canvas.width = r.width || window.innerWidth;
      height = canvas.height = r.y + r.height || window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const drawSparkle = (x: number, y: number, size: number, opacity: number, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.lineTo(0, size);
        ctx.lineTo(size * 0.12, size * 0.12);
      }
      ctx.closePath();
      
      const gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, size);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
      gradient.addColorStop(0.2, `rgba(168, 85, 247, ${opacity * 0.5})`);
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    };

    // Animation Loop
    const draw = () => {
      // Clear with solid dark background
      ctx.fillStyle = "#040612";
      ctx.fillRect(0, 0, width, height);

      // 1. Nebula Orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x - orb.radius < -100 || orb.x + orb.radius > width + 100) orb.vx *= -1;
        if (orb.y - orb.radius < -100 || orb.y + orb.radius > height + 100) orb.vy *= -1;

        const radial = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        radial.addColorStop(0, orb.color);
        radial.addColorStop(1, "rgba(4, 6, 18, 0)");
        
        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Tiny Stars
      stars.forEach((star) => {
        star.opacity += star.speed * star.factor;
        if (star.opacity > 1) {
          star.opacity = 1;
          star.factor = -1;
        } else if (star.opacity < 0.15) {
          star.opacity = 0.15;
          star.factor = 1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color}${star.opacity})`;
        ctx.fill();
      });

      // 3. Sparkle Stars
      sparkles.forEach((sparkle) => {
        sparkle.rotation += sparkle.rotSpeed;
        sparkle.opacity += sparkle.fadeSpeed * sparkle.factor;
        
        if (sparkle.opacity > 0.8) {
          sparkle.opacity = 0.8;
          sparkle.factor = -1;
        } else if (sparkle.opacity < 0.05) {
          sparkle.opacity = 0.05;
          sparkle.factor = 1;
          sparkle.x = Math.random() * width;
          sparkle.y = Math.random() * height;
        }

        drawSparkle(sparkle.x, sparkle.y, sparkle.size, sparkle.opacity, sparkle.rotation);
      });

      // 4. Meteors
      meteors.forEach((m, idx) => {
        if (!m.active) return;
        m.x += m.speed;
        m.y += m.speed;
        
        ctx.beginPath();
        const gradient = ctx.createLinearGradient(m.x, m.y, m.x - m.length, m.y - m.length);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${m.opacity})`);
        gradient.addColorStop(0.3, `rgba(139, 92, 246, ${m.opacity * 0.4})`);
        gradient.addColorStop(1, "rgba(99, 102, 241, 0)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.length, m.y - m.length);
        ctx.stroke();

        if (m.y > height || m.x > width) {
          m.active = false;
          meteors.splice(idx, 1);
        }
      });

      // Ambient radial nebula overlay
      const gradientNebula = ctx.createRadialGradient(
        width / 2, height / 2, 50,
        width / 2, height / 2, Math.max(width, height) * 0.5
      );
      gradientNebula.addColorStop(0, "rgba(99, 102, 241, 0.02)");
      gradientNebula.addColorStop(1, "rgba(4, 6, 18, 0)");
      ctx.fillStyle = gradientNebula;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(draw);
    };

    // Draw first frame synchronously for instant paint (no lag/blank screens)
    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      clearInterval(interval);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 block pointer-events-none w-full h-full"
    />
  );
}
