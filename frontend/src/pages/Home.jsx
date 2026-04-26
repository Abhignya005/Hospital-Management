import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Navbar from "../Components/Navbar";

// ── Global Styles ──────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --emerald:        #0f9d74;
    --emerald-d:      #0b7d5d;
    --emerald-l:      #dcf7ee;
    --teal:           #2f8fb6;
    --teal-l:         #e0f4ff;
    --slate:          #f6f8fc;
    --slate-mid:      #e7edf7;
    --muted:          #5f6f87;
    --border:         rgba(15,23,42,0.08);
    --glass:          rgba(255,255,255,0.75);
    --surface:        rgba(255,255,255,0.88);
    --surface-strong: rgba(255,255,255,0.96);
    --text:           #102033;
    --nav-h:          70px;
  }

  html { scroll-behavior: smooth; }

  /* ── FIX: body must allow vertical scroll ── */
  body {
    font-family: 'DM Sans', sans-serif;
    background: linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
    /* removed overflow-y: hidden — was blocking scroll */
  }

  html, body, #root { min-height: 100%; }

  /* ── animated background mesh — fixed behind everything ── */
  .hms-bg-fixed {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 80% 60% at 20% 10%, rgba(15,157,116,0.14) 0%, transparent 60%),
      radial-gradient(ellipse 60% 70% at 80% 80%, rgba(47,143,182,0.10) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 60% 30%, rgba(168,216,255,0.22) 0%, transparent 55%),
      #f8fbff;
    animation: meshShift 12s ease-in-out infinite alternate;
  }
  @keyframes meshShift {
    0%   { filter: hue-rotate(0deg) brightness(1); }
    100% { filter: hue-rotate(18deg) brightness(1.02); }
  }

  /* ── floating orbs ── */
  .orb {
    position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
    animation: orbFloat linear infinite;
  }
  .orb-1 { width:400px; height:400px; top:-100px; left:-100px; opacity:0.15;
    background: radial-gradient(circle, rgba(15,157,116,0.5), transparent 70%);
    animation-duration: 22s; }
  .orb-2 { width:300px; height:300px; bottom:40px; right:-80px; opacity:0.13;
    background: radial-gradient(circle, rgba(47,143,182,0.5), transparent 70%);
    animation-duration: 17s; animation-delay: -8s; }
  .orb-3 { width:200px; height:200px; top:40%; left:55%; opacity:0.18;
    background: radial-gradient(circle, rgba(141,196,255,0.5), transparent 70%);
    animation-duration: 28s; animation-delay: -14s; }
  .orb-4 { width:150px; height:150px; top:65%; left:15%; opacity:0.12;
    background: radial-gradient(circle, rgba(15,157,116,0.45), transparent 70%);
    animation-duration: 19s; animation-delay: -5s; }

  @keyframes orbFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    25%      { transform: translate(25px,-35px) scale(1.05); }
    50%      { transform: translate(40px,20px) scale(0.96); }
    75%      { transform: translate(-15px,30px) scale(1.08); }
  }

  /* ── page wrapper — sits ABOVE fixed bg, scrolls normally ── */
  .hms-page {
    position: relative; z-index: 1;
    min-height: 100vh;
    display: flex; flex-direction: column;
    width: 100%;
    padding-top: var(--nav-h);
  }

  /* ── hero ── */
  .hms-hero {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 80px 24px 60px;
    text-align: center;
  }

  /* floating badge */
  .hms-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(15,157,116,0.10);
    border: 1px solid rgba(15,157,116,0.22);
    border-radius: 24px;
    padding: 8px 20px;
    font-size: 13px; font-weight: 500; color: #0b7d5d;
    margin-bottom: 32px;
    animation: fadeSlideIn 0.6s ease both;
    box-shadow: 0 2px 12px rgba(15,157,116,0.10);
  }
  .badge-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #10b981;
    animation: pulse 2s ease infinite;
  }
  @keyframes pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
    50%      { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
  }

  /* title */
  .hms-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(44px, 8vw, 82px);
    line-height: 1.04; letter-spacing: -2.5px;
    color: var(--text);
    margin-bottom: 22px;
    animation: fadeSlideIn 0.7s 0.1s ease both;
  }
  .hms-title .gradient-word {
    background: linear-gradient(100deg, #0f9d74 0%, #1ab8d6 50%, #2f8fb6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    background-size: 200% auto;
    animation: shimmerText 4s linear infinite;
  }
  @keyframes shimmerText {
    from { background-position: 0% center; }
    to   { background-position: 200% center; }
  }

  .hms-subtitle {
    font-size: 18px; color: #5f6f87; font-weight: 400;
    max-width: 540px; line-height: 1.75;
    margin-bottom: 48px;
    animation: fadeSlideIn 0.7s 0.2s ease both;
  }

  @keyframes fadeSlideIn {
    from { opacity:0; transform: translateY(22px); }
    to   { opacity:1; transform: translateY(0); }
  }

  /* CTA buttons */
  .hms-cta {
    display: flex; gap: 14px; flex-wrap: wrap; justify-content: center;
    margin-bottom: 56px;
    animation: fadeSlideIn 0.7s 0.3s ease both;
  }
  .btn-primary-glow {
    display: inline-flex; align-items: center; gap: 9px;
    padding: 16px 36px; border-radius: 14px; border: none;
    background: linear-gradient(135deg, #0f9d74, #2f8fb6);
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 16px; font-weight: 600; cursor: pointer;
    box-shadow: 0 10px 30px rgba(15,157,116,0.25), 0 4px 16px rgba(16,32,51,0.08);
    transition: transform 0.2s, box-shadow 0.2s;
    text-decoration: none; position: relative; overflow: hidden;
  }
  .btn-primary-glow::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0; transition: opacity 0.2s;
  }
  .btn-primary-glow:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(15,157,116,0.30), 0 8px 24px rgba(16,32,51,0.10);
  }
  .btn-primary-glow:hover::before { opacity: 1; }
  .btn-primary-glow:active { transform: translateY(0); }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 9px;
    padding: 15px 34px; border-radius: 14px;
    border: 1.5px solid rgba(15,23,42,0.10);
    background: var(--glass); backdrop-filter: blur(8px);
    color: var(--text); font-family: 'DM Sans', sans-serif;
    font-size: 16px; font-weight: 500; cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
    text-decoration: none;
  }
  .btn-ghost:hover {
    background: rgba(255,255,255,0.98);
    border-color: rgba(15,23,42,0.14);
    transform: translateY(-2px);
  }

  /* ── profile welcome card (shown after login) ── */
  .hms-profile-welcome {
    display: flex; align-items: center; gap: 18px;
    background: rgba(255,255,255,0.90);
    border: 1px solid rgba(15,157,116,0.18);
    border-radius: 20px; padding: 20px 28px;
    margin-bottom: 56px;
    animation: fadeSlideIn 0.5s ease both;
    box-shadow: 0 8px 28px rgba(15,157,116,0.10);
    backdrop-filter: blur(10px);
    flex-wrap: wrap; justify-content: center;
  }
  .profile-avatar-lg {
    width: 56px; height: 56px; border-radius: 50%;
    background: linear-gradient(135deg, #0f9d74, #2f8fb6);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; font-weight: 700; color: #fff;
    box-shadow: 0 4px 16px rgba(15,157,116,0.28);
    flex-shrink: 0;
  }
  .profile-welcome-text { text-align: left; }
  .profile-welcome-text h3 { font-size: 17px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
  .profile-welcome-text p { font-size: 13px; color: #5f6f87; }
  .btn-book-now {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 24px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, #0f9d74, #2f8fb6);
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600; cursor: pointer;
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 6px 18px rgba(15,157,116,0.22);
  }
  .btn-book-now:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(15,157,116,0.28); }
  .btn-logout {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 11px 20px; border-radius: 12px;
    border: 1.5px solid rgba(15,23,42,0.10);
    background: transparent;
    color: #5f6f87; font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500; cursor: pointer;
    transition: all 0.2s;
  }
  .btn-logout:hover { background: rgba(239,68,68,0.06); border-color: rgba(239,68,68,0.25); color: #dc2626; }

  /* ── stats strip ── */
  .hms-stats {
    display: flex; gap: 0; flex-wrap: wrap; justify-content: center;
    border: 1px solid var(--border);
    border-radius: 22px; overflow: hidden;
    backdrop-filter: blur(12px);
    background: rgba(255,255,255,0.85);
    margin-bottom: 80px;
    max-width: 720px; width: 100%;
    animation: fadeSlideIn 0.7s 0.45s ease both;
    box-shadow: 0 8px 32px rgba(15,23,42,0.06);
  }
  .hms-stat {
    flex: 1; min-width: 150px; padding: 24px 28px;
    text-align: center;
    border-right: 1px solid var(--border);
    transition: background 0.2s;
  }
  .hms-stat:hover { background: rgba(15,157,116,0.04); }
  .hms-stat:last-child { border-right: none; }
  .stat-number {
    font-family: 'DM Serif Display', serif;
    font-size: 32px; color: #0f9d74;
    display: block; margin-bottom: 4px;
    background: linear-gradient(90deg, #0f9d74, #2f8fb6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .stat-label { font-size: 12px; color: #5f6f87; font-weight: 500; letter-spacing: 0.5px; }

  /* ── scroll-triggered reveal ── */
  .reveal {
    opacity: 0; transform: translateY(32px);
    transition: opacity 0.65s ease, transform 0.65s ease;
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }

  /* ── section heading ── */
  .section-eyebrow {
    display: inline-block;
    font-size: 11px; font-weight: 700; letter-spacing: 1.8px;
    text-transform: uppercase; color: var(--emerald);
    background: rgba(15,157,116,0.09);
    padding: 5px 14px; border-radius: 20px;
    margin-bottom: 14px;
  }
  .section-heading {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(28px, 4vw, 40px); text-align: center;
    color: var(--text); margin-bottom: 10px; letter-spacing: -1px;
  }
  .section-sub {
    text-align: center; color: #5f6f87; font-size: 15px;
    margin-bottom: 44px; max-width: 460px;
  }

  /* ── FEATURE HIGHLIGHTS ── */
  .hms-features {
    padding: 0 24px 80px;
    max-width: 1100px; width: 100%; margin: 0 auto;
    text-align: center;
  }
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
  }
  .feature-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px; padding: 32px 24px;
    text-align: left;
    backdrop-filter: blur(8px);
    transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
    position: relative; overflow: hidden;
  }
  .feature-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--emerald), var(--teal));
    opacity: 0; transition: opacity 0.25s;
  }
  .feature-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 48px rgba(15,157,116,0.12);
    border-color: rgba(15,157,116,0.18);
  }
  .feature-card:hover::before { opacity: 1; }
  .feature-icon-wrap {
    width: 52px; height: 52px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; margin-bottom: 16px;
  }
  .feature-name { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
  .feature-desc { font-size: 13px; color: #5f6f87; line-height: 1.6; }

  /* ── services grid ── */
  .hms-services {
    padding: 0 24px 80px;
    max-width: 1100px; width: 100%; margin: 0 auto;
    text-align: center;
  }
  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
  .service-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px; padding: 28px 20px;
    text-align: center; cursor: pointer;
    transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s, background 0.22s;
    backdrop-filter: blur(8px);
    position: relative; overflow: hidden;
  }
  .service-card::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(15,157,116,0.05), rgba(47,143,182,0.05));
    opacity: 0; transition: opacity 0.22s;
  }
  .service-card:hover {
    transform: translateY(-5px);
    background: rgba(255,255,255,0.98);
    border-color: rgba(15,157,116,0.22);
    box-shadow: 0 14px 40px rgba(15,157,116,0.12);
  }
  .service-card:hover::after { opacity: 1; }
  .svc-icon {
    font-size: 36px; display: block; margin-bottom: 12px;
    transition: transform 0.22s;
  }
  .service-card:hover .svc-icon { transform: scale(1.12) rotate(-4deg); }
  .svc-name { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
  .svc-desc { font-size: 12px; color: #5f6f87; line-height: 1.55; }

  /* ── HOW IT WORKS ── */
  .hms-how {
    padding: 0 24px 80px;
    max-width: 900px; width: 100%; margin: 0 auto;
    text-align: center;
  }
  .steps-row {
    display: flex; gap: 0; flex-wrap: nowrap;
    position: relative;
    justify-content: center;
  }
  .steps-row::before {
    content: '';
    position: absolute; top: 28px; left: 12%; right: 12%;
    height: 2px;
    background: linear-gradient(90deg, var(--emerald), var(--teal));
    opacity: 0.25;
  }
  .step-item {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    padding: 0 16px; position: relative;
  }
  .step-num {
    width: 56px; height: 56px; border-radius: 50%;
    background: linear-gradient(135deg, #0f9d74, #2f8fb6);
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Serif Display', serif;
    font-size: 22px; color: #fff;
    box-shadow: 0 6px 20px rgba(15,157,116,0.28);
    margin-bottom: 16px; position: relative; z-index: 1;
  }
  .step-title { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
  .step-desc { font-size: 12px; color: #5f6f87; line-height: 1.55; }

  /* ── testimonials ── */
  .hms-testimonials {
    padding: 0 24px 80px;
    max-width: 1000px; width: 100%; margin: 0 auto;
    text-align: center;
  }
  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
    gap: 18px;
  }
  .testimonial-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 28px 24px;
    backdrop-filter: blur(8px);
    text-align: left;
    transition: transform 0.22s, box-shadow 0.22s;
    position: relative;
  }
  .testimonial-card::before {
    content: '"';
    position: absolute; top: 16px; right: 24px;
    font-family: 'DM Serif Display', serif;
    font-size: 64px; line-height: 1;
    color: rgba(15,157,116,0.10);
    pointer-events: none;
  }
  .testimonial-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(15,23,42,0.08);
  }
  .t-stars { color: #f59e0b; font-size: 15px; margin-bottom: 14px; letter-spacing: 2px; }
  .t-text { font-size: 14px; color: #4a5a6e; line-height: 1.7; margin-bottom: 18px; font-style: italic; }
  .t-author { display: flex; align-items: center; gap: 12px; }
  .t-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    flex-shrink: 0;
  }
  .t-name { font-size: 14px; font-weight: 700; color: var(--text); }
  .t-role { font-size: 11px; color: #5f6f87; margin-top: 2px; }

  /* ── emergency banner ── */
  .emergency-banner {
    margin: 0 24px 72px;
    max-width: 1060px; width: calc(100% - 48px);
    align-self: center;
    background: linear-gradient(135deg, rgba(255,233,233,0.96), rgba(255,248,248,0.90));
    border: 1px solid rgba(239,68,68,0.18);
    border-radius: 22px; padding: 28px 36px;
    display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
    box-shadow: 0 8px 32px rgba(239,68,68,0.06);
  }
  .emg-icon { font-size: 36px; animation: wiggle 3s ease-in-out infinite; }
  @keyframes wiggle {
    0%,90%,100% { transform: rotate(0deg); }
    92% { transform: rotate(-10deg); }
    96% { transform: rotate(10deg); }
  }
  .emg-text { flex: 1; }
  .emg-text h4 { font-size: 17px; font-weight: 700; color: #b42318; margin-bottom: 5px; }
  .emg-text p { font-size: 13px; color: #5f6f87; line-height: 1.5; }
  .emg-phone {
    background: rgba(255,255,255,0.94); border: 1px solid rgba(239,68,68,0.18);
    color: #b42318; border-radius: 12px; padding: 12px 24px;
    font-size: 17px; font-weight: 700; cursor: pointer; text-decoration: none;
    transition: background 0.2s, transform 0.15s;
    white-space: nowrap;
  }
  .emg-phone:hover { background: rgba(255,233,233,0.98); transform: translateY(-2px); }

  /* ── footer ── */
  .hms-footer {
    border-top: 1px solid var(--border);
    padding: 22px 48px;
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;
    backdrop-filter: blur(10px);
    background: rgba(255,255,255,0.75);
    font-size: 13px; color: #5f6f87;
  }
  .footer-brand {
    display: flex; align-items: center; gap: 8px;
    font-family: 'DM Serif Display', serif; font-size: 16px; color: var(--text);
  }
  .footer-links { display: flex; gap: 22px; }
  .footer-links a { color: #5f6f87; text-decoration: none; transition: color 0.2s; font-size: 13px; }
  .footer-links a:hover { color: var(--emerald); }
  .footer-copy { font-size: 12px; color: #8fa0b8; }

  @media (max-width: 640px) {
    .hms-hero { padding: 56px 16px 44px; }
    .hms-stat { padding: 18px 14px; min-width: 110px; }
    .steps-row { flex-wrap: wrap; }
    .steps-row::before { display: none; }
    .hms-footer { padding: 18px 20px; }
    .hms-profile-welcome { gap: 12px; }
  }
`;

function injectStyles() {
  if (document.getElementById("hms-styles")) return;
  const tag = document.createElement("style");
  tag.id = "hms-styles";
  tag.textContent = GLOBAL_CSS;
  document.head.appendChild(tag);
}

function useReveal() {
  useEffect(() => {
    const runReveal = () => {
      const els = document.querySelectorAll(".reveal");
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
        { threshold: 0.10 }
      );
      els.forEach((el) => io.observe(el));
      return io;
    };
    // slight delay so DOM is ready
    const timer = setTimeout(() => {
      const io = runReveal();
      return () => io.disconnect();
    }, 100);
    return () => clearTimeout(timer);
  }, []);
}

// ── Helper: get logged-in user from localStorage ───────────────────────────
// Adapt this to however your auth stores the user (context, redux, etc.)
function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user"); // e.g. { name, email, role }
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return { user, logout };
}

// ── Data ───────────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: "🩺", name: "General Medicine", desc: "Primary care for everyday health" },
  { icon: "🫀", name: "Cardiology",        desc: "Advanced cardiac diagnostics" },
  { icon: "🧠", name: "Neurology",         desc: "Brain & nervous system care" },
  { icon: "🦷", name: "Dental Care",       desc: "Complete oral health services" },
  { icon: "👶", name: "Pediatrics",        desc: "Expert care for all ages" },
  { icon: "🔬", name: "Pathology",         desc: "Accurate lab diagnostics" },
  { icon: "🦴", name: "Orthopedics",       desc: "Bone, joint & muscle care" },
  { icon: "👁️", name: "Ophthalmology",     desc: "Eye care & vision correction" },
];

const STATS = [
  { number: "12K+",   label: "Happy Patients" },
  { number: "200+",   label: "Specialists" },
  { number: "24 / 7", label: "Emergency Care" },
  { number: "30+",    label: "Departments" },
];

const FEATURES = [
  {
    icon: "📱", bg: "rgba(15,157,116,0.10)", color: "#0b7d5d",
    name: "Online Appointments",
    desc: "Book consultations in seconds. Choose your specialist, pick a slot, done."
  },
  {
    icon: "🗂️", bg: "rgba(47,143,182,0.10)", color: "#1d6fa8",
    name: "Digital Health Records",
    desc: "All your reports, prescriptions & history in one secure, accessible place."
  },
  {
    icon: "💬", bg: "rgba(139,92,246,0.10)", color: "#6d28d9",
    name: "Doctor Messaging",
    desc: "Follow up with your care team anytime — fast, private, and convenient."
  },
  {
    icon: "🔔", bg: "rgba(245,158,11,0.10)", color: "#b45309",
    name: "Smart Reminders",
    desc: "Never miss a medication or appointment with personalised alerts."
  },
];

const STEPS = [
  { num: "1", title: "Create Account",    desc: "Sign up in under a minute with just your email." },
  { num: "2", title: "Choose Specialist", desc: "Browse 200+ doctors across 30+ departments." },
  { num: "3", title: "Book Appointment",  desc: "Pick a date & time that suits you perfectly." },
  { num: "4", title: "Get Expert Care",   desc: "Visit in-person or consult from home online." },
];

const TESTIMONIALS = [
  {
    text: "The staff were incredibly compassionate and professional. My recovery was smooth thanks to the dedicated team.",
    name: "Ananya S.", role: "Cardiology Patient", color: "#059669", initials: "AS",
  },
  {
    text: "Booking my appointment online was effortless. The doctors are world-class and the facility is spotless.",
    name: "Ravi M.", role: "Orthopedics Patient", color: "#0d9488", initials: "RM",
  },
  {
    text: "Best hospital in Hyderabad. Quick diagnosis, clear communication — I felt cared for at every step.",
    name: "Priya K.", role: "Neurology Patient", color: "#7c3aed", initials: "PK",
  },
];

// ── Component ──────────────────────────────────────────────────────────────
function Home() {
  injectStyles();
  useReveal();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  // derive initials & greeting from user object
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <>
      {/* ── Fixed decorative background (does NOT wrap content) ── */}
      <div className="hms-bg-fixed" aria-hidden="true" />
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />
      <div className="orb orb-4" aria-hidden="true" />

      {/* ── Scrollable page content ── */}
      <div className="hms-page">

        {/* ── NAVBAR ── */}
        <Navbar />

        {/* ── HERO ── */}
        <section className="hms-hero">
          <div className="hms-badge">
            <span className="badge-dot" />
            Trusted by 12,000+ patients across Hyderabad
          </div>

          <h1 className="hms-title">
            Your Health,<br />
            <span className="gradient-word">Our Priority.</span>
          </h1>

          <p className="hms-subtitle">
            World-class healthcare with compassionate specialists. Book appointments,
            access records, and manage your health — all in one seamless platform.
          </p>

          {/* ── AUTH-AWARE CTA ── */}
          {user ? (
            /* ── Logged-in: show welcome card with profile ── */
            <div className="hms-profile-welcome">
              <div className="profile-avatar-lg">{initials}</div>
              <div className="profile-welcome-text">
                <h3>Welcome back, {firstName}! 👋</h3>
                <p>{user.email} · {user.role || "Patient"}</p>
              </div>
              <Link to="/appointments/book" className="btn-book-now">
                📅 Book Appointment
              </Link>
              <Link to="/dashboard" className="btn-ghost" style={{ fontSize: 14, padding: "11px 20px" }}>
                🏠 Dashboard
              </Link>
              <button className="btn-logout" onClick={logout}>
                🚪 Logout
              </button>
            </div>
          ) : (
            /* ── Not logged in: show Login / Signup buttons ── */
            <div className="hms-cta">
              <Link to="/login" className="btn-primary-glow">🔑 Patient Login</Link>
              <Link to="/signup" className="btn-ghost">✨ Create Account</Link>
            </div>
          )}

          {/* Stats strip */}
          <div className="hms-stats">
            {STATS.map((s) => (
              <div className="hms-stat" key={s.label}>
                <span className="stat-number">{s.number}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="hms-features reveal">
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            <span className="section-eyebrow">Why Choose Us</span>
            <h2 className="section-heading">Everything you need, in one place</h2>
            <p className="section-sub">
              Streamlined tools to make managing your health effortless.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div className="feature-card" key={f.name}>
                <div className="feature-icon-wrap" style={{ background: f.bg }}>
                  {f.icon}
                </div>
                <div className="feature-name">{f.name}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section className="hms-services reveal">
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            <span className="section-eyebrow">Departments</span>
            <h2 className="section-heading">Our Specialities</h2>
            <p className="section-sub">Comprehensive care across 30+ medical departments</p>
          </div>
          <div className="services-grid">
            {SERVICES.map((svc) => (
              <div className="service-card" key={svc.name}>
                <span className="svc-icon">{svc.icon}</span>
                <div className="svc-name">{svc.name}</div>
                <div className="svc-desc">{svc.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="hms-how reveal">
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            <span className="section-eyebrow">Simple Process</span>
            <h2 className="section-heading">How It Works</h2>
            <p className="section-sub" style={{ marginBottom: 52 }}>
              From sign-up to expert care in four easy steps.
            </p>
          </div>
          <div className="steps-row">
            {STEPS.map((s) => (
              <div className="step-item" key={s.num}>
                <div className="step-num">{s.num}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="hms-testimonials reveal">
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            <span className="section-eyebrow">Patient Stories</span>
            <h2 className="section-heading">Voices of Trust</h2>
            <p className="section-sub">Real experiences from our community</p>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div className="testimonial-card" key={t.name}>
                <div className="t-stars">★ ★ ★ ★ ★</div>
                <p className="t-text">{t.text}</p>
                <div className="t-author">
                  <div className="t-avatar" style={{ background: t.color }}>{t.initials}</div>
                  <div>
                    <div className="t-name">{t.name}</div>
                    <div className="t-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── EMERGENCY BANNER ── */}
        <div className="emergency-banner reveal">
          <span className="emg-icon">🚨</span>
          <div className="emg-text">
            <h4>24 / 7 Emergency Services</h4>
            <p>Our emergency team is always on standby. Don't wait — call us immediately for urgent care.</p>
          </div>
          <a href="tel:108" className="emg-phone">📞 Call 108</a>
        </div>

        {/* ── FOOTER ── */}
        <footer className="hms-footer">
          <div className="footer-brand">🏥 MediCare Plus</div>
          <span className="footer-copy">© {year} MediCare Plus · Hyderabad, Telangana</span>
          <div className="footer-links">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/contact">Contact</a>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Home;