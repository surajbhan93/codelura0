"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import BuyModal from "@/components/premium/BuyModal";

/* ═══════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════ */
type PremiumPlan = {
  _id: string;
  title: string;
  description: string;
  price: number;
  slug: string;
  faqs?: { question: string; answer: string }[];
  processSteps?: { title: string; description: string }[];
  features: string[];
  bannerImage?: string;
  galleryImages?: string[];
};

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES — everything in one <style> tag
═══════════════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;0,9..144,700;1,9..144,300;1,9..144,400;1,9..144,700&family=Syne:wght@400;500;600;700;800&family=Instrument+Sans:wght@300;400;500&display=swap');

  /* ── CSS Variables ──────────────────────────────────── */
  :root {
    --gold:        #c8a45a;
    --gold-lt:     #e2c27d;
    --gold-pale:   #f5e9c8;
    --gold-glow:   rgba(200,164,90,0.18);
    --obsidian:    #080a0f;
    --obsidian-2:  #0e1018;
    --obsidian-3:  #141720;
    --obsidian-4:  #1b1f2c;
    --steel:       #22273a;
    --border:      rgba(200,164,90,0.15);
    --border-hi:   rgba(200,164,90,0.40);
    --text-hi:     #f2ede4;
    --text-mid:    #b0a990;
    --text-lo:     #545060;
    --white:       #ffffff;
    --red-alert:   #e05a4e;
    --progress-h:  4px;
  }

  /* ── Reset / Base ───────────────────────────────────── */
 
  html { scroll-behavior: smooth; }

  body.pdp-active {
    background: var(--obsidian);
    color: var(--text-hi);
    font-family: 'Instrument Sans', sans-serif;
    overflow-x: hidden;
  }

  /* ── Scroll Progress Bar ─────────────────────────────── */
  .pdp-progress-bar {
    position: fixed;
    top: 0; left: 0;
    height: var(--progress-h);
    background: linear-gradient(90deg, var(--gold), var(--gold-lt));
    z-index: 1000;
    width: 0%;
    transition: width 0.1s linear;
    box-shadow: 0 0 12px var(--gold);
  }

  /* ── Floating Nav ────────────────────────────────────── */
  .pdp-floating-nav {
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999;
    background: rgba(8,10,15,0.75);
    backdrop-filter: blur(24px) saturate(1.4);
    -webkit-backdrop-filter: blur(24px) saturate(1.4);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 10px 28px;
    display: flex;
    align-items: center;
    gap: 32px;
    opacity: 0;
    transition: opacity 0.4s ease, transform 0.4s ease;
    pointer-events: none;
    white-space: nowrap;
  }
  .pdp-floating-nav.visible {
    opacity: 1;
    pointer-events: all;
  }
  .pdp-nav-logo {
    font-family: 'Fraunces', serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--gold);
    letter-spacing: 0.04em;
  }
  .pdp-nav-links {
    display: flex;
    gap: 24px;
    list-style: none;
  }
  .pdp-nav-links a {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-mid);
    text-decoration: none;
    transition: color 0.2s;
  }
  .pdp-nav-links a:hover { color: var(--gold-lt); }
  .pdp-nav-buy {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--obsidian);
    background: var(--gold);
    border: none;
    border-radius: 100px;
    padding: 8px 20px;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }
  .pdp-nav-buy:hover {
    background: var(--gold-lt);
    transform: scale(1.04);
  }

  /* ── Floating CTA ────────────────────────────────────── */
  .pdp-fab {
    position: fixed;
    bottom: 36px;
    right: 36px;
    z-index: 998;
    opacity: 0;
    transform: translateY(20px) scale(0.9);
    transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    pointer-events: none;
  }
  .pdp-fab.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: all;
  }
  .pdp-fab-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--gold);
    color: var(--obsidian);
    border: none;
    border-radius: 100px;
    padding: 16px 28px;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 8px 32px rgba(200,164,90,0.4), 0 2px 8px rgba(0,0,0,0.4);
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
    white-space: nowrap;
  }
  .pdp-fab-btn:hover {
    background: var(--gold-lt);
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 14px 40px rgba(200,164,90,0.5), 0 4px 16px rgba(0,0,0,0.5);
  }
  .pdp-fab-btn:active { transform: translateY(0) scale(0.98); }
  .pdp-fab-pulse {
    width: 8px; height: 8px;
    background: var(--obsidian);
    border-radius: 50%;
    animation: fabPulse 1.8s ease-in-out infinite;
  }
  @keyframes fabPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(1.6); }
  }

  /* ── Grain overlay ───────────────────────────────────── */
  .pdp-grain {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 997;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
  }

  /* ── HERO ────────────────────────────────────────────── */
  .pdp-hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
  }
  .pdp-hero-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }
  .pdp-hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.08);
    transition: transform 8s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .pdp-hero-img.loaded { transform: scale(1); }
  .pdp-hero-overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to top, var(--obsidian) 0%, rgba(8,10,15,0.55) 50%, rgba(8,10,15,0.15) 100%),
      linear-gradient(to right, rgba(8,10,15,0.6) 0%, transparent 60%);
  }
  .pdp-hero-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .pdp-particle {
    position: absolute;
    border-radius: 50%;
    background: var(--gold);
    opacity: 0;
    animation: floatUp linear infinite;
  }
  @keyframes floatUp {
    0%   { opacity: 0; transform: translateY(0) scale(0); }
    10%  { opacity: 0.6; }
    90%  { opacity: 0.2; }
    100% { opacity: 0; transform: translateY(-100vh) scale(0.5); }
  }
  /* No banner fallback */
  .pdp-hero-no-banner {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 30% 40%, rgba(200,164,90,0.12) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 80%, rgba(200,164,90,0.06) 0%, transparent 50%),
      linear-gradient(160deg, var(--obsidian-4) 0%, var(--obsidian) 100%);
  }
  /* Diagonal lines decoration on no-banner */
  .pdp-hero-no-banner::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 40px,
      rgba(200,164,90,0.025) 40px,
      rgba(200,164,90,0.025) 41px
    );
  }
  .pdp-hero-content {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 60px 80px;
  }
  .pdp-hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: 'Syne', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 24px;
    opacity: 0;
    transform: translateY(16px);
    animation: heroFade 0.7s 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .pdp-hero-eyebrow span {
    display: inline-block;
    width: 32px; height: 1px;
    background: var(--gold);
    opacity: 0.5;
  }
  .pdp-hero-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(48px, 7vw, 96px);
    font-weight: 300;
    line-height: 1.0;
    letter-spacing: -0.02em;
    color: var(--text-hi);
    max-width: 800px;
    opacity: 0;
    transform: translateY(24px);
    animation: heroFade 0.8s 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .pdp-hero-title em {
    font-style: italic;
    color: var(--gold-lt);
  }
  .pdp-hero-desc {
    margin-top: 24px;
    max-width: 520px;
    font-size: 16px;
    font-weight: 300;
    line-height: 1.7;
    color: var(--text-mid);
    opacity: 0;
    transform: translateY(20px);
    animation: heroFade 0.8s 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .pdp-hero-price-row {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-top: 36px;
    opacity: 0;
    transform: translateY(18px);
    animation: heroFade 0.8s 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .pdp-currency {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--gold);
  }
  .pdp-price {
    font-family: 'Fraunces', serif;
    font-size: clamp(52px, 6vw, 80px);
    font-weight: 700;
    color: var(--text-hi);
    line-height: 1;
  }
  .pdp-price-sub {
    font-size: 13px;
    color: var(--text-lo);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-left: 4px;
  }
  .pdp-hero-actions {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 40px;
    flex-wrap: wrap;
    opacity: 0;
    transform: translateY(18px);
    animation: heroFade 0.8s 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .pdp-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--gold);
    color: var(--obsidian);
    border: none;
    border-radius: 6px;
    padding: 18px 40px;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.25s, transform 0.2s, box-shadow 0.25s;
    box-shadow: 0 4px 20px rgba(200,164,90,0.3);
    position: relative;
    overflow: hidden;
  }
  .pdp-btn-primary::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%);
    background-size: 200% 100%;
    background-position: 200% 0;
    transition: background-position 0.5s ease;
  }
  .pdp-btn-primary:hover::after { background-position: -200% 0; }
  .pdp-btn-primary:hover {
    background: var(--gold-lt);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(200,164,90,0.45);
  }
  .pdp-btn-primary:active { transform: translateY(0); }
  .pdp-btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    color: var(--text-mid);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 17px 32px;
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    text-decoration: none;
  }
  .pdp-btn-secondary:hover {
    border-color: var(--gold);
    color: var(--gold);
    background: var(--gold-glow);
  }
  .pdp-hero-scroll-hint {
    position: absolute;
    bottom: 36px;
    right: 60px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: 'Syne', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-lo);
    opacity: 0;
    animation: heroFade 0.6s 1.6s ease forwards;
  }
  .pdp-scroll-line {
    width: 1px;
    height: 48px;
    background: linear-gradient(to bottom, transparent, var(--gold), transparent);
    animation: scrollPulse 2s ease-in-out infinite;
  }
  @keyframes scrollPulse {
    0%, 100% { opacity: 0.3; }
    50%       { opacity: 0.9; }
  }
  @keyframes heroFade {
    to { opacity: 1; transform: translateY(0); }
  }

  /* ── TRUST STRIP ─────────────────────────────────────── */
  .pdp-trust {
    background: var(--obsidian-2);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    position: relative;
    overflow: hidden;
  }
  .pdp-trust::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, var(--obsidian-2), transparent 20%, transparent 80%, var(--obsidian-2));
    pointer-events: none;
    z-index: 2;
  }
  .pdp-trust-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 60px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
  }
  .pdp-trust-item {
    padding: 28px 32px;
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    transition: background 0.3s;
    cursor: default;
  }
  .pdp-trust-item:last-child { border-right: none; }
  .pdp-trust-item:hover { background: rgba(200,164,90,0.04); }
  .pdp-trust-icon {
    width: 44px; height: 44px;
    border-radius: 10px;
    background: var(--obsidian-4);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    transition: border-color 0.3s, transform 0.3s;
  }
  .pdp-trust-item:hover .pdp-trust-icon {
    border-color: var(--gold);
    transform: translateY(-3px);
  }
  .pdp-trust-label {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: var(--text-hi);
    letter-spacing: 0.02em;
  }
  .pdp-trust-sub {
    font-size: 12px;
    color: var(--text-lo);
    line-height: 1.5;
  }

  /* ── SECTION SHELL ───────────────────────────────────── */
  .pdp-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 100px 60px;
  }
  .pdp-section-alt {
    background: var(--obsidian-2);
    position: relative;
    overflow: hidden;
  }
  .pdp-section-alt::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--border-hi) 50%, transparent 100%);
  }
  .pdp-section-alt::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--border-hi) 50%, transparent 100%);
  }
  .pdp-section-alt-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 100px 60px;
  }

  /* ── Section Headers ─────────────────────────────────── */
  .pdp-sh {
    margin-bottom: 60px;
  }
  .pdp-sh-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: 'Syne', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 16px;
  }
  .pdp-sh-eyebrow::before {
    content: '';
    display: inline-block;
    width: 24px; height: 1px;
    background: var(--gold);
  }
  .pdp-sh-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 300;
    line-height: 1.1;
    color: var(--text-hi);
    letter-spacing: -0.01em;
  }
  .pdp-sh-title em {
    font-style: italic;
    color: var(--gold-lt);
  }
  .pdp-sh-rule {
    width: 40px; height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    margin-top: 20px;
  }

  /* ── Reveal animations ───────────────────────────────── */
  .pdp-reveal {
    opacity: 0;
    transform: translateY(32px);
    transition: opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1), transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .pdp-reveal.revealed {
    opacity: 1;
    transform: translateY(0);
  }
  .pdp-reveal-delay-1 { transition-delay: 0.1s; }
  .pdp-reveal-delay-2 { transition-delay: 0.2s; }
  .pdp-reveal-delay-3 { transition-delay: 0.3s; }
  .pdp-reveal-delay-4 { transition-delay: 0.4s; }
  .pdp-reveal-delay-5 { transition-delay: 0.5s; }
  .pdp-reveal-delay-6 { transition-delay: 0.6s; }
  .pdp-reveal-left {
    opacity: 0;
    transform: translateX(-28px);
    transition: opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1), transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .pdp-reveal-left.revealed { opacity: 1; transform: translateX(0); }
  .pdp-reveal-scale {
    opacity: 0;
    transform: scale(0.94);
    transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .pdp-reveal-scale.revealed { opacity: 1; transform: scale(1); }

  /* ── FEATURES GRID ───────────────────────────────────── */
  .pdp-features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }
  .pdp-feature-card {
    background: var(--obsidian-3);
    padding: 32px 28px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    transition: background 0.3s;
    position: relative;
    overflow: hidden;
  }
  .pdp-feature-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 20% 50%, var(--gold-glow) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.4s;
  }
  .pdp-feature-card:hover::before { opacity: 1; }
  .pdp-feature-card:hover { background: var(--obsidian-4); }
  .pdp-feature-check {
    flex-shrink: 0;
    width: 22px; height: 22px;
    border-radius: 50%;
    background: var(--gold-glow);
    border: 1px solid var(--gold);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2px;
    transition: background 0.2s, transform 0.2s;
  }
  .pdp-feature-card:hover .pdp-feature-check {
    background: var(--gold);
    transform: scale(1.1);
  }
  .pdp-feature-check-icon {
    color: var(--gold);
    font-size: 11px;
    font-weight: 700;
    transition: color 0.2s;
  }
  .pdp-feature-card:hover .pdp-feature-check-icon { color: var(--obsidian); }
  .pdp-feature-text {
    font-size: 14px;
    font-weight: 400;
    color: var(--text-mid);
    line-height: 1.55;
    transition: color 0.2s;
  }
  .pdp-feature-card:hover .pdp-feature-text { color: var(--text-hi); }

  /* ── PROCESS / HOW IT WORKS ──────────────────────────── */
  .pdp-process-layout {
    display: grid;
    gap: 0;
  }
  .pdp-step-row {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 0 32px;
    position: relative;
  }
  .pdp-step-row:not(:last-child) .pdp-step-line { display: block; }
  .pdp-step-left {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .pdp-step-num {
    width: 56px; height: 56px;
    border-radius: 50%;
    border: 1px solid var(--border-hi);
    background: var(--obsidian-3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Fraunces', serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--gold);
    flex-shrink: 0;
    transition: background 0.3s, border-color 0.3s, transform 0.3s;
    position: relative;
    z-index: 1;
  }
  .pdp-step-row:hover .pdp-step-num {
    background: var(--gold);
    border-color: var(--gold);
    color: var(--obsidian);
    transform: scale(1.1);
  }
  .pdp-step-line {
    display: none;
    flex: 1;
    width: 1px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    margin: 8px 0 0;
    opacity: 0.25;
    min-height: 40px;
  }
  .pdp-step-body {
    padding: 0 0 56px;
  }
  .pdp-step-title {
    font-family: 'Syne', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: var(--text-hi);
    margin-bottom: 10px;
    padding-top: 14px;
    transition: color 0.2s;
  }
  .pdp-step-row:hover .pdp-step-title { color: var(--gold-lt); }
  .pdp-step-desc {
    font-size: 14px;
    font-weight: 300;
    color: var(--text-lo);
    line-height: 1.7;
    max-width: 480px;
  }
  /* Step number badge in body for wider screens */
  .pdp-step-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'Syne', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 8px;
  }
  .pdp-step-badge::before {
    content: '';
    display: inline-block;
    width: 16px; height: 1px;
    background: var(--gold);
    opacity: 0.5;
  }

  /* ── WHY BUY ─────────────────────────────────────────── */
  .pdp-why-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }
  .pdp-why-text p {
    font-size: 15px;
    font-weight: 300;
    color: var(--text-mid);
    line-height: 1.8;
    margin-bottom: 20px;
  }
  .pdp-why-text p:last-child { margin-bottom: 0; }
  .pdp-why-text strong { color: var(--text-hi); font-weight: 500; }
  .pdp-why-aside {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .pdp-stat-card {
    background: var(--obsidian-3);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 28px 32px;
    display: flex;
    gap: 20px;
    align-items: center;
    transition: border-color 0.3s, transform 0.3s;
  }
  .pdp-stat-card:hover {
    border-color: var(--gold);
    transform: translateX(6px);
  }
  .pdp-stat-num {
    font-family: 'Fraunces', serif;
    font-size: 40px;
    font-weight: 700;
    color: var(--gold);
    line-height: 1;
    flex-shrink: 0;
  }
  .pdp-stat-label {
    font-size: 13px;
    color: var(--text-lo);
    line-height: 1.5;
  }
  .pdp-stat-label strong {
    display: block;
    font-size: 15px;
    font-weight: 600;
    color: var(--text-hi);
    margin-bottom: 2px;
  }

  /* ── FAQ ─────────────────────────────────────────────── */
  .pdp-faq-list {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }
  .pdp-faq-item {
    border-bottom: 1px solid var(--border);
    background: var(--obsidian-3);
    transition: background 0.3s;
  }
  .pdp-faq-item:last-child { border-bottom: none; }
  .pdp-faq-item.open { background: var(--obsidian-4); }
  .pdp-faq-trigger {
    width: 100%;
    background: none;
    border: none;
    padding: 28px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    cursor: pointer;
    text-align: left;
  }
  .pdp-faq-question {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: var(--text-hi);
    transition: color 0.2s;
  }
  .pdp-faq-item.open .pdp-faq-question { color: var(--gold-lt); }
  .pdp-faq-chevron {
    flex-shrink: 0;
    width: 32px; height: 32px;
    border-radius: 50%;
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s, background 0.2s, transform 0.3s;
    color: var(--text-lo);
    font-size: 14px;
  }
  .pdp-faq-item.open .pdp-faq-chevron {
    border-color: var(--gold);
    background: var(--gold-glow);
    color: var(--gold);
    transform: rotate(180deg);
  }
  .pdp-faq-body {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.4s cubic-bezier(0.87, 0, 0.13, 1), padding 0.3s ease;
  }
  .pdp-faq-body.open {
    max-height: 400px;
  }
  .pdp-faq-answer {
    padding: 0 32px 28px;
    font-size: 14px;
    font-weight: 300;
    color: var(--text-mid);
    line-height: 1.8;
    border-top: 1px solid var(--border);
    padding-top: 20px;
  }

  /* ── GALLERY ─────────────────────────────────────────── */
  .pdp-gallery-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 200px;
    gap: 12px;
  }
  .pdp-gallery-grid .pdp-gal-item:first-child {
    grid-column: 1 / 3;
    grid-row: 1 / 3;
  }
  .pdp-gal-item {
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    background: var(--obsidian-4);
    border: 1px solid var(--border);
  }
  .pdp-gal-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), filter 0.4s;
    filter: brightness(0.85) saturate(0.9);
  }
  .pdp-gal-item:hover img {
    transform: scale(1.07);
    filter: brightness(1) saturate(1.1);
  }
  .pdp-gal-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(8,10,15,0.6) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.3s;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 16px;
  }
  .pdp-gal-item:hover .pdp-gal-overlay { opacity: 1; }
  .pdp-gal-expand {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 14px;
    backdrop-filter: blur(8px);
  }

  /* ── LIGHTBOX ────────────────────────────────────────── */
  .pdp-lightbox {
    position: fixed;
    inset: 0;
    z-index: 2000;
    background: rgba(0,0,0,0.92);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
    backdrop-filter: blur(12px);
  }
  .pdp-lightbox.open {
    opacity: 1;
    pointer-events: all;
  }
  .pdp-lightbox img {
    max-width: 90vw;
    max-height: 88vh;
    object-fit: contain;
    border-radius: 8px;
    transform: scale(0.95);
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    box-shadow: 0 32px 80px rgba(0,0,0,0.8);
  }
  .pdp-lightbox.open img { transform: scale(1); }
  .pdp-lightbox-close {
    position: absolute;
    top: 24px;
    right: 24px;
    width: 44px; height: 44px;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }
  .pdp-lightbox-close:hover { background: rgba(255,255,255,0.2); }
  .pdp-lightbox-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 48px; height: 48px;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }
  .pdp-lightbox-nav:hover { background: rgba(255,255,255,0.2); }
  .pdp-lightbox-prev { left: 24px; }
  .pdp-lightbox-next { right: 24px; }
  .pdp-lightbox-counter {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    letter-spacing: 0.15em;
    color: rgba(255,255,255,0.5);
  }

  /* ── FINAL CTA SECTION ───────────────────────────────── */
  .pdp-cta-section {
    position: relative;
    overflow: hidden;
    background: var(--obsidian-2);
    border-top: 1px solid var(--border);
  }
  .pdp-cta-bg-shapes {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .pdp-cta-shape {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, var(--gold-glow) 0%, transparent 70%);
    filter: blur(40px);
  }
  .pdp-cta-shape-1 {
    width: 600px; height: 400px;
    top: -100px; left: -100px;
    opacity: 0.6;
    animation: shapeDrift 8s ease-in-out infinite alternate;
  }
  .pdp-cta-shape-2 {
    width: 500px; height: 500px;
    bottom: -150px; right: -100px;
    opacity: 0.4;
    animation: shapeDrift 10s ease-in-out infinite alternate-reverse;
  }
  @keyframes shapeDrift {
    0%   { transform: translate(0, 0) scale(1); }
    100% { transform: translate(40px, 30px) scale(1.1); }
  }
  .pdp-cta-inner {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 120px 60px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 80px;
    align-items: center;
  }
  .pdp-cta-limited {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(224,90,78,0.12);
    border: 1px solid rgba(224,90,78,0.3);
    border-radius: 100px;
    padding: 6px 14px;
    font-family: 'Syne', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--red-alert);
    margin-bottom: 20px;
  }
  .pdp-cta-limited-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--red-alert);
    animation: alertBlink 1.2s ease-in-out infinite;
  }
  @keyframes alertBlink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.2; }
  }
  .pdp-cta-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(36px, 4vw, 56px);
    font-weight: 300;
    color: var(--text-hi);
    line-height: 1.1;
    letter-spacing: -0.01em;
    margin-bottom: 16px;
  }
  .pdp-cta-title em { font-style: italic; color: var(--gold-lt); }
  .pdp-cta-body {
    font-size: 15px;
    font-weight: 300;
    color: var(--text-lo);
    line-height: 1.7;
    max-width: 480px;
  }
  .pdp-cta-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    min-width: 240px;
  }
  .pdp-cta-price-block {
    text-align: center;
  }
  .pdp-cta-price-label {
    font-family: 'Syne', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-lo);
    margin-bottom: 4px;
  }
  .pdp-cta-price-val {
    font-family: 'Fraunces', serif;
    font-size: 52px;
    font-weight: 700;
    color: var(--text-hi);
    line-height: 1;
  }
  .pdp-cta-price-val small {
    font-size: 24px;
    color: var(--gold);
    vertical-align: super;
  }
  .pdp-cta-btn-wrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .pdp-cta-main-btn {
    width: 100%;
    background: var(--gold);
    color: var(--obsidian);
    border: none;
    border-radius: 8px;
    padding: 20px 36px;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 24px rgba(200,164,90,0.3);
    position: relative;
    overflow: hidden;
  }
  .pdp-cta-main-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%);
    background-size: 200% 100%;
    background-position: -200% 0;
    transition: background-position 0.5s;
  }
  .pdp-cta-main-btn:hover::after { background-position: 200% 0; }
  .pdp-cta-main-btn:hover {
    background: var(--gold-lt);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(200,164,90,0.45);
  }
  .pdp-cta-note {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 11px;
    color: var(--text-lo);
    text-align: center;
    letter-spacing: 0.04em;
  }

  /* ── Loading ─────────────────────────────────────────── */
  .pdp-loading {
    min-height: 100vh;
    background: var(--obsidian);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 20px;
  }
  .pdp-loader-ring {
    width: 56px; height: 56px;
    border-radius: 50%;
    border: 2px solid var(--border);
    border-top-color: var(--gold);
    animation: spin 1s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .pdp-loader-text {
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-lo);
    animation: loadPulse 1.5s ease-in-out infinite;
  }
  @keyframes loadPulse {
    0%, 100% { opacity: 0.4; }
    50%       { opacity: 1; }
  }

  /* ── Responsive ──────────────────────────────────────── */
  @media (max-width: 900px) {
    .pdp-trust-inner { grid-template-columns: repeat(2,1fr); padding: 32px 32px; }
    .pdp-trust-item { border-right: none; border-bottom: 1px solid var(--border); }
    .pdp-trust-item:nth-child(odd) { border-right: 1px solid var(--border); }
    .pdp-trust-item:nth-last-child(-n+2) { border-bottom: none; }
    .pdp-section { padding: 80px 32px; }
    .pdp-section-alt-inner { padding: 80px 32px; }
    .pdp-why-layout { grid-template-columns: 1fr; gap: 48px; }
    .pdp-cta-inner { grid-template-columns: 1fr; }
    .pdp-cta-right { width: 100%; }
    .pdp-gallery-grid { grid-template-columns: 1fr 1fr; grid-auto-rows: 180px; }
    .pdp-gallery-grid .pdp-gal-item:first-child { grid-column: 1 / 3; grid-row: 1 / 2; }
    .pdp-floating-nav { display: none; }
    .pdp-hero-content { padding: 0 32px 64px; }
    .pdp-hero-scroll-hint { display: none; }
  }
  @media (max-width: 600px) {
    .pdp-trust-inner { grid-template-columns: 1fr; }
    .pdp-trust-item:nth-child(odd) { border-right: none; }
    .pdp-trust-item:nth-last-child(-n+1) { border-bottom: none; }
    .pdp-gallery-grid { grid-template-columns: 1fr; }
    .pdp-gallery-grid .pdp-gal-item:first-child { grid-column: 1; grid-row: 1; }
    .pdp-section { padding: 60px 20px; }
    .pdp-section-alt-inner { padding: 60px 20px; }
    .pdp-fab { bottom: 20px; right: 20px; }
    .pdp-hero-content { padding: 0 20px 56px; }
    .pdp-features-grid { grid-template-columns: 1fr; }
    .pdp-step-row { grid-template-columns: 56px 1fr; }
    .pdp-cta-inner { padding: 80px 20px; }
  }
