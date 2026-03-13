"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Head from "next/head";
import api from "@/lib/api";


type Testimonial = {
  _id: string;
  name: string;
  message: string;
  rating: number;
  profileImage?: string;
  category: string;
  createdAt: string;
};

type Service = {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  image?: string;
  icon?: string;
  category?: string;
  startingPrice?: number;
  deliveryTime?: string;
  techStack?: string[];
  features?: string[];
};

const fadeUp = { hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0 } };




export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading]   = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/services");
        setServices(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

useEffect(() => {
  api.get("/testimonial/webservice")
    .then((res) => {
      setTestimonials(res.data.data);
    })
    .catch((err) => {
      console.error("Testimonial fetch error:", err);
    });
}, []);

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Our Services",
    "description": "End-to-end digital solutions for business growth and digital transformation",
    "url": typeof window !== "undefined" ? window.location.origin : "",
    "telephone": "+91XXXXXXXXXX",
    "serviceArea": "IN",
    "priceRange": "₹₹₹",
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5", "reviewCount": "100+" }
  };

  return (
    <>
      <Head>
        <title>Professional Digital Services | Web Development, Design & More</title>
        <meta name="description" content="End-to-end digital solutions for startups and enterprises. Web development, UI/UX design, mobile apps, and digital marketing services." />
        <meta name="keywords" content="digital services, web development, UI/UX design, mobile app development, digital marketing" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Professional Digital Services" />
        <meta property="og:description" content="Transform your business with our comprehensive digital solutions" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Professional Digital Services" />
        <meta name="twitter:description" content="End-to-end digital solutions for business growth" />
        <link rel="canonical" href="/services" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
      </Head>

      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      <style>{`
      
        .syne { font-family: 'Syne', sans-serif !important; }
        .dm   { font-family: 'DM Sans', sans-serif !important; }

        .orb  { position: absolute; border-radius: 50%; filter: blur(110px); pointer-events: none; z-index: 0; }
        .wrap { max-width: 1300px; margin: 0 auto; padding: 0 32px; }

        /* ── gradient text ── */
        .cl-grad {
          background: linear-gradient(90deg, #ff6b35, #ffb347);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        /* ── divider ── */
        .cl-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,107,53,0.35), transparent);
        }

        /* ── pill ── */
        .pill {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(255,107,53,0.1); border: 1px solid rgba(255,107,53,0.3);
          color: #ff6b35; border-radius: 100px; padding: 5px 16px;
          font-size: 11px; font-weight: 700; letter-spacing: .09em;
          text-transform: uppercase; font-family: 'DM Sans', sans-serif;
        }
        .pill-dot { width: 7px; height: 7px; border-radius: 50%; background: #ff6b35; box-shadow: 0 0 6px rgba(255,107,53,.7); }

        /* ── stat card ── */
        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 32px 24px; text-align: center;
          transition: border-color .3s, transform .3s;
          position: relative; overflow: hidden;
        }
        .stat-card::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(255,107,53,0.05),transparent 60%);
          opacity:0; transition:opacity .3s;
        }
        .stat-card:hover { border-color: rgba(255,107,53,0.4); transform: translateY(-4px); }
        .stat-card:hover::before { opacity:1; }

        /* ── SERVICE CARD ── */
        .svc-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px; overflow: hidden;
          transition: border-color .35s, transform .35s, box-shadow .35s;
          position: relative; display: flex; flex-direction: column;
          cursor: pointer;
        }
        .svc-card::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(135deg, rgba(255,107,53,0.07) 0%, transparent 55%);
          opacity:0; transition:opacity .35s; pointer-events:none;
        }
        .svc-card:hover {
          border-color: rgba(255,107,53,0.45);
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,107,53,0.2);
        }
        .svc-card:hover::after { opacity:1; }

        /* card image area */
        .svc-img-wrap {
          position: relative; height: 210px; overflow: hidden;
          background: rgba(255,255,255,0.02);
        }
        .svc-img-wrap img {
          width:100%; height:100%; object-fit:cover;
          transition: transform .5s ease;
        }
        .svc-card:hover .svc-img-wrap img { transform: scale(1.07); }
        .svc-img-overlay {
          position:absolute; inset:0;
          background: linear-gradient(180deg, transparent 40%, rgba(8,11,20,0.85) 100%);
        }
        /* category badge floating on image */
        .svc-cat-badge {
          position:absolute; top:14px; left:14px;
          display:inline-flex; align-items:center; gap:5px;
          background: rgba(8,11,20,0.7); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,107,53,0.35);
          color: #ff9a55; border-radius: 100px;
          padding: 4px 12px; font-size: 10px; font-weight: 700;
          letter-spacing: .08em; text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
        }
        /* price badge on image */
        .svc-price-badge {
          position:absolute; bottom:14px; right:14px;
          background: linear-gradient(135deg,#ff6b35,#ffb347);
          color:#fff; border-radius: 10px;
          padding: 5px 14px; font-size: 13px; font-weight: 700;
          font-family: 'Syne', sans-serif; letter-spacing:.01em;
        }
        /* fallback icon */
        .svc-icon-box {
          height:100%; display:flex; align-items:center; justify-content:center;
          font-size:64px;
          transition: transform .5s ease;
        }
        .svc-card:hover .svc-icon-box { transform: scale(1.15); }

        /* card body */
        .svc-body { padding: 24px; display:flex; flex-direction:column; gap:12px; flex:1; }

        .svc-title {
          font-family:'Syne',sans-serif; font-size:20px; font-weight:800;
          color:#fff; line-height:1.25; letter-spacing:-.01em;
          transition: color .25s;
        }
        .svc-card:hover .svc-title { color:#ff9a55; }

        .svc-desc { font-size:14px; color:rgba(255,255,255,0.5); line-height:1.75; }

        /* feature chips */
        .svc-chips { display:flex; flex-wrap:wrap; gap:6px; margin-top:4px; }
        .svc-chip {
          background: rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09);
          border-radius:6px; padding:3px 10px; font-size:11px; font-weight:500;
          color:rgba(255,255,255,0.45); font-family:'DM Sans',sans-serif;
        }

        /* card footer */
        .svc-footer {
          margin-top:auto; padding-top:16px;
          border-top:1px solid rgba(255,255,255,0.06);
          display:flex; align-items:center; justify-content:space-between;
        }
        .svc-link {
          display:inline-flex; align-items:center; gap:6px;
          color:#ff6b35; font-size:13px; font-weight:700;
          text-decoration:none; font-family:'DM Sans',sans-serif;
          transition:gap .25s;
        }
        .svc-link:hover { gap:10px; }
        .svc-link svg { transition:transform .25s; }
        .svc-link:hover svg { transform:translateX(3px); }

        /* why card */
        .why-card {
          background:rgba(255,255,255,0.03);
          border-left:3px solid #ff6b35;
          border-top:1px solid rgba(255,255,255,0.06);
          border-right:1px solid rgba(255,255,255,0.06);
          border-bottom:1px solid rgba(255,255,255,0.06);
          border-radius:0 16px 16px 0;
          padding:28px 28px 28px 30px;
          transition:background .3s, transform .3s;
        }
        .why-card:hover { background:rgba(255,107,53,0.05); transform:translateX(4px); }

        /* CTA section */
        .cta-section {
          background: linear-gradient(135deg, rgba(255,107,53,0.12) 0%, rgba(255,107,53,0.04) 100%);
          border:1px solid rgba(255,107,53,0.22);
          border-radius:28px; padding:80px 40px; text-align:center;
          position:relative; overflow:hidden;
        }

        /* buttons */
        .btn-p {
          display:inline-flex; align-items:center; gap:8px;
          background:linear-gradient(135deg,#ff6b35,#ffb347);
          border:none; border-radius:12px; color:#fff;
          font-size:15px; font-weight:700; cursor:pointer;
          padding:14px 30px; text-decoration:none;
          transition:opacity .2s,transform .2s,box-shadow .2s;
          font-family:'Syne',sans-serif; white-space:nowrap;
          box-shadow:0 4px 24px rgba(255,107,53,0.3);
        }
        .btn-p:hover { opacity:.88; transform:translateY(-2px); box-shadow:0 8px 32px rgba(255,107,53,0.4); }

        .btn-o {
          display:inline-flex; align-items:center; gap:8px;
          background:transparent; border:1px solid rgba(255,107,53,0.4);
          border-radius:12px; color:#ff6b35;
          font-size:15px; font-weight:600; cursor:pointer;
          padding:14px 30px; text-decoration:none;
          transition:background .2s,border-color .2s,transform .2s;
          font-family:'DM Sans',sans-serif; white-space:nowrap;
        }
        .btn-o:hover { background:rgba(255,107,53,0.08); border-color:rgba(255,107,53,0.7); transform:translateY(-2px); }

        /* spinner */
        @keyframes cl-spin { to { transform:rotate(360deg); } }
        .spinner { width:40px; height:40px; border-radius:50%; border:3px solid rgba(255,107,53,0.15); border-top-color:#ff6b35; animation:cl-spin .8s linear infinite; }

        /* responsive */
        @media(max-width:900px) {
          .svc-grid { grid-template-columns: 1fr 1fr !important; }
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
          .why-grid  { grid-template-columns: 1fr !important; }
        }
        @media(max-width:600px) {
          .svc-grid  { grid-template-columns: 1fr !important; }
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
          .hero-btns { flex-direction: column !important; }
          .cta-section { padding: 50px 20px !important; }
        }
      `}</style>

      <main style={{ background:"#080B14", color:"#fff", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", overflowX:"hidden" }}>

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section style={{ position:"relative", padding:"70px 0 50px", overflow:"hidden", textAlign:"center" }}>
          <div className="orb" style={{ width:700, height:350, background:"rgba(255,107,53,0.1)", top:"-10%", left:"50%", transform:"translateX(-50%)" }} />
          <div className="orb" style={{ width:280, height:280, background:"rgba(255,60,53,0.06)", top:"20%", right:"0" }} />
          <div className="orb" style={{ width:200, height:200, background:"rgba(255,180,53,0.05)", bottom:"0", left:"5%" }} />

          <div className="wrap" style={{ position:"relative", zIndex:1 }}>
            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration:0.65 }}>
              <span className="pill" style={{ marginBottom:24, display:"inline-flex" }}>
                <span className="pill-dot" /> Our Services
              </span>

              <h1 className="syne" style={{ fontSize:"clamp(36px,6vw,76px)", fontWeight:800, lineHeight:1.06, letterSpacing:"-0.025em", margin:"20px auto 22px", maxWidth:800 }}>
                End-to-End <span className="cl-grad">Digital Solutions</span>
              </h1>

              <p style={{ fontSize:18, lineHeight:1.8, color:"rgba(255,255,255,0.48)", maxWidth:580, margin:"0 auto 40px" }}>
                We help businesses grow, scale, and succeed in the digital world with cutting-edge solutions tailored to your unique needs.
              </p>

              <div className="hero-btns" style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
                <Link href="/Enquiries" className="btn-p">
                  Get Free Consultation
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
                <Link href="#services" className="btn-o">Explore Services</Link>
              </div>
            </motion.div>

            {/* trust bar */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="show" transition={{ duration:0.6, delay:0.3 }}
              style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:32, marginTop:56, flexWrap:"wrap" }}
            >
              {["200+ Projects", "100% Satisfaction", "24/7 Support", "GDPR Compliant"].map((t,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"rgba(255,255,255,0.38)", fontWeight:500 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3" stroke="#ff6b35" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {t}
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            STATS
        ══════════════════════════════════════ */}
        <section style={{ padding:"0 0 90px" }}>
          <div className="wrap">
            <div className="cl-line" style={{ marginBottom:64 }} />
            <div className="stat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
              {[
                { val:"200+", label:"Projects Delivered", icon:"📊", sub:"Across 10+ industries" },
                { val:"100%", label:"Client Satisfaction", icon:"⭐", sub:"5-star rated service" },
                { val:"24/7", label:"Expert Support", icon:"🛟", sub:"Always here for you" },
              ].map((s,i) => (
                <motion.div key={i} className="stat-card" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.5 }}>
                  <div style={{ fontSize:44, marginBottom:12 }}>{s.icon}</div>
                  <div className="syne" style={{ fontSize:42, fontWeight:800, color:"#ff6b35", lineHeight:1 }}>{s.val}</div>
                  <div style={{ fontSize:15, fontWeight:600, color:"#fff", marginTop:8 }}>{s.label}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginTop:4 }}>{s.sub}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SERVICES GRID
        ══════════════════════════════════════ */}
        <section id="services" style={{ padding:"0 0 90px" }}>
          <div className="wrap">
            <div className="cl-line" style={{ marginBottom:64 }} />
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ duration:0.5 }} style={{ marginBottom:48, textAlign:"center" }}>
              <span className="pill" style={{ marginBottom:16, display:"inline-flex" }}>Portfolio</span>
              <h2 className="syne" style={{ fontSize:"clamp(26px,4vw,50px)", fontWeight:800, margin:"16px 0 12px", letterSpacing:"-0.02em" }}>
                Our Service <span className="cl-grad">Portfolio</span>
              </h2>
              <p style={{ color:"rgba(255,255,255,0.4)", fontSize:16 }}>Comprehensive solutions to meet all your digital needs</p>
            </motion.div>

            {loading ? (
              <div style={{ display:"flex", justifyContent:"center", padding:"80px 0" }}>
                <div className="spinner" />
              </div>
            ) : services.length > 0 ? (
              <div className="svc-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:22 }}>
                {services.map((service: Service, i: number) => (
                  <motion.article
                    key={service._id}
                    className="svc-card"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once:true, margin:"-80px" }}
                    transition={{ delay:i*0.08, duration:0.5 }}
                  >
                    {/* ── image / icon ── */}
                    <div className="svc-img-wrap">
                      {service.image ? (
                        <>
                          <img src={service.image} alt={service.title} loading="lazy" />
                          <div className="svc-img-overlay" />
                        </>
                      ) : (
                        <div className="svc-icon-box">{service.icon}</div>
                      )}

                      {/* category floating badge */}
                      {service.category && (
                        <span className="svc-cat-badge">
                          <span style={{ width:5,height:5,borderRadius:"50%",background:"#ff6b35",display:"inline-block" }} />
                          {service.category}
                        </span>
                      )}

                      {/* price floating badge */}
                      {service.startingPrice && (
                        <span className="svc-price-badge">
                          ₹{service.startingPrice.toLocaleString("en-IN")}+
                        </span>
                      )}
                    </div>

                    {/* ── body ── */}
                    <div className="svc-body">
                      <h3 className="svc-title">{service.title}</h3>

                      <p className="svc-desc">{service.shortDescription}</p>

                      {/* feature chips — from techStack or features */}
                      {((service.techStack?.length ?? 0) > 0 || (service.features?.length ?? 0) > 0) && (
                        <div className="svc-chips">
                          {(service.techStack ?? service.features ?? []).slice(0,4).map((chip: string, j: number) => (
                            <span key={j} className="svc-chip">{chip}</span>
                          ))}
                          {((service.techStack ?? service.features ?? []).length > 4) && (
                            <span className="svc-chip">+{(service.techStack ?? service.features ?? []).length - 4} more</span>
                          )}
                        </div>
                      )}

                      {/* card footer */}
                      <div className="svc-footer">
                        <Link href={`/services/${service.slug}`} className="svc-link">
                          View Details
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                            <path d="M3 7.5h9M8 4l3.5 3.5L8 11" stroke="#ff6b35" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Link>
                        {/* tiny delivery tag */}
                        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:500 }}>
                          {service.deliveryTime ?? "Fast Delivery"}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div style={{ textAlign:"center", padding:"64px 0" }}>
                <div style={{ fontSize:48, marginBottom:16 }}>🚀</div>
                <p style={{ color:"rgba(255,255,255,0.4)", fontSize:17 }}>Services coming soon. Stay tuned!</p>
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════
            WHY CHOOSE US
        ══════════════════════════════════════ */}
        <section style={{ padding:"0 0 90px" }}>
          <div className="wrap">
            <div className="cl-line" style={{ marginBottom:64 }} />
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ duration:0.5 }} style={{ textAlign:"center", marginBottom:48 }}>
              <span className="pill" style={{ marginBottom:16, display:"inline-flex" }}>Why Us</span>
              <h2 className="syne" style={{ fontSize:"clamp(26px,4vw,50px)", fontWeight:800, margin:"16px 0 12px", letterSpacing:"-0.02em" }}>
                Why Choose <span className="cl-grad">Codelura?</span>
              </h2>
              <p style={{ color:"rgba(255,255,255,0.4)", fontSize:16, maxWidth:520, margin:"0 auto" }}>
                Trusted by startups and enterprises worldwide to deliver exceptional digital solutions
              </p>
            </motion.div>

            <div className="why-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {[
                { icon:"🧠", title:"Expert Team", desc:"Experienced professionals with 10+ years in digital solutions, delivering best-in-class work every time." },
                { icon:"🎯", title:"Custom Solutions", desc:"Every project is unique. We craft tailored approaches aligned with your specific business requirements and goals." },
                { icon:"⚡", title:"Timely Delivery", desc:"We respect your deadlines. On-schedule project completion without ever compromising quality or detail." },
                { icon:"🛡️", title:"Ongoing Support", desc:"Our relationship doesn't end at launch. Dedicated post-launch support, maintenance, and growth assistance." },
              ].map((item,i) => (
                <motion.div
                  key={i}
                  className="why-card"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once:true }}
                  transition={{ delay:i*0.1, duration:0.45 }}
                >
                  <div style={{ fontSize:30, marginBottom:14 }}>{item.icon}</div>
                  <h3 className="syne" style={{ fontSize:18, fontWeight:700, color:"#fff", marginBottom:10 }}>{item.title}</h3>
                  <p style={{ fontSize:14, color:"rgba(255,255,255,0.48)", lineHeight:1.75 }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FINAL CTA
        ══════════════════════════════════════ */}
        <section style={{ padding:"0 0 110px" }}>
          <div className="wrap">
            <motion.div className="cta-section" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once:true }} transition={{ duration:0.6 }}>
              <div className="orb" style={{ width:500, height:250, background:"rgba(255,107,53,0.13)", top:"-40%", left:"50%", transform:"translateX(-50%)" }} />
              <div style={{ position:"relative", zIndex:1 }}>
                <span className="pill" style={{ marginBottom:22, display:"inline-flex" }}>Let&apos;s Build</span>
                <h2 className="syne" style={{ fontSize:"clamp(26px,4vw,54px)", fontWeight:800, letterSpacing:"-0.025em", marginBottom:18 }}>
                  Ready to Transform <span className="cl-grad">Your Business?</span>
                </h2>
                <p style={{ color:"rgba(255,255,255,0.45)", fontSize:17, maxWidth:520, margin:"0 auto 40px", lineHeight:1.75 }}>
                  Let discuss how our services can help you achieve your goals. Get a free consultation from our experts today.
                </p>
                <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
                  <Link href="/contact" className="btn-p">
                    Start Your Project
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </Link>
                  <Link href="mailto:codelura@gmail.com" className="btn-o">Email Us</Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>





      </main>

      {/* ══ MATERIAL TESTIMONIALS ══ */}
{testimonials.length > 0 && (
  <section className="mt-24 relative">

    {/* subtle bg glow */}
    <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-orange-100 opacity-40 blur-3xl" />

    {/* heading */}
    <div className="relative text-center mb-14">
      <span className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-500 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
        Student Reviews
      </span>

      <h2 className="cph text-4xl font-extrabold text-gray-900 leading-tight">
        What Students{" "}
        <span
          className="italic text-orange-500"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Say
        </span>{" "}
        💬
      </h2>

      <p className="mt-3 text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
        Honest experiences from real students who used our materials.
      </p>
    </div>

    {/* grid */}
    <div className="relative grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.slice(0, 3).map((t) => (
        <div
          key={t._id}
          className="group relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col gap-4"
        >
          {/* top accent bar */}
          <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-orange-400 via-amber-300 to-transparent rounded-b opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* decorative quote */}
          <span
            className="absolute top-4 right-5 text-6xl leading-none text-orange-100 font-bold select-none pointer-events-none"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            
          </span>

          {/* author row */}
          <div className="flex items-center gap-3">
            {t.profileImage ? (
              <img
                src={t.profileImage}
                alt={t.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-orange-200 flex-shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-full flex-shrink-0 bg-gradient-to-br from-orange-300 to-amber-300 flex items-center justify-center text-white font-bold text-base">
                {t.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm truncate">
                {t.name}
              </h3>

              {/* rating */}
              <div className="flex items-center gap-1 mt-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={`text-xs ${
                      s <= t.rating ? "text-amber-400" : "text-gray-200"
                    }`}
                  >
                    ★
                  </span>
                ))}
                <span className="text-xs text-amber-500 font-semibold ml-1">
                  {t.rating}.0
                </span>
              </div>
            </div>

            <span className="ml-auto text-orange-300 text-xs font-medium flex-shrink-0">
              ✦ Verified
            </span>
          </div>

          {/* divider */}
          <div className="h-px bg-gray-100" />

          {/* message */}
          <p className="text-gray-500 text-sm leading-relaxed italic flex-1">
            {t.message}
          </p>
        </div>
      ))}
    </div>

    {/* view all button */}
    {testimonials.length > 3 && (
      <div className="text-center mt-12">
        <Link
          href="testimonial/webservice"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full
                     bg-gradient-to-r from-orange-500 to-amber-400
                     text-white font-semibold text-sm
                     shadow-md hover:shadow-lg hover:-translate-y-0.5
                     transition-all duration-300"
        >
          View All Reviews →
        </Link>
      </div>
    )}

    <br />
    
  </section>
)}

    </>
  );
}