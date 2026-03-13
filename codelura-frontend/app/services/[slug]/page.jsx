"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/api";


/* ─── animation variants ─── */
const fadeUp = { hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0 } };
const fadeIn  = { hidden: { opacity: 0 },        show: { opacity: 1 } };
const scaleIn = { hidden: { opacity: 0, scale: 0.94 }, show: { opacity: 1, scale: 1 } };

export default function ServiceDetailPage() {
  const { slug }   = useParams();
  const router     = useRouter();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res = await api.get(`/services/${slug}`);
        setService(res.data.data || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#080B14", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      <div style={{ textAlign:"center" }}>
        <div className="cl-spinner" style={{ margin:"0 auto 16px" }} />
        <p style={{ color:"rgba(255,255,255,0.4)", fontFamily:"DM Sans,sans-serif" }}>Loading service...</p>
      </div>
    </div>
  );

  if (!service) return (
    <div style={{ minHeight:"100vh", background:"#080B14", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <p style={{ color:"rgba(255,255,255,0.4)", fontFamily:"DM Sans,sans-serif" }}>Service not found.</p>
    </div>
  );

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      <style>{`
        
        .syne { font-family:'Syne',sans-serif !important; }

        .orb { position:absolute; border-radius:50%; filter:blur(110px); pointer-events:none; z-index:0; }
        .cl-wrap { max-width:1200px; margin:0 auto; padding:0 24px; }

        .cl-line {
          height:1px;
          background:linear-gradient(90deg,transparent,rgba(255,107,53,0.35),transparent);
          margin-bottom:64px;
        }

        .cl-grad {
          background:linear-gradient(90deg,#ff6b35,#ffb347);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
        }

        /* pill */
        .cl-pill {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(255,107,53,0.1); border:1px solid rgba(255,107,53,0.3);
          color:#ff6b35; border-radius:100px; padding:5px 16px;
          font-size:11px; font-weight:700; letter-spacing:.09em;
          text-transform:uppercase; font-family:'DM Sans',sans-serif;
        }

        /* preview pill */
        .cl-preview {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.14);
          color:rgba(255,255,255,0.72); border-radius:100px; padding:5px 16px;
          font-size:11px; font-weight:700; letter-spacing:.09em;
          text-transform:uppercase; font-family:'DM Sans',sans-serif;
          cursor:pointer; text-decoration:none;
          transition:border-color .2s, background .2s, color .2s;
        }
        .cl-preview:hover { border-color:rgba(255,107,53,0.55); background:rgba(255,107,53,0.08); color:#ff6b35; }

        .cl-live-dot {
          width:7px; height:7px; border-radius:50%;
          background:#22c55e; box-shadow:0 0 7px #22c55e;
          animation:cl-blink 1.6s ease-in-out infinite;
        }
        @keyframes cl-blink { 0%,100%{opacity:1} 50%{opacity:.25} }

        /* glass */
        .cl-glass {
          background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
          border-radius:20px; transition:border-color .3s, transform .3s, background .3s;
          position:relative; overflow:hidden;
        }
        .cl-glass::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(255,107,53,0.04),transparent 60%);
          opacity:0; transition:opacity .3s;
        }
        .cl-glass:hover { border-color:rgba(255,107,53,0.38); transform:translateY(-3px); }
        .cl-glass:hover::before { opacity:1; }

        /* image */
        .cl-img-frame { border-radius:24px; overflow:hidden; border:1px solid rgba(255,255,255,0.08); position:relative; }
        .cl-img-frame::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(180deg,transparent 55%,rgba(8,11,20,0.65) 100%);
          pointer-events:none;
        }

        /* stat */
        .cl-stat {
          background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
          border-radius:14px; padding:16px 20px; text-align:center;
          transition:border-color .25s;
        }
        .cl-stat:hover { border-color:rgba(255,107,53,0.3); }

        /* dot */
        .cl-dot { width:7px; height:7px; border-radius:50%; background:#ff6b35; flex-shrink:0; box-shadow:0 0 8px rgba(255,107,53,.6); }

        /* tech */
        .cl-tech {
          display:inline-block; background:rgba(255,107,53,0.07);
          border:1px solid rgba(255,107,53,0.2); color:#ff9a55;
          border-radius:10px; padding:7px 18px; font-size:13px; font-weight:500;
          font-family:'DM Sans',sans-serif; transition:background .2s, border-color .2s;
        }
        .cl-tech:hover { background:rgba(255,107,53,0.14); border-color:rgba(255,107,53,0.45); }

        /* step */
        .cl-step {
          width:52px; height:52px; border-radius:50%;
          background:rgba(255,107,53,0.1); border:1px solid rgba(255,107,53,0.3);
          color:#ff6b35; font-size:20px; font-weight:800;
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0; font-family:'Syne',sans-serif;
          box-shadow:0 0 22px rgba(255,107,53,0.15);
        }

        /* faq */
        .cl-faq {
          background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
          border-radius:16px; overflow:hidden; transition:border-color .3s; cursor:pointer;
        }
        .cl-faq.open,.cl-faq:hover { border-color:rgba(255,107,53,0.38); }
        .cl-faq-body { overflow:hidden; transition:max-height .38s ease,opacity .3s ease; }
        .cl-faq-body.open  { max-height:500px; opacity:1; }
        .cl-faq-body.close { max-height:0; opacity:0; }

        /* price */
        .cl-price-card {
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
          border-radius:22px; padding:32px;
          transition:border-color .3s,transform .3s; position:relative; overflow:hidden;
        }
        .cl-price-card:hover { border-color:rgba(255,107,53,0.45); transform:translateY(-5px); }
        .cl-price-card.featured {
          border-color:rgba(255,107,53,0.55); background:rgba(255,107,53,0.07);
          box-shadow:0 0 40px rgba(255,107,53,0.08);
        }
        .cl-price-card.featured::before {
          content:'Most Popular'; position:absolute; top:16px; right:16px;
          background:linear-gradient(135deg,#ff6b35,#ffb347); color:#fff;
          font-size:11px; font-weight:700; border-radius:100px; padding:3px 12px;
          font-family:'DM Sans',sans-serif; letter-spacing:.06em;
        }

        /* buttons */
        .cl-btn-p {
          display:inline-flex; align-items:center; gap:8px;
          background:linear-gradient(135deg,#ff6b35,#ffb347);
          border:none; border-radius:12px; color:#fff;
          font-size:15px; font-weight:700; cursor:pointer; padding:14px 30px;
          transition:opacity .2s,transform .2s,box-shadow .2s;
          font-family:'Syne',sans-serif; letter-spacing:.02em; white-space:nowrap;
          box-shadow:0 4px 24px rgba(255,107,53,0.28);
        }
        .cl-btn-p:hover { opacity:.88; transform:translateY(-2px); box-shadow:0 8px 32px rgba(255,107,53,0.4); }

        .cl-btn-o {
          display:inline-flex; align-items:center; gap:8px;
          background:transparent; border:1px solid rgba(255,107,53,0.4);
          border-radius:12px; color:#ff6b35; font-size:15px; font-weight:600;
          cursor:pointer; padding:14px 30px;
          transition:background .2s,border-color .2s,transform .2s;
          font-family:'DM Sans',sans-serif; white-space:nowrap;
        }
        .cl-btn-o:hover { background:rgba(255,107,53,0.08); border-color:rgba(255,107,53,0.7); transform:translateY(-2px); }

        /* spinner */
        @keyframes cl-spin { to { transform:rotate(360deg); } }
        .cl-spinner { width:38px; height:38px; border-radius:50%; border:3px solid rgba(255,107,53,0.15); border-top-color:#ff6b35; animation:cl-spin .8s linear infinite; }

        /* responsive */
        @media(max-width:900px) {
          .cl-hero-grid  { grid-template-columns:1fr !important; }
          .cl-feat-grid  { grid-template-columns:1fr 1fr !important; }
          .cl-proc-grid  { grid-template-columns:1fr 1fr !important; }
          .cl-price-grid { grid-template-columns:1fr !important; }
          .cl-ideal-grid { grid-template-columns:1fr !important; }
        }
        @media(max-width:560px) {
          .cl-feat-grid { grid-template-columns:1fr !important; }
          .cl-proc-grid { grid-template-columns:1fr !important; }
          .cl-stat-row  { grid-template-columns:1fr 1fr !important; }
        }
      `}</style>

      <main style={{ background:"#080B14", color:"#fff", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", overflowX:"hidden" }}>

        {/* ──────────── HERO ──────────── */}
        <section style={{ position:"relative", padding:"110px 0 90px", overflow:"hidden" }}>
          <div className="orb" style={{ width:800, height:380, background:"rgba(255,107,53,0.09)", top:"-15%", left:"50%", transform:"translateX(-50%)" }} />
          <div className="orb" style={{ width:300, height:300, background:"rgba(255,60,53,0.06)", top:"20%", right:"0" }} />
          <div className="orb" style={{ width:200, height:200, background:"rgba(255,180,53,0.05)", bottom:"0", left:"5%" }} />

          <div className="cl-wrap" style={{ position:"relative", zIndex:1 }}>
            <div className="cl-hero-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center" }}>

              {/* left */}
              <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration:0.65 }}>
                {/* tags row */}
                <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:22 }}>
                  <span className="cl-pill">{service.category?.toUpperCase()} SERVICE</span>

                  {/* ── CHECK PREVIEW TAG ── */}
                  {service.previewUrl ? (
                    <a href={service.previewUrl} target="_blank" rel="noopener noreferrer" className="cl-preview">
                      <span className="cl-live-dot" />
                      Check Preview
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M2 9L9 2M9 2H4M9 2V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  ) : (
                    <span className="cl-preview">
                      <span className="cl-live-dot" />
                      Live Preview
                    </span>
                  )}
                </div>

                <h1 className="syne" style={{ fontSize:"clamp(32px,5vw,62px)", fontWeight:800, lineHeight:1.08, letterSpacing:"-0.025em", marginBottom:20 }}>
                  {service.title}
                </h1>

                <p style={{ fontSize:16, lineHeight:1.85, color:"rgba(255,255,255,0.48)", maxWidth:480, marginBottom:36 }}>
                  {service.shortDescription || service.description}
                </p>

                <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                  <button className="cl-btn-p" onClick={() => router.push(`/Enquiries?service=${encodeURIComponent(service.title)}`)}>
                    Get Free Consultation
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button className="cl-btn-o" onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior:"smooth" })}>
                    View Pricing
                  </button>
                </div>

                {/* mini stats */}
                <div className="cl-stat-row" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginTop:36 }}>
                  {[{ val:"100%", label:"Client Satisfaction" }, { val:"48h", label:"Avg. Response" }, { val:"200+", label:"Projects Delivered" }].map(s => (
                    <div key={s.label} className="cl-stat">
                      <div className="syne" style={{ fontSize:22, fontWeight:800, color:"#ff6b35" }}>{s.val}</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,0.36)", marginTop:3 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* right — image */}
              {service.image && (
                <motion.div className="cl-img-frame" variants={scaleIn} initial="hidden" animate="show" transition={{ duration:0.7 }}>
                  <img src={service.image} alt={service.title} style={{ width:"100%", height:430, objectFit:"cover", display:"block" }} />
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* ──────────── ABOUT ──────────── */}
        <section style={{ padding:"80px 0" }}>
          <div className="cl-wrap">
            <div className="cl-line" />
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ duration:0.5 }} style={{ maxWidth:820 }}>
              <span className="cl-pill" style={{ marginBottom:18, display:"inline-flex" }}>About</span>
              <h2 className="syne" style={{ fontSize:"clamp(26px,4vw,46px)", fontWeight:800, margin:"16px 0 22px", letterSpacing:"-0.02em" }}>
                About this <span className="cl-grad">service</span>
              </h2>
              <p style={{ fontSize:16, lineHeight:1.9, color:"rgba(255,255,255,0.48)" }}>{service.description}</p>
            </motion.div>
          </div>
        </section>

        {/* ──────────── IDEAL FOR ──────────── */}
        {service.idealFor?.length > 0 && (
          <section style={{ padding:"0 0 80px" }}>
            <div className="cl-wrap">
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ duration:0.5 }}>
                <span className="cl-pill" style={{ marginBottom:18, display:"inline-flex" }}>Ideal For</span>
                <h2 className="syne" style={{ fontSize:"clamp(24px,3.5vw,40px)", fontWeight:800, margin:"16px 0 34px", letterSpacing:"-0.02em" }}>
                  Who should <span className="cl-grad">choose this?</span>
                </h2>
                <div className="cl-ideal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  {service.idealFor.map((item, i) => (
                    <motion.div key={i} className="cl-glass" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:i*0.07, duration:0.4 }}
                      style={{ padding:"20px 24px", display:"flex", alignItems:"center", gap:16 }}>
                      <span style={{ fontSize:22, flexShrink:0 }}>🎯</span>
                      <span style={{ fontSize:15, color:"rgba(255,255,255,0.7)", lineHeight:1.5 }}>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* ──────────── FEATURES ──────────── */}
        {service.features?.length > 0 && (
          <section style={{ padding:"0 0 80px" }}>
            <div className="cl-wrap">
              <div className="cl-line" />
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ duration:0.5 }}>
                <span className="cl-pill" style={{ marginBottom:18, display:"inline-flex" }}>Features</span>
                <h2 className="syne" style={{ fontSize:"clamp(24px,3.5vw,44px)", fontWeight:800, margin:"16px 0 38px", letterSpacing:"-0.02em" }}>
                  What we <span className="cl-grad">offer</span>
                </h2>
              </motion.div>
              <div className="cl-feat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
                {service.features.map((feature, i) => (
                  <motion.div key={i} className="cl-glass" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:i*0.07, duration:0.4 }}
                    style={{ padding:"26px", display:"flex", alignItems:"flex-start", gap:16 }}>
                    <div className="cl-dot" style={{ marginTop:7 }} />
                    <p style={{ fontSize:15, color:"rgba(255,255,255,0.62)", lineHeight:1.75 }}>{feature}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ──────────── TECH STACK ──────────── */}
        {service.techStack?.length > 0 && (
          <section style={{ padding:"0 0 80px" }}>
            <div className="cl-wrap">
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ duration:0.5 }}>
                <span className="cl-pill" style={{ marginBottom:18, display:"inline-flex" }}>Tech Stack</span>
                <h2 className="syne" style={{ fontSize:"clamp(24px,3.5vw,44px)", fontWeight:800, margin:"16px 0 34px", letterSpacing:"-0.02em" }}>
                  Technologies we <span className="cl-grad">use</span>
                </h2>
                <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                  {service.techStack.map((tech, i) => (
                    <motion.span key={i} className="cl-tech" variants={fadeIn} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:i*0.05 }}>
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* ──────────── PROCESS ──────────── */}
        {service.process?.length > 0 && (
          <section style={{ padding:"0 0 80px" }}>
            <div className="cl-wrap">
              <div className="cl-line" />
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ duration:0.5 }}>
                <span className="cl-pill" style={{ marginBottom:18, display:"inline-flex" }}>Process</span>
                <h2 className="syne" style={{ fontSize:"clamp(24px,3.5vw,44px)", fontWeight:800, margin:"16px 0 42px", letterSpacing:"-0.02em" }}>
                  How we <span className="cl-grad">work</span>
                </h2>
              </motion.div>
              <div className="cl-proc-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
                {service.process.map((step, i) => (
                  <motion.div key={i} className="cl-glass" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.4 }}
                    style={{ padding:"30px 22px", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:18 }}>
                    <div className="cl-step">{i + 1}</div>
                    <p style={{ fontSize:14, color:"rgba(255,255,255,0.55)", lineHeight:1.75 }}>{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ──────────── PRICING ──────────── */}
        {(service.startingPrice || service.pricing?.length > 0) && (
          <section id="pricing" style={{ padding:"0 0 80px" }}>
            <div className="cl-wrap">
              <div className="cl-line" />
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ duration:0.5 }} style={{ textAlign:"center", marginBottom:48 }}>
                <span className="cl-pill" style={{ marginBottom:18, display:"inline-flex" }}>Pricing</span>
                <h2 className="syne" style={{ fontSize:"clamp(26px,4vw,50px)", fontWeight:800, margin:"16px 0 12px", letterSpacing:"-0.02em" }}>
                  Flexible <span className="cl-grad">Pricing</span>
                </h2>
                <p style={{ color:"rgba(255,255,255,0.4)", fontSize:16 }}>Tailored to your requirements</p>
              </motion.div>

              {service.pricing?.length > 0 && (
                <div className="cl-price-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginBottom:36 }}>
                  {service.pricing.map((plan, i) => (
                    <motion.div key={i} className={`cl-price-card ${i === 1 ? "featured" : ""}`} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.4 }}>
                      <h3 className="syne" style={{ fontSize:20, fontWeight:700, marginBottom:10, color:"#fff" }}>{plan.name}</h3>
                      <p className="syne cl-grad" style={{ fontSize:40, fontWeight:800, marginBottom:22 }}>₹{plan.price}</p>
                      <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:20, display:"flex", flexDirection:"column", gap:12 }}>
                        {plan.features?.map((f, idx) => (
                          <div key={idx} style={{ display:"flex", alignItems:"center", gap:10, fontSize:14, color:"rgba(255,255,255,0.6)" }}>
                            <div className="cl-dot" />{f}
                          </div>
                        ))}
                      </div>
                      <button className="cl-btn-p" style={{ width:"100%", marginTop:24, justifyContent:"center" }}
                        onClick={() => router.push(`/Enquiries?service=${encodeURIComponent(service.title)}`)}>
                        Get Started
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {service.startingPrice && (
                <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} className="syne"
                  style={{ textAlign:"center", fontSize:"clamp(30px,5vw,56px)", fontWeight:800, marginBottom:34 }}>
                  Starting from <span className="cl-grad">₹{service.startingPrice}</span>
                </motion.p>
              )}

              <div style={{ textAlign:"center" }}>
                <button className="cl-btn-p" onClick={() => router.push(`/contact?service=${encodeURIComponent(service.title)}`)}>
                  Get Custom Quote →
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ──────────── FAQ ──────────── */}
        {service.faqs?.length > 0 && (
          <section style={{ padding:"0 0 80px" }}>
            <div className="cl-wrap">
              <div className="cl-line" />
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ duration:0.5 }} style={{ textAlign:"center", marginBottom:46 }}>
                <span className="cl-pill" style={{ marginBottom:18, display:"inline-flex" }}>FAQ</span>
                <h2 className="syne" style={{ fontSize:"clamp(24px,3.5vw,44px)", fontWeight:800, margin:"16px 0", letterSpacing:"-0.02em" }}>
                  Frequently Asked <span className="cl-grad">Questions</span>
                </h2>
              </motion.div>
              <div style={{ maxWidth:820, margin:"0 auto", display:"flex", flexDirection:"column", gap:12 }}>
                {service.faqs.map((faq, i) => (
                  <motion.div key={i} className={`cl-faq ${openFaq === i ? "open" : ""}`} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:i*0.06, duration:0.4 }}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <div style={{ padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:16 }}>
                      <h3 style={{ fontSize:15, fontWeight:600, color:"#fff", lineHeight:1.5 }}>{faq.question}</h3>
                      <div style={{ width:32, height:32, borderRadius:"50%", border:"1px solid rgba(255,107,53,0.35)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"transform .3s", transform:openFaq===i?"rotate(180deg)":"rotate(0deg)" }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="#ff6b35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                    <div className={`cl-faq-body ${openFaq === i ? "open" : "close"}`}>
                      <p style={{ padding:"0 24px 22px", fontSize:14, color:"rgba(255,255,255,0.48)", lineHeight:1.85 }}>{faq.answer}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ──────────── FINAL CTA ──────────── */}
        <section style={{ padding:"0 0 110px" }}>
          <div className="cl-wrap">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ duration:0.6 }}
              style={{ background:"linear-gradient(135deg,rgba(255,107,53,0.11) 0%,rgba(255,107,53,0.03) 100%)", border:"1px solid rgba(255,107,53,0.22)", borderRadius:28, padding:"80px 40px", textAlign:"center", position:"relative", overflow:"hidden" }}>
              <div className="orb" style={{ width:500, height:250, background:"rgba(255,107,53,0.13)", top:"-30%", left:"50%", transform:"translateX(-50%)" }} />
              <div style={{ position:"relative", zIndex:1 }}>
                <span className="cl-pill" style={{ marginBottom:20, display:"inline-flex" }}>Let Build</span>
                <h2 className="syne" style={{ fontSize:"clamp(26px,4vw,52px)", fontWeight:800, marginBottom:18, letterSpacing:"-0.02em" }}>
                  Ready to start your <span className="cl-grad">project?</span>
                </h2>
                <p style={{ color:"rgba(255,255,255,0.42)", fontSize:17, maxWidth:480, margin:"0 auto 38px" }}>
                  Let build something impactful together.
                </p>
                <button className="cl-btn-p" style={{ fontSize:16, padding:"16px 36px" }}
                  onClick={() => router.push(`/contact?service=${encodeURIComponent(service.title)}`)}>
                  Contact Us
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
    </>
  );
}