`;

/* ═══════════════════════════════════════════════════════════
   TRUST DATA
═══════════════════════════════════════════════════════════ */
const TRUST_ITEMS = [
  { icon: "🎯", label: "1:1 Mentorship", sub: "Direct access to your personal mentor anytime" },
  { icon: "💬", label: "Telegram Support", sub: "Instant replies in our exclusive community" },
  { icon: "🛠", label: "Real Projects", sub: "Build a portfolio with industry-grade work" },
  { icon: "🚀", label: "Career Guidance", sub: "Roadmap tailored to your goals" },
];

const STATS = [
  { num: "94%", label: "Placement Rate", sub: "Of students land roles within 90 days" },
  { num: "3×", label: "Faster Learning", sub: "With guided feedback and accountability" },
  { num: "500+", label: "Alumni Network", sub: "Active members supporting each other" },
];

/* ═══════════════════════════════════════════════════════════
   PARTICLE GENERATOR
═══════════════════════════════════════════════════════════ */
function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    width: `${Math.random() * 3 + 1}px`,
    height: `${Math.random() * 3 + 1}px`,
    delay: `${Math.random() * 12}s`,
    duration: `${8 + Math.random() * 14}s`,
  }));
}

/* ═══════════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════════ */
function useScrollReveal(dep?: unknown) {
  useEffect(() => {
    // Small timeout to let React paint the new elements first
    const timer = setTimeout(() => {
      const els = document.querySelectorAll(".pdp-reveal, .pdp-reveal-left, .pdp-reveal-scale");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("revealed");
              observer.unobserve(e.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
      );
      els.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, 100);
    return () => clearTimeout(timer);
  }, [dep]);
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handler = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return progress;
}

function useNavVisible() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 420);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return visible;
}

function useFabVisible() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handler = () => {
      const bottom = document.documentElement.scrollHeight - window.innerHeight - 300;
      setVisible(window.scrollY > 500 && window.scrollY < bottom);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return visible;
}

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════ */

/* FAQ Accordion Item */
function FaqItem({ faq, index }: { faq: { question: string; answer: string }; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`pdp-faq-item pdp-reveal pdp-reveal-delay-${Math.min(index + 1, 6)}${open ? " open" : ""}`}>
      <button className="pdp-faq-trigger" onClick={() => setOpen((v) => !v)}>
        <span className="pdp-faq-question">{faq.question}</span>
        <span className="pdp-faq-chevron">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1L6 7L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      <div className={`pdp-faq-body${open ? " open" : ""}`}>
        <p className="pdp-faq-answer">{faq.answer}</p>
      </div>
    </div>
  );
}

/* Gallery Lightbox */
function GalleryLightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  return (
    <div className="pdp-lightbox open" onClick={onClose}>
      <img
        src={images[current]}
        alt={`Gallery ${current + 1}`}
        onClick={(e) => e.stopPropagation()}
      />
      <button className="pdp-lightbox-close" onClick={onClose}>✕</button>
      {images.length > 1 && (
        <>
          <button className="pdp-lightbox-nav pdp-lightbox-prev" onClick={(e) => { e.stopPropagation(); prev(); }}>‹</button>
          <button className="pdp-lightbox-nav pdp-lightbox-next" onClick={(e) => { e.stopPropagation(); next(); }}>›</button>
          <div className="pdp-lightbox-counter">{current + 1} / {images.length}</div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function PremiumDetailPage() {
  /* ─── Original logic — untouched ─────────────────────── */
  const { slug } = useParams<{ slug: string }>();
  const [plan, setPlan] = useState<PremiumPlan | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchPlan = async () => {
      const res = await api.get(`/premium/plan/${slug}`);
      setPlan(res.data.plan);
    };
    fetchPlan();
  }, [slug]);
  /* ─────────────────────────────────────────────────────── */

  /* UI state */
  const [imgLoaded, setImgLoaded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [particles] = useState(() => generateParticles(18));
  const heroImgRef = useRef<HTMLImageElement>(null);

  /* Hooks */
  const progress = useScrollProgress();
  const navVisible = useNavVisible();
  const fabVisible = useFabVisible();
  useScrollReveal(plan);

  /* Body class */
  useEffect(() => {
    document.body.classList.add("pdp-active");
    return () => document.body.classList.remove("pdp-active");
  }, []);

  /* Preload hero image */
  useEffect(() => {
    if (!plan?.bannerImage) return;
    const img = new Image();
    img.src = plan.bannerImage;
    img.onload = () => setImgLoaded(true);
  }, [plan?.bannerImage]);

  /* ── Loading state ─────────────────────────────────── */
  if (!plan) return (
    <>
      <style>{STYLES}</style>
      <div className="pdp-loading">
        <div className="pdp-loader-ring" />
        <p className="pdp-loader-text">Loading your plan…</p>
      </div>
    </>
  );

  /* ── Render ──────────────────────────────────────────── */
  return (
    <>
      <style>{STYLES}</style>

      {/* Grain */}
      <div className="pdp-grain" />

      {/* Progress bar */}
      <div className="pdp-progress-bar" style={{ width: `${progress}%` }} />

      {/* Floating nav */}
      <nav className={`pdp-floating-nav ${navVisible ? "visible" : ""}`}>
        <span className="pdp-nav-logo">{plan.title}</span>
        <ul className="pdp-nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">Process</a></li>
          {plan.faqs && plan.faqs.length > 0 && <li><a href="#faq">FAQ</a></li>}
        </ul>
        <button className="pdp-nav-buy" onClick={() => setOpen(true)}>Buy Now</button>
      </nav>

      {/* Floating CTA button */}
      <div className={`pdp-fab ${fabVisible ? "visible" : ""}`}>
        <button className="pdp-fab-btn" onClick={() => setOpen(true)}>
          <span className="pdp-fab-pulse" />
          Join Premium — ₹{plan.price.toLocaleString("en-IN")}
        </button>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && plan.galleryImages && (
        <GalleryLightbox
          images={plan.galleryImages}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* ═══ HERO ════════════════════════════════════════ */}
      <section className="pdp-hero">
        <div className="pdp-hero-bg">
          {plan.bannerImage ? (
            <>
              <img
                ref={heroImgRef}
                src={plan.bannerImage}
                alt={plan.title}
                className={`pdp-hero-img ${imgLoaded ? "loaded" : ""}`}
              />
              <div className="pdp-hero-overlay" />
            </>
          ) : (
            <div className="pdp-hero-no-banner" />
          )}

          {/* Floating particles */}
          <div className="pdp-hero-particles">
            {particles.map((p) => (
              <div
                key={p.id}
                className="pdp-particle"
                style={{
                  left: p.left,
                  bottom: "0",
                  width: p.width,
                  height: p.height,
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                }}
              />
            ))}
          </div>
        </div>

        <div className="pdp-hero-content">
          <p className="pdp-hero-eyebrow">
            <span />
            Premium Membership
            <span />
          </p>

          <h1 className="pdp-hero-title">
            {plan.title.split(" ").map((word, i, arr) =>
              i === arr.length - 1
                ? <em key={i}>{word}</em>
                : <span key={i}>{word} </span>
            )}
          </h1>

          <p className="pdp-hero-desc">{plan.description}</p>

          <div className="pdp-hero-price-row">
            <span className="pdp-currency">₹</span>
            <span className="pdp-price">{plan.price.toLocaleString("en-IN")}</span>
            <span className="pdp-price-sub">/ lifetime</span>
          </div>

          <div className="pdp-hero-actions">
            <button className="pdp-btn-primary" onClick={() => setOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              Buy Now
            </button>
            <a className="pdp-btn-secondary" href="#features">
              Explore Plan ↓
            </a>
          </div>
        </div>

        <div className="pdp-hero-scroll-hint">
          Scroll to explore
          <div className="pdp-scroll-line" />
        </div>
      </section>

      {/* ═══ TRUST STRIP ═════════════════════════════════ */}
      <div className="pdp-trust">
        <div className="pdp-trust-inner">
          {TRUST_ITEMS.map((item, i) => (
            <div
              key={i}
              className={`pdp-trust-item pdp-reveal pdp-reveal-delay-${i + 1}`}
            >
              <div className="pdp-trust-icon">{item.icon}</div>
              <div>
                <p className="pdp-trust-label">{item.label}</p>
                <p className="pdp-trust-sub">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ FEATURES ════════════════════════════════════ */}
      <section id="features" className="pdp-section">
        <header className="pdp-sh pdp-reveal">
          <p className="pdp-sh-eyebrow">Included</p>
          <h2 className="pdp-sh-title">What You'll <em>Get</em></h2>
          <div className="pdp-sh-rule" />
        </header>

        <div className="pdp-features-grid">
          {plan.features.map((feature, i) => (
            <div
              key={i}
              className={`pdp-feature-card pdp-reveal pdp-reveal-delay-${Math.min((i % 6) + 1, 6)}`}
            >
              <div className="pdp-feature-check">
                <span className="pdp-feature-check-icon">✓</span>
              </div>
              <p className="pdp-feature-text">{feature}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ════════════════════════════════ */}
      {plan.processSteps && plan.processSteps.length > 0 && (
        <div className="pdp-section-alt" id="how-it-works">
          <div className="pdp-section-alt-inner">
            <header className="pdp-sh pdp-reveal">
              <p className="pdp-sh-eyebrow">Process</p>
              <h2 className="pdp-sh-title">How It <em>Works</em></h2>
              <div className="pdp-sh-rule" />
            </header>

            <div className="pdp-process-layout">
              {plan.processSteps.map((step, i) => (
                <div
                  key={i}
                  className={`pdp-step-row pdp-reveal pdp-reveal-delay-${Math.min(i + 1, 5)}`}
                >
                  <div className="pdp-step-left">
                    <div className="pdp-step-num">{i + 1}</div>
                    {i < plan.processSteps!.length - 1 && <div className="pdp-step-line" />}
                  </div>
                  <div className="pdp-step-body">
                    <p className="pdp-step-badge">Step {i + 1}</p>
                    <h3 className="pdp-step-title">{step.title}</h3>
                    <p className="pdp-step-desc">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ WHY BUY ═════════════════════════════════════ */}
      <section className="pdp-section">
        <header className="pdp-sh pdp-reveal">
          <p className="pdp-sh-eyebrow">Philosophy</p>
          <h2 className="pdp-sh-title">Why This <em>Program</em>?</h2>
          <div className="pdp-sh-rule" />
        </header>

        <div className="pdp-why-layout">
          <div className="pdp-why-text pdp-reveal">
            <p>
              Most learners fail not because of lack of talent — they fail because they lack <strong>direction, feedback, and accountability</strong>. Watching tutorials alone leaves you with fragments, not fluency.
            </p>
            <p>
              This premium program bridges that gap. You'll learn with a mentor beside you, build with real-world constraints, and receive the kind of <strong>honest, precise feedback</strong> that accelerates growth by years, not months.
            </p>
            <p>
              Every feature in this plan exists for one reason: to get you from where you are now to <strong>where you want to be</strong> — faster, smarter, and with the confidence to prove it.
            </p>
          </div>

          <div className="pdp-why-aside">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className={`pdp-stat-card pdp-reveal pdp-reveal-delay-${i + 1}`}
              >
                <div className="pdp-stat-num">{stat.num}</div>
                <div className="pdp-stat-label">
                  <strong>{stat.label}</strong>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═════════════════════════════════════════ */}
      {plan.faqs && plan.faqs.length > 0 && (
        <div className="pdp-section-alt" id="faq">
          <div className="pdp-section-alt-inner">
            <header className="pdp-sh pdp-reveal">
              <p className="pdp-sh-eyebrow">Questions</p>
              <h2 className="pdp-sh-title">Frequently <em>Asked</em></h2>
              <div className="pdp-sh-rule" />
            </header>

            <div className="pdp-faq-list">
              {plan.faqs.map((faq, i) => (
                <FaqItem key={i} faq={faq} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ GALLERY ═════════════════════════════════════ */}
      {plan.galleryImages && plan.galleryImages.length > 0 && (
        <section className="pdp-section">
          <header className="pdp-sh pdp-reveal">
            <p className="pdp-sh-eyebrow">Inside Look</p>
            <h2 className="pdp-sh-title">Inside the <em>Program</em></h2>
            <div className="pdp-sh-rule" />
          </header>

          <div className="pdp-gallery-grid">
            {plan.galleryImages.map((img, i) => (
              <div
                key={i}
                className={`pdp-gal-item pdp-reveal-scale pdp-reveal-delay-${Math.min(i + 1, 6)}`}
                onClick={() => setLightboxIndex(i)}
              >
                <img src={img} alt={`Program preview ${i + 1}`} />
                <div className="pdp-gal-overlay">
                  <div className="pdp-gal-expand">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ FINAL CTA ═══════════════════════════════════ */}
      <div className="pdp-cta-section">
        <div className="pdp-cta-bg-shapes">
          <div className="pdp-cta-shape pdp-cta-shape-1" />
          <div className="pdp-cta-shape pdp-cta-shape-2" />
        </div>

        <div className="pdp-cta-inner">
          <div className="pdp-reveal">
            <div className="pdp-cta-limited">
              <span className="pdp-cta-limited-dot" />
              Limited Seats Available
            </div>
            <h2 className="pdp-cta-title">
              Ready to Upgrade<br />Your <em>Skills?</em>
            </h2>
            <p className="pdp-cta-body">
              Limited seats are intentional — we cap enrollment to ensure every student gets the quality mentorship they deserve. Once seats fill, the waitlist opens.
            </p>
          </div>

          <div className="pdp-cta-right pdp-reveal pdp-reveal-delay-2">
            <div className="pdp-cta-price-block">
              <p className="pdp-cta-price-label">One-time investment</p>
              <p className="pdp-cta-price-val">
                <small>₹</small>
                {plan.price.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="pdp-cta-btn-wrap">
              <button className="pdp-cta-main-btn" onClick={() => setOpen(true)}>
                Join Premium Now
              </button>
              <p className="pdp-cta-note">🔒 Secure checkout · Instant access</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ BUY MODAL — untouched logic ════════════════ */}
      {open && (
        <BuyModal
          plan={plan}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}