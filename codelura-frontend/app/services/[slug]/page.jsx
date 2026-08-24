"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/api";
import TrustBar from "@/components/services/TrustBar";
import RelatedServices from "@/components/services/RelatedServices";
// import Testimonials from "@/components/services/Testimonials";
import Portfolio from "@/components/services/Portfolio";
// import TeamAndWhyUs from "@/components/services/TeamAndWhyUs";
import { TeamScroller } from "@/components/about/TeamScroller";
/* ─── animation variants ─── */
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
const fadeIn  = { hidden: { opacity: 0 },        show: { opacity: 1 } };

/* ─── fallback static image (used if a service has no image of its own) ─── */
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&h=600&fit=crop";

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

  const [typedItems, setTypedItems] = useState([]);

useEffect(() => {
  if (!service?.idealFor?.length) return;

  let itemIndex = 0;
  let charIndex = 0;
  let currentItems = [];

  const typeNext = () => {
    if (itemIndex >= service.idealFor.length) {
      setTimeout(() => {
        itemIndex = 0;
        charIndex = 0;
        currentItems = [];
        setTypedItems([]);
        typeNext();
      }, 2000);
      return;
    }

    const currentText = service.idealFor[itemIndex];

    const interval = setInterval(() => {
      currentItems[itemIndex] =
        currentText.slice(0, charIndex + 1);

      setTypedItems([...currentItems]);

      charIndex++;

      if (charIndex > currentText.length) {
        clearInterval(interval);

        itemIndex++;
        charIndex = 0;

        setTimeout(typeNext, 400);
      }
    }, 40);
  };

  typeNext();
}, [service]);

const [typedPricing, setTypedPricing] = useState({});
useEffect(() => {
  if (!service?.pricing?.length) return;

  service.pricing.forEach((plan, planIndex) => {
    let featureIndex = 0;
    let charIndex = 0;
    let currentFeatures = [];

    const typeFeature = () => {
      if (featureIndex >= plan.features.length) return;

      const text = plan.features[featureIndex];

      const interval = setInterval(() => {
        currentFeatures[featureIndex] =
          text.slice(0, charIndex + 1);

        setTypedPricing(prev => ({
          ...prev,
          [planIndex]: [...currentFeatures]
        }));

        charIndex++;

        if (charIndex > text.length) {
          clearInterval(interval);
          featureIndex++;
          charIndex = 0;
          setTimeout(typeFeature, 250);
        }
      }, 25);
    };

    setTimeout(() => {
      typeFeature();
    }, planIndex * 1000);
  });
}, [service]);

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#0B0E14", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      <div style={{ textAlign:"center" }}>
        <div className="cl-spinner" style={{ margin:"0 auto 16px" }} />
        <p style={{ color:"rgba(255,255,255,0.4)", fontFamily:"DM Sans,sans-serif" }}>Loading service...</p>
      </div>
    </div>
  );

  if (!service) return (
    <div style={{ minHeight:"100vh", background:"#0B0E14", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <p style={{ color:"rgba(255,255,255,0.4)", fontFamily:"DM Sans,sans-serif" }}>Service not found.</p>
    </div>
  );

  const heroImage = service.image || FALLBACK_IMAGE;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      <style>{`

        .syne { font-family:'Syne',sans-serif !important; }

        // .cl-wrap { max-width:1200px; margin:0 auto; padding:0 24px; }
        .cl-wrap {
  width: min(85%, 1500px);
  margin: 0 auto;
  padding: 0 16px;
}

        .cl-line {
          height:1px;
          background:rgba(255,255,255,0.08);
          margin-bottom:64px;
        }
.typing-cursor{
  color:#ff6b35;
  margin-left:2px;
  animation:blink .8s infinite;
}

@keyframes blink{
  0%,50%{
    opacity:1;
  }
  51%,100%{
    opacity:0;
  }
}
        .cl-grad {
          background:linear-gradient(90deg,#ff6b35,#ffb347);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
        }

        /* pill */
        .cl-pill {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(255,107,53,0.08); border:1px solid rgba(255,107,53,0.28);
          color:#ff6b35; border-radius:8px; padding:5px 16px;
          font-size:11px; font-weight:700; letter-spacing:.09em;
          text-transform:uppercase; font-family:'DM Sans',sans-serif;
        }

        /* preview pill */
        .cl-preview {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.14);
          color:rgba(255,255,255,0.72); border-radius:8px; padding:5px 16px;
          font-size:11px; font-weight:700; letter-spacing:.09em;
          text-transform:uppercase; font-family:'DM Sans',sans-serif;
          cursor:pointer; text-decoration:none;
          transition:border-color .2s, color .2s;
        }
        .cl-preview:hover { border-color:rgba(255,107,53,0.5); color:#ff6b35; }

        .cl-live-dot {
          width:7px; height:7px; border-radius:50%;
          background:#22c55e;
        }

        /* glass -> now flat card */
        .cl-glass {
          background:#11151F; border:1px solid rgba(255,255,255,0.08);
          border-radius:14px; transition:border-color .2s;
        }
        .cl-glass:hover { border-color:rgba(255,107,53,0.32); }

        /* image */
        .cl-img-frame { border-radius:14px; overflow:hidden; border:1px solid rgba(255,255,255,0.08); }

        /* stat */
        .cl-stat {
          background:#11151F; border:1px solid rgba(255,255,255,0.08);
          border-radius:10px; padding:16px 20px; text-align:center;
        }

        /* dot */
        .cl-dot { width:6px; height:6px; border-radius:50%; background:#ff6b35; flex-shrink:0; }

        /* tech */
        .cl-tech {
          display:inline-block; background:rgba(255,107,53,0.06);
          border:1px solid rgba(255,107,53,0.2); color:#ff9a55;
          border-radius:8px; padding:7px 18px; font-size:13px; font-weight:500;
          font-family:'DM Sans',sans-serif;
        }

        /* step */
        .cl-step {
          width:48px; height:48px; border-radius:10px;
          background:rgba(255,107,53,0.08); border:1px solid rgba(255,107,53,0.28);
          color:#ff6b35; font-size:18px; font-weight:800;
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0; font-family:'Syne',sans-serif;
        }

        /* faq */
        .cl-faq {
          background:#11151F; border:1px solid rgba(255,255,255,0.08);
          border-radius:12px; overflow:hidden; transition:border-color .2s; cursor:pointer;
        }
        .cl-faq.open,.cl-faq:hover { border-color:rgba(255,107,53,0.32); }
        .cl-faq-body { overflow:hidden; transition:max-height .3s ease,opacity .25s ease; }
        .cl-faq-body.open  { max-height:500px; opacity:1; }
        .cl-faq-body.close { max-height:0; opacity:0; }

        /* price */
        .cl-price-card {
          background:#11151F; border:1px solid rgba(255,255,255,0.08);
          border-radius:14px; padding:32px;
          transition:border-color .2s; position:relative;
        }
        .cl-price-card:hover { border-color:rgba(255,107,53,0.38); }
        .cl-price-card.featured {
          border-color:rgba(255,107,53,0.45); background:rgba(255,107,53,0.04);
        }
        .cl-price-card.featured::before {
          content:'Most Popular'; position:absolute; top:16px; right:16px;
          background:#ff6b35; color:#fff;
          font-size:11px; font-weight:700; border-radius:6px; padding:3px 12px;
          font-family:'DM Sans',sans-serif; letter-spacing:.06em;
        }

        /* buttons */
        .cl-btn-p {
          display:inline-flex; align-items:center; gap:8px;
          background:#ff6b35;
          border:none; border-radius:10px; color:#fff;
          font-size:15px; font-weight:700; cursor:pointer; padding:14px 30px;
          transition:background .2s;
          font-family:'Syne',sans-serif; letter-spacing:.02em; white-space:nowrap;
        }
        .cl-btn-p:hover { background:#e85a28; }

        .cl-btn-o {
          display:inline-flex; align-items:center; gap:8px;
          background:transparent; border:1px solid rgba(255,107,53,0.4);
          border-radius:10px; color:#ff6b35; font-size:15px; font-weight:600;
          cursor:pointer; padding:14px 30px;
          transition:background .2s,border-color .2s;
          font-family:'DM Sans',sans-serif; white-space:nowrap;
        }
        .cl-btn-o:hover { background:rgba(255,107,53,0.06); border-color:rgba(255,107,53,0.65); }

        /* spinner */
        @keyframes cl-spin { to { transform:rotate(360deg); } }
        .cl-spinner { width:36px; height:36px; border-radius:50%; border:3px solid rgba(255,107,53,0.15); border-top-color:#ff6b35; animation:cl-spin .8s linear infinite; }

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

      <main style={{ background:"#0B0E14", color:"#fff", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", overflowX:"hidden" }}>

        {/* ──────────── HERO ──────────── */}
        <section style={{ padding:"80px 0 60px" }}>
          <div className="cl-wrap">
            {/* <div className="cl-hero-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center" }}> */}
            <div
  className="cl-hero-grid"
  style={{
    display: "grid",
    gridTemplateColumns: "1.05fr .95fr",
    gap: 30,
    alignItems: "center",
  }}
>
  

              {/* left */}
              <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration:0.5 }}>
                {/* tags row */}
                <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:22 }}>
                  <span className="cl-pill">{service.category?.toUpperCase()} SERVICE</span>

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

                <h1 className="syne" style={{ fontSize:"clamp(32px,5vw,58px)", fontWeight:800, lineHeight:1.1, letterSpacing:"-0.02em", marginBottom:20 }}>
                  {service.title}
                </h1>

                <p style={{ fontSize:16, lineHeight:1.8, color:"rgba(255,255,255,0.5)", maxWidth:480, marginBottom:36 }}>
                  {service.shortDescription || service.description}
                </p>

                <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                  <button className="cl-btn-p" onClick={() => router.push(`/services/Enquiries?service=${encodeURIComponent(service.title)}`)}>
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

              {/* right — image (static fallback used if service has none) */}
              <motion.div className="cl-img-frame" variants={fadeIn} initial="hidden" animate="show" transition={{ duration:0.5 }}>
                <img
  src={heroImage}
  alt={service.title}
  style={{
    width: "100%",
    height: "auto",
    maxHeight: "650px",
    objectFit: "contain",
    display: "block",
  }}
/>
              </motion.div>
            </div>
          </div>
        </section>

         <TrustBar />

        {/* ──────────── ABOUT ──────────── */}
        <section style={{ padding:"10px 0" }}>
          <div className="cl-wrap">
            <div className="cl-line" />
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ duration:0.45 }} style={{ maxWidth:820 }}>
              <span className="cl-pill" style={{ marginBottom:18, display:"inline-flex" }}>About</span>
              <h2 className="syne" style={{ fontSize:"clamp(26px,4vw,44px)", fontWeight:800, margin:"16px 0 22px", letterSpacing:"-0.02em" }}>
                About this <span className="cl-grad">service</span>
              </h2>
              <p style={{ fontSize:16, lineHeight:1.9, color:"rgba(255,255,255,0.5)" }}>{service.description}</p>
            </motion.div>
          </div>
        </section>

  


        {/* ──────────── IDEAL FOR ──────────── */}
        {service.idealFor?.length > 0 && (
          <section style={{ padding:"0 0 80px" }}>
            <div className="cl-wrap">
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ duration:0.45 }}>
                <span className="cl-pill" style={{ marginBottom:18, display:"inline-flex" }}>Ideal For</span>
                <h2 className="syne" style={{ fontSize:"clamp(24px,3.5vw,38px)", fontWeight:800, margin:"16px 0 34px", letterSpacing:"-0.02em" }}>
                  Who should <span className="cl-grad">choose this?</span>
                </h2>
                <div className="cl-ideal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  {/* {service.idealFor.map((item, i) => ( */}
                  {typedItems.map((item, i) => (
                    <motion.div key={i} className="cl-glass" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:i*0.06, duration:0.35 }}
                      style={{ padding:"20px 24px", display:"flex", alignItems:"center", gap:16 }}>
                      <span className="cl-dot" />
                      <motion.div
  key={i}
  className="cl-glass"
  style={{
    padding:"20px 24px",
    display:"flex",
    alignItems:"center",
    gap:16
  }}
>
  <span className="cl-dot" />

  <span
    style={{
      fontSize:15,
      color:"rgba(255,255,255,0.7)",
      lineHeight:1.5
    }}
  >
    {item}
  </span>
</motion.div>
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
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ duration:0.45 }}>
                <span className="cl-pill" style={{ marginBottom:18, display:"inline-flex" }}>Features</span>
                <h2 className="syne" style={{ fontSize:"clamp(24px,3.5vw,40px)", fontWeight:800, margin:"16px 0 38px", letterSpacing:"-0.02em" }}>
                  What we <span className="cl-grad">offer</span>
                </h2>
              </motion.div>
              <div className="cl-feat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
                {service.features.map((feature, i) => (
                  <motion.div key={i} className="cl-glass" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:i*0.06, duration:0.35 }}
                    style={{ padding:"26px", display:"flex", alignItems:"flex-start", gap:16 }}>
                    <div className="cl-dot" style={{ marginTop:7 }} />
                    <p style={{ fontSize:15, color:"rgba(255,255,255,0.62)", lineHeight:1.75 }}>{feature}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
        
      
        {/* ──────────── PROCESS ──────────── */}
     {/* ──────────── PROCESS ──────────── */}
{service.process?.length > 0 && (

  <section className="pb-20">
    <div className="cl-wrap">
      <div className="cl-line" />


  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    transition={{ duration: 0.45 }}
    className="text-center mb-12"
  >
    <span className="cl-pill inline-flex mb-5">
      Our Process
    </span>

    <h2
      className="syne text-white font-extrabold"
      style={{
        fontSize: "clamp(24px,3.5vw,44px)",
      }}
    >
      How we <span className="cl-grad">deliver results</span>
    </h2>

    <p className="text-white/50 mt-4 max-w-2xl mx-auto">
      A streamlined process designed to keep your project
      transparent, efficient and on schedule.
    </p>
  </motion.div>

  <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
    {service.process.map((step, i) => (
      <motion.div
        key={i}
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        transition={{
          delay: i * 0.08,
          duration: 0.4,
        }}
        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 transition-all duration-500 hover:-translate-y-2 hover:border-[#ff6b35]/40"
      >
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#ff6b35]/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff6b35]/10 text-[#ff6b35] font-bold text-xl">
              {i + 1}
            </div>

            <span className="text-white/20 text-4xl font-bold">
              0{i + 1}
            </span>
          </div>

          <h3 className="text-white font-semibold text-lg mb-3">
            Step {i + 1}
          </h3>

          <p className="text-white/60 text-sm leading-7">
            {step}
          </p>

          <div className="mt-6 h-[2px] w-12 rounded-full bg-gradient-to-r from-[#ff6b35] to-[#ffb347] transition-all duration-500 group-hover:w-24" />
        </div>
      </motion.div>
    ))}
  </div>
</div>


  </section>
)}


        {/* ──────────── PORTFOLIO / CASE STUDIES ──────────── */}
        <Portfolio />
       {/* <Testimonials /> */}
        {/* ──────────── PRICING ──────────── */}
      {/* ──────────── PRICING ──────────── */}
{service.pricing?.length > 0 && (
  <section id="pricing" style={{ padding: "0 0 80px" }}>
    <div className="cl-wrap">
      <div className="cl-line" />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        style={{
          textAlign: "center",
          marginBottom: 50,
        }}
      >
        <span
          className="cl-pill"
          style={{
            marginBottom: 18,
            display: "inline-flex",
          }}
        >
          Pricing
        </span>

        <h2
          className="syne"
          style={{
            fontSize: "clamp(26px,4vw,46px)",
            fontWeight: 800,
            margin: "16px 0 12px",
          }}
        >
          Flexible <span className="cl-grad">Pricing</span>
        </h2>

        <p
          style={{
            color: "rgba(255,255,255,.5)",
            fontSize: 15,
          }}
        >
          Choose the package that fits your business needs
        </p>
      </motion.div>

      <div className="pricing-grid">
        {service.pricing.map((plan, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{
              delay: i * 0.08,
              duration: 0.4,
            }}
            className={`pricing-card ${
              i === 1 ? "featured" : ""
            }`}
          >
            {i === 1 && (
              <div className="pricing-badge">
                Most Popular
              </div>
            )}

            <h3 className="pricing-title">
              {plan.name}
            </h3>

            <div className="pricing-price">
              ₹{plan.price}
            </div>

            <div className="pricing-divider" />

            <div className="pricing-features">
              {typedPricing[i]?.map((feature, idx) => (
                <div
  key={idx}
  className="pricing-feature"
>
  <span className="check">✓</span>

  <span>
    {feature}
    {idx === typedPricing[i]?.length - 1 && (
      <span className="typing-cursor">|</span>
    )}
  </span>
</div>
              ))}
            </div>

            <button
              className="cl-btn-p"
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: "auto",
              }}
              onClick={() =>
                router.push(
                  `/Enquiries?service=${encodeURIComponent(
                    service.title
                  )}`
                )
              }
            >
              Get Started
            </button>
          </motion.div>
        ))}
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: 40,
        }}
      >
        <button
          className="cl-btn-s"
          onClick={() =>
            router.push(
              `/contact?service=${encodeURIComponent(
                service.title
              )}`
            )
          }
        >
          Request Custom Quote →
        </button>
      </div>

      <style>{`
        .pricing-grid{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:20px;
        }

        .pricing-card{
          position:relative;
          padding:28px;
          border-radius:24px;
          background:rgba(255,255,255,.03);
          border:1px solid rgba(255,255,255,.08);
          backdrop-filter:blur(12px);
          display:flex;
          flex-direction:column;
          transition:.35s;
          min-height:420px;
        }

        .pricing-card:hover{
          transform:translateY(-5px);
          border-color:rgba(255,107,53,.35);
        }

        .pricing-card.featured{
          border-color:#ff6b35;
          box-shadow:0 0 30px rgba(255,107,53,.12);
        }

        .pricing-badge{
          position:absolute;
          top:16px;
          right:16px;
          background:#ff6b35;
          color:#fff;
          font-size:11px;
          font-weight:700;
          padding:7px 12px;
          border-radius:999px;
        }

        .pricing-title{
          color:#fff;
          font-size:28px;
          font-weight:700;
          margin-bottom:16px;
        }

        .pricing-price{
          color:#ff6b35;
          font-size:52px;
          font-weight:800;
          line-height:1;
          margin-bottom:24px;
        }

        .pricing-divider{
          height:1px;
          background:rgba(255,255,255,.08);
          margin-bottom:22px;
        }

        .pricing-features{
          display:flex;
          flex-direction:column;
          gap:12px;
          margin-bottom:24px;
        }

        .pricing-feature{
          display:flex;
          align-items:flex-start;
          gap:10px;
          color:rgba(255,255,255,.65);
          font-size:14px;
          line-height:1.6;
        }

        .check{
          color:#ff6b35;
          font-weight:700;
          flex-shrink:0;
        }

        @media(max-width:1024px){
          .pricing-grid{
            grid-template-columns:repeat(2,1fr);
          }
        }

        @media(max-width:768px){
          .pricing-grid{
            grid-template-columns:repeat(2,1fr);
            gap:12px;
          }

          .pricing-card{
            padding:18px;
            min-height:340px;
          }

          .pricing-title{
            font-size:18px;
          }

          .pricing-price{
            font-size:34px;
          }

          .pricing-feature{
            font-size:12px;
          }

          .pricing-badge{
            font-size:10px;
            padding:5px 10px;
          }
        }

        @media(max-width:480px){
          .pricing-grid{
            grid-template-columns:repeat(2,1fr);
          }
        }
      `}</style>
    </div>
  </section>
)}

        {/* ──────────── TEAM + WHY CHOOSE US ──────────── */}
        <TeamScroller />

        {/* ──────────── TESTIMONIALS ──────────── */}
        

        {/* ──────────── FAQ ──────────── */}
        {service.faqs?.length > 0 && (
          <section style={{ padding:"0 0 80px" }}>
            <div className="cl-wrap">
              <div className="cl-line" />
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ duration:0.45 }} style={{ textAlign:"center", marginBottom:46 }}>
                <span className="cl-pill" style={{ marginBottom:18, display:"inline-flex" }}>FAQ</span>
                <h2 className="syne" style={{ fontSize:"clamp(24px,3.5vw,40px)", fontWeight:800, margin:"16px 0", letterSpacing:"-0.02em" }}>
                  Frequently Asked <span className="cl-grad">Questions</span>
                </h2>
              </motion.div>
              <div style={{ maxWidth:820, margin:"0 auto", display:"flex", flexDirection:"column", gap:12 }}>
                {service.faqs.map((faq, i) => (
                  <motion.div key={i} className={`cl-faq ${openFaq === i ? "open" : ""}`} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:i*0.05, duration:0.35 }}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <div style={{ padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:16 }}>
                      <h3 style={{ fontSize:15, fontWeight:600, color:"#fff", lineHeight:1.5 }}>{faq.question}</h3>
                      <div style={{ width:30, height:30, borderRadius:8, border:"1px solid rgba(255,107,53,0.3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"transform .25s", transform:openFaq===i?"rotate(180deg)":"rotate(0deg)" }}>
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

  {/* ──────────── TECH STACK ──────────── */}
        {service.techStack?.length > 0 && (
          <section style={{ padding:"0 0 80px" }}>
            <div className="cl-wrap">
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ duration:0.45 }}>
                <span className="cl-pill" style={{ marginBottom:18, display:"inline-flex" }}>Tech Stack</span>
                <h2 className="syne" style={{ fontSize:"clamp(24px,3.5vw,40px)", fontWeight:800, margin:"16px 0 34px", letterSpacing:"-0.02em" }}>
                  Technologies we <span className="cl-grad">use</span>
                </h2>
                <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                  {service.techStack.map((tech, i) => (
                    <motion.span key={i} className="cl-tech" variants={fadeIn} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:i*0.04 }}>
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        <RelatedServices />

        {/* ──────────── FINAL CTA ──────────── */}
        <section style={{ padding:"0 0 100px" }}>
          <div className="cl-wrap">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ duration:0.45 }}
              style={{ background:"#11151F", border:"1px solid rgba(255,107,53,0.2)", borderRadius:16, padding:"70px 40px", textAlign:"center" }}>
              <span className="cl-pill" style={{ marginBottom:20, display:"inline-flex" }}>Let's Build</span>
              <h2 className="syne" style={{ fontSize:"clamp(26px,4vw,46px)", fontWeight:800, marginBottom:18, letterSpacing:"-0.02em" }}>
                Ready to start your <span className="cl-grad">project?</span>
              </h2>
              <p style={{ color:"rgba(255,255,255,0.42)", fontSize:17, maxWidth:480, margin:"0 auto 38px" }}>
                Let's build something impactful together.
              </p>
              <button className="cl-btn-p" style={{ fontSize:16, padding:"16px 36px" }}
                onClick={() => router.push(`/contact?service=${encodeURIComponent(service.title)}`)}>
                Contact Us
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </motion.div>
          </div>
        </section>

      </main>
    </>
  );
}