// // // app/premium/[slug]/page.jsx - SERVER COMPONENT (No "use client")
// // import { Suspense } from "react";
// // import Image from "next/image";
// // import Link from "next/link";
// // import BuyButton from './BuyButton';
// // import styles from "./page.module.css";

// // // ✅ ISR - Revalidate every 1 hour
// // export const revalidate = 3600;

// // // ============================================
// // // DATA FETCHING (Server Side)
// // // ============================================
// // async function getPlan(slug) {
// //   try {
// //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/premium/plan/${slug}`, {
// //       next: { revalidate: 3600 },
// //       cache: 'force-cache'
// //     });

// //     if (!res.ok) {
// //       throw new Error(`Failed to fetch plan: ${res.status}`);
// //     }

// //     const data = await res.json();
// //     return data.plan || null;
// //   } catch (error) {
// //     console.error('Error fetching plan:', error);
// //     return null;
// //   }
// // }

// // // ============================================
// // // STATIC DATA
// // // ============================================
// // const TRUST_ITEMS = [
// //   { icon: "🏆", label: "Expert Mentorship", sub: "Learn from industry veterans" },
// //   { icon: "💬", label: "Community Access", sub: "Join 500+ active learners" },
// //   { icon: "🛠", label: "Real Projects", sub: "Build production-ready apps" },
// //   { icon: "🚀", label: "Career Boost", sub: "Get hired faster" },
// // ];

// // const STATS = [
// //   { num: "94%", label: "Placement Rate", sub: "Within 6 months of completion" },
// //   { num: "3×", label: "Salary Hike", sub: "Average increase reported" },
// //   { num: "500+", label: "Active Alumni", sub: "And growing every day" },
// // ];

// // // ============================================
// // // SERVER COMPONENTS
// // // ============================================

// // // Trust Strip
// // const TrustStrip = () => (
// //   <div className={styles.trustStrip}>
// //     <div className={styles.trustInner}>
// //       {TRUST_ITEMS.map((item, i) => (
// //         <div key={i} className={styles.trustItem}>
// //           <div className={styles.trustIcon}>{item.icon}</div>
// //           <div>
// //             <p className={styles.trustLabel}>{item.label}</p>
// //             <p className={styles.trustSub}>{item.sub}</p>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   </div>
// // );

// // // Features Grid
// // const FeaturesGrid = ({ features }) => (
// //   <div className={styles.featuresGrid}>
// //     {features.map((feature, i) => (
// //       <div key={i} className={styles.featureCard}>
// //         <div className={styles.featureCheck}>
// //           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
// //             <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
// //           </svg>
// //         </div>
// //         <p className={styles.featureText}>{feature}</p>
// //       </div>
// //     ))}
// //   </div>
// // );

// // // Process Steps
// // const ProcessSteps = ({ steps }) => (
// //   <div className={styles.processLayout}>
// //     {steps.map((step, i) => (
// //       <div key={i} className={styles.stepRow}>
// //         <div className={styles.stepLeft}>
// //           <div className={styles.stepNum}>{i + 1}</div>
// //           {i < steps.length - 1 && <div className={styles.stepLine} />}
// //         </div>
// //         <div className={styles.stepBody}>
// //           <p className={styles.stepBadge}>Step {i + 1}</p>
// //           <h3 className={styles.stepTitle}>{step.title}</h3>
// //           <p className={styles.stepDesc}>{step.description}</p>
// //         </div>
// //       </div>
// //     ))}
// //   </div>
// // );

// // // FAQ Items
// // const FAQItem = ({ question, answer }) => (
// //   <details className={styles.faqItem}>
// //     <summary className={styles.faqTrigger}>
// //       <span className={styles.faqQuestion}>{question}</span>
// //       <span className={styles.faqChevron}>
// //         <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
// //           <path d="M1 1L6 7L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
// //         </svg>
// //       </span>
// //     </summary>
// //     <div className={styles.faqBody}>
// //       <p className={styles.faqAnswer}>{answer}</p>
// //     </div>
// //   </details>
// // );

// // // Gallery
// // const Gallery = ({ images }) => (
// //   <div className={styles.galleryGrid}>
// //     {images.slice(0, 4).map((img, i) => (
// //       <div key={i} className={`${styles.galItem} ${i === 0 ? styles.galMain : ''}`}>
// //         <Image
// //           src={img}
// //           alt={`Preview ${i + 1}`}
// //           width={i === 0 ? 800 : 400}
// //           height={i === 0 ? 400 : 200}
// //           className={styles.galImage}
// //           loading="lazy"
// //         />
// //       </div>
// //     ))}
// //   </div>
// // );

// // // Stats
// // const Stats = () => (
// //   <div className={styles.stats}>
// //     {STATS.map((stat, i) => (
// //       <div key={i} className={styles.statCard}>
// //         <div className={styles.statNum}>{stat.num}</div>
// //         <div className={styles.statLabel}>
// //           <strong>{stat.label}</strong>
// //           {stat.sub}
// //         </div>
// //       </div>
// //     ))}
// //   </div>
// // );

// // // ============================================
// // // MAIN PAGE (Server Component)
// // // ============================================
// // export default async function PremiumDetailPage({ params }) {
// //   const plan = await getPlan(params.slug);

// //   if (!plan) {
// //     return (
// //       <div className={styles.notFound}>
// //         <h1>Plan Not Found</h1>
// //         <Link href="/premium" className={styles.backLink}>← Back to Plans</Link>
// //       </div>
// //     );
// //   }

// //   const hasDiscount = plan.discountedPrice != null && plan.discountedPrice < plan.price;
// //   const actualPrice = hasDiscount ? plan.discountedPrice : plan.price;
// //   const savings = hasDiscount ? plan.price - plan.discountedPrice : 0;
// //   const discountPercent = hasDiscount ? Math.round(((plan.price - plan.discountedPrice) / plan.price) * 100) : 0;

// //   return (
// //     <div className={styles.page}>
// //       {/* ═══ HERO — text left, image right ══════════════ */}
// //       <section className={styles.hero}>
// //         <div className={styles.heroGrid}>
// //           {/* LEFT: copy + price + actions */}
// //           <div className={styles.heroLeft}>
// //             <div className={styles.heroBadge}>
// //               <span className={styles.heroBadgeDot} />
// //               Premium Program
// //             </div>

// //             <h1 className={styles.heroTitle}>
// //               {plan.title.split(" ").map((word, i, arr) =>
// //                 i === arr.length - 1 ? <em key={i}>{word}</em> : <span key={i}>{word} </span>
// //               )}
// //             </h1>

// //             <p className={styles.heroDesc}>{plan.description}</p>

// //             <div className={styles.heroPriceRow}>
// //               <div className={styles.priceWrapper}>
// //                 <span className={styles.currency}>₹</span>
// //                 <span className={styles.price}>{actualPrice.toLocaleString("en-IN")}</span>
// //                 {hasDiscount && (
// //                   <span className={styles.priceOriginal}>
// //                     ₹{plan.price.toLocaleString("en-IN")}
// //                   </span>
// //                 )}
// //               </div>
// //               {hasDiscount && (
// //                 <span className={styles.saveBadge}>
// //                   Save {discountPercent}%
// //                 </span>
// //               )}
// //             </div>

// //             <div className={styles.heroActions}>
// //               <BuyButton plan={plan} />
// //               <a className={styles.btnSecondary} href="#features">
// //                 Explore Features
// //                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
// //                   <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
// //                 </svg>
// //               </a>
// //             </div>
// //           </div>

// //           {/* RIGHT: image card */}
// //           <div className={styles.heroRight}>
// //             <div className={styles.heroImageCard}>
// //               {plan.bannerImage ? (
// //                 <Image
// //                   src={plan.bannerImage}
// //                   alt={plan.title}
// //                   fill
// //                   className={styles.heroImage}
// //                   priority
// //                   sizes="(max-width: 900px) 90vw, 42vw"
// //                 />
// //               ) : (
// //                 <div className={styles.heroNoBanner}>
// //                   <span className={styles.heroNoBannerIcon}>🚀</span>
// //                 </div>
// //               )}
// //             </div>
// //             <div className={styles.heroImageGlow} />
// //           </div>
// //         </div>
// //       </section>

// //       {/* ═══ TRUST STRIP ═════════════════════════════════ */}
// //       <TrustStrip />

// //       {/* ═══ FEATURES ════════════════════════════════════ */}
// //       <section id="features" className={styles.section}>
// //         <div className={styles.sectionHeader}>
// //           <span className={styles.sectionTag}>Features</span>
// //           <h2 className={styles.sectionTitle}>
// //             Everything You <span className={styles.highlight}>Get</span>
// //           </h2>
// //           <p className={styles.sectionSubtitle}>
// //             All the tools and resources you need to succeed
// //           </p>
// //           <div className={styles.sectionRule} />
// //         </div>
// //         <FeaturesGrid features={plan.features} />
// //       </section>

// //       {/* ═══ HOW IT WORKS ════════════════════════════════ */}
// //       {plan.processSteps?.length > 0 && (
// //         <section className={`${styles.section} ${styles.sectionAlt} ${styles.processSection}`} id="how-it-works">
// //           <div className={styles.sectionAltInner}>
// //             <div className={styles.sectionHeader}>
// //               <span className={styles.sectionTag}>Process</span>
// //               <h2 className={styles.sectionTitle}>
// //                 How It <span className={styles.highlight}>Works</span>
// //               </h2>
// //               <p className={styles.sectionSubtitle}>
// //                 Your journey to mastery in 3 simple steps
// //               </p>
// //               <div className={styles.sectionRule} />
// //             </div>
// //             <ProcessSteps steps={plan.processSteps} />
// //           </div>
// //         </section>
// //       )}

// //       {/* ═══ WHY BUY ═════════════════════════════════════ */}
// //       <section className={styles.section}>
// //         <div className={styles.sectionHeader}>
// //           <span className={styles.sectionTag}>Why Choose</span>
// //           <h2 className={styles.sectionTitle}>
// //             <span className={styles.highlight}>Proven</span> Results
// //           </h2>
// //           <p className={styles.sectionSubtitle}>
// //             Join thousands of successful students
// //           </p>
// //           <div className={styles.sectionRule} />
// //         </div>

// //         <div className={styles.whyLayout}>
// //           <div className={styles.whyText}>
// //             <p>
// //               Most learners fail not because of lack of talent — they lack <strong>direction, feedback, and accountability</strong>.
// //             </p>
// //             <p>
// //               This premium program bridges that gap. You'll learn with a mentor beside you, build with real-world constraints, and receive <strong>honest, precise feedback</strong> that accelerates growth by years.
// //             </p>
// //             <p>
// //               Every feature exists for one reason: to get you from where you are to <strong>where you want to be</strong> — faster and smarter.
// //             </p>
// //             <div className={styles.whyCta}>
// //               <BuyButton plan={plan} />
// //             </div>
// //           </div>
// //           <Stats />
// //         </div>
// //       </section>

// //       {/* ═══ FAQ ═════════════════════════════════════════ */}
// //       {plan.faqs?.length > 0 && (
// //         <section className={`${styles.section} ${styles.sectionAlt}`} id="faq">
// //           <div className={styles.sectionAltInner}>
// //             <div className={styles.sectionHeader}>
// //               <span className={styles.sectionTag}>FAQ</span>
// //               <h2 className={styles.sectionTitle}>
// //                 Common <span className={styles.highlight}>Questions</span>
// //               </h2>
// //               <p className={styles.sectionSubtitle}>
// //                 Everything you need to know
// //               </p>
// //               <div className={styles.sectionRule} />
// //             </div>

// //             <div className={styles.faqList}>
// //               {plan.faqs.map((faq, i) => (
// //                 <FAQItem key={i} question={faq.question} answer={faq.answer} />
// //               ))}
// //             </div>
// //           </div>
// //         </section>
// //       )}

// //       {/* ═══ GALLERY ═════════════════════════════════════ */}
// //       {plan.galleryImages?.length > 0 && (
// //         <section className={styles.section}>
// //           <div className={styles.sectionHeader}>
// //             <span className={styles.sectionTag}>Gallery</span>
// //             <h2 className={styles.sectionTitle}>
// //               Inside the <span className={styles.highlight}>Experience</span>
// //             </h2>
// //             <p className={styles.sectionSubtitle}>
// //               A sneak peek into the program
// //             </p>
// //             <div className={styles.sectionRule} />
// //           </div>
// //           <Gallery images={plan.galleryImages} />
// //         </section>
// //       )}

// //       {/* ═══ FINAL CTA ═══════════════════════════════════ */}
// //       <section className={styles.ctaSection}>
// //         <div className={styles.ctaInner}>
// //           <div>
// //             <div className={styles.ctaLimited}>
// //               <span className={styles.ctaLimitedDot} />
// //               Limited Seats Available
// //             </div>
// //             <h2 className={styles.ctaTitle}>
// //               Ready to <span className={styles.highlight}>Transform</span> Your Career?
// //             </h2>
// //             <p className={styles.ctaBody}>
// //               Join now and get lifetime access to all materials, community support, and mentorship.
// //             </p>
// //           </div>

// //           <div className={styles.ctaRight}>
// //             <div className={styles.ctaPriceBlock}>
// //               <p className={styles.ctaPriceLabel}>One-time investment</p>
// //               <p className={styles.ctaPriceVal}>
// //                 <small>₹</small>
// //                 {actualPrice.toLocaleString("en-IN")}
// //               </p>
// //               {hasDiscount && (
// //                 <p className={styles.ctaPriceOriginal}>
// //                   Was ₹{plan.price.toLocaleString("en-IN")}
// //                 </p>
// //               )}
// //             </div>
// //             <BuyButton plan={plan} large />
// //             <div className={styles.ctaGuarantee}>
// //               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
// //                 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
// //                 <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
// //               </svg>
// //               <span>7-day money-back guarantee</span>
// //             </div>
// //             <p className={styles.ctaNote}>🔒 Secure checkout · Instant access</p>
// //           </div>
// //         </div>
// //       </section>
// //     </div>
// //   );
// // }

// // app/premium/[slug]/page.jsx - SERVER COMPONENT (No "use client")
// import { Suspense } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import BuyButton from './BuyButton';
// import styles from "./page.module.css";

// // ✅ ISR - Revalidate every 1 hour
// export const revalidate = 3600;

// // ============================================
// // DATA FETCHING (Server Side)
// // ============================================
// async function getPlan(slug) {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/premium/plan/${slug}`, {
//       next: { revalidate: 3600 },
//       cache: 'force-cache'
//     });

//     if (!res.ok) {
//       throw new Error(`Failed to fetch plan: ${res.status}`);
//     }

//     const data = await res.json();
//     return data.plan || null;
//   } catch (error) {
//     console.error('Error fetching plan:', error);
//     return null;
//   }
// }

// // ============================================
// // STATIC DATA
// // ============================================
// const TRUST_ITEMS = [
//   { icon: "🏆", label: "Expert Mentorship", sub: "Learn from industry veterans" },
//   { icon: "💬", label: "Community Access", sub: "Join 500+ active learners" },
//   { icon: "🛠", label: "Real Projects", sub: "Build production-ready apps" },
//   { icon: "🚀", label: "Career Boost", sub: "Get hired faster" },
// ];

// const STATS = [
//   { num: "94%", label: "Placement Rate", sub: "Within 6 months of completion" },
//   { num: "3×", label: "Salary Hike", sub: "Average increase reported" },
//   { num: "500+", label: "Active Alumni", sub: "And growing every day" },
// ];

// // ============================================
// // SERVER COMPONENTS
// // ============================================

// // Trust Strip
// const TrustStrip = () => (
//   <div className={styles.trustStrip}>
//     <div className={styles.trustInner}>
//       {TRUST_ITEMS.map((item, i) => (
//         <div key={i} className={styles.trustItem}>
//           <div className={styles.trustIcon}>{item.icon}</div>
//           <div>
//             <p className={styles.trustLabel}>{item.label}</p>
//             <p className={styles.trustSub}>{item.sub}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// // Features Grid
// const FeaturesGrid = ({ features }) => (
//   <div className={styles.featuresGrid}>
//     {features?.map((feature, i) => (
//       <div key={i} className={styles.featureCard}>
//         <div className={styles.featureCheck}>
//           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
//             <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
//           </svg>
//         </div>
//         <p className={styles.featureText}>{feature}</p>
//       </div>
//     ))}
//   </div>
// );

// // Process Steps
// const ProcessSteps = ({ steps }) => (
//   <div className={styles.processLayout}>
//     {steps?.map((step, i) => (
//       <div key={i} className={styles.stepRow}>
//         <div className={styles.stepLeft}>
//           <div className={styles.stepNum}>{i + 1}</div>
//           {i < steps.length - 1 && <div className={styles.stepLine} />}
//         </div>
//         <div className={styles.stepBody}>
//           <p className={styles.stepBadge}>Step {i + 1}</p>
//           <h3 className={styles.stepTitle}>{step.title}</h3>
//           <p className={styles.stepDesc}>{step.description}</p>
//         </div>
//       </div>
//     ))}
//   </div>
// );

// // FAQ Items
// const FAQItem = ({ question, answer }) => (
//   <details className={styles.faqItem}>
//     <summary className={styles.faqTrigger}>
//       <span className={styles.faqQuestion}>{question}</span>
//       <span className={styles.faqChevron}>
//         <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
//           <path d="M1 1L6 7L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//         </svg>
//       </span>
//     </summary>
//     <div className={styles.faqBody}>
//       <p className={styles.faqAnswer}>{answer}</p>
//     </div>
//   </details>
// );

// // Gallery
// const Gallery = ({ images }) => (
//   <div className={styles.galleryGrid}>
//     {images?.slice(0, 4).map((img, i) => (
//       <div key={i} className={`${styles.galItem} ${i === 0 ? styles.galMain : ''}`}>
//         <Image
//           src={img}
//           alt={`Preview ${i + 1}`}
//           width={i === 0 ? 800 : 400}
//           height={i === 0 ? 400 : 200}
//           className={styles.galImage}
//           loading="lazy"
//         />
//       </div>
//     ))}
//   </div>
// );

// // Stats
// const Stats = () => (
//   <div className={styles.stats}>
//     {STATS.map((stat, i) => (
//       <div key={i} className={styles.statCard}>
//         <div className={styles.statNum}>{stat.num}</div>
//         <div className={styles.statLabel}>
//           <strong>{stat.label}</strong>
//           {stat.sub}
//         </div>
//       </div>
//     ))}
//   </div>
// );

// // ============================================
// // DELIVERABLES COMPONENT (New)
// // ============================================
// const Deliverables = ({ deliverables }) => (
//   <div className={styles.deliverablesGrid}>
//     {deliverables?.map((item, i) => (
//       <div key={i} className={styles.deliverableCard}>
//         {item.icon && <span className={styles.deliverableIcon}>{item.icon}</span>}
//         <h4 className={styles.deliverableTitle}>{item.title}</h4>
//         <p className={styles.deliverableDesc}>{item.description}</p>
//       </div>
//     ))}
//   </div>
// );

// // ============================================
// // PLANS (Multi-tier) COMPONENT (New)
// // ============================================
// const PlansDisplay = ({ plans }) => (
//   <div className={styles.plansGrid}>
//     {plans?.map((plan, i) => (
//       <div key={i} className={`${styles.planCard} ${plan.isRecommended ? styles.recommended : ''}`}>
//         {plan.isRecommended && (
//           <span className={styles.recommendedBadge}>⭐ Recommended</span>
//         )}
//         <h4 className={styles.planName}>{plan.name}</h4>
//         <div className={styles.planPrice}>
//           <span className={styles.planCurrency}>₹</span>
//           <span className={styles.planAmount}>{plan.price}</span>
//           {plan.discountedPrice && (
//             <span className={styles.planOriginal}>₹{plan.discountedPrice}</span>
//           )}
//         </div>
//         {plan.deliveryTime && (
//           <p className={styles.planDelivery}>
//             Delivery: {plan.deliveryTime.value} {plan.deliveryTime.unit}
//           </p>
//         )}
//         {plan.features?.length > 0 && (
//           <ul className={styles.planFeatures}>
//             {plan.features.map((f, idx) => (
//               <li key={idx}>{f}</li>
//             ))}
//           </ul>
//         )}
//       </div>
//     ))}
//   </div>
// );

// // ============================================
// // MAIN PAGE (Server Component)
// // ============================================
// export default async function PremiumDetailPage({ params }) {
//   const plan = await getPlan(params.slug);

//   if (!plan) {
//     return (
//       <div className={styles.notFound}>
//         <h1>Plan Not Found</h1>
//         <Link href="/premium" className={styles.backLink}>← Back to Plans</Link>
//       </div>
//     );
//   }

//   const hasDiscount = plan.discountedPrice != null && plan.discountedPrice < plan.price;
//   const actualPrice = hasDiscount ? plan.discountedPrice : plan.price;
//   const savings = hasDiscount ? plan.price - plan.discountedPrice : 0;
//   const discountPercent = hasDiscount ? Math.round(((plan.price - plan.discountedPrice) / plan.price) * 100) : 0;

//   return (
//     <div className={styles.page}>
//       {/* ═══ HERO — text left, image right ══════════════ */}
//       <section className={styles.hero}>
//         <div className={styles.heroGrid}>
//           {/* LEFT: copy + price + actions */}
//           <div className={styles.heroLeft}>
//             <div className={styles.heroBadge}>
//               <span className={styles.heroBadgeDot} />
//               {plan.category ? plan.category.replace('-', ' ').toUpperCase() : 'Premium Program'}
//             </div>

//             <h1 className={styles.heroTitle}>
//               {plan.title?.split(" ").map((word, i, arr) =>
//                 i === arr.length - 1 ? <em key={i}>{word}</em> : <span key={i}>{word} </span>
//               )}
//             </h1>

//             {plan.shortDescription && (
//               <p className={styles.heroShortDesc}>{plan.shortDescription}</p>
//             )}
//             <p className={styles.heroDesc}>{plan.description}</p>

//             <div className={styles.heroPriceRow}>
//               <div className={styles.priceWrapper}>
//                 <span className={styles.currency}>₹</span>
//                 <span className={styles.price}>{actualPrice?.toLocaleString("en-IN")}</span>
//                 {hasDiscount && (
//                   <span className={styles.priceOriginal}>
//                     ₹{plan.price?.toLocaleString("en-IN")}
//                   </span>
//                 )}
//               </div>
//               {hasDiscount && (
//                 <span className={styles.saveBadge}>
//                   Save {discountPercent}%
//                 </span>
//               )}
//             </div>

//             <div className={styles.heroActions}>
//               <BuyButton plan={plan} />
//               <a className={styles.btnSecondary} href="#features">
//                 Explore Features
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>
//               </a>
//             </div>
//           </div>

//           {/* RIGHT: image card */}
//           <div className={styles.heroRight}>
//             <div className={styles.heroImageCard}>
//               {plan.bannerImage ? (
//                 <Image
//                   src={plan.bannerImage}
//                   alt={plan.title}
//                   fill
//                   className={styles.heroImage}
//                   priority
//                   sizes="(max-width: 900px) 90vw, 42vw"
//                 />
//               ) : (
//                 <div className={styles.heroNoBanner}>
//                   <span className={styles.heroNoBannerIcon}>🚀</span>
//                 </div>
//               )}
//             </div>
//             <div className={styles.heroImageGlow} />
//           </div>
//         </div>
//       </section>

//       {/* ═══ TRUST STRIP ═════════════════════════════════ */}
//       <TrustStrip />

//       {/* ═══ PLANS (Multi-tier) ═══════════════════════════ */}
//       {plan.plans?.length > 0 && (
//         <section className={styles.section}>
//           <div className={styles.sectionHeader}>
//             <span className={styles.sectionTag}>Plans</span>
//             <h2 className={styles.sectionTitle}>
//               Choose Your <span className={styles.highlight}>Plan</span>
//             </h2>
//             <p className={styles.sectionSubtitle}>
//               Select the plan that best fits your needs
//             </p>
//             <div className={styles.sectionRule} />
//           </div>
//           <PlansDisplay plans={plan.plans} />
//         </section>
//       )}

//       {/* ═══ FEATURES ════════════════════════════════════ */}
//       {plan.features?.length > 0 && (
//         <section id="features" className={styles.section}>
//           <div className={styles.sectionHeader}>
//             <span className={styles.sectionTag}>Features</span>
//             <h2 className={styles.sectionTitle}>
//               Everything You <span className={styles.highlight}>Get</span>
//             </h2>
//             <p className={styles.sectionSubtitle}>
//               All the tools and resources you need to succeed
//             </p>
//             <div className={styles.sectionRule} />
//           </div>
//           <FeaturesGrid features={plan.features} />
//         </section>
//       )}

//       {/* ═══ DELIVERABLES ════════════════════════════════ */}
//       {plan.deliverables?.length > 0 && (
//         <section className={`${styles.section} ${styles.sectionAlt}`}>
//           <div className={styles.sectionAltInner}>
//             <div className={styles.sectionHeader}>
//               <span className={styles.sectionTag}>Deliverables</span>
//               <h2 className={styles.sectionTitle}>
//                 What You'll <span className={styles.highlight}>Receive</span>
//               </h2>
//               <p className={styles.sectionSubtitle}>
//                 Everything included in this package
//               </p>
//               <div className={styles.sectionRule} />
//             </div>
//             <Deliverables deliverables={plan.deliverables} />
//           </div>
//         </section>
//       )}

//       {/* ═══ DELIVERY & REVISION ═════════════════════════ */}
//       {(plan.turnaroundTime || plan.revision || plan.reviewMode) && (
//         <section className={styles.section}>
//           <div className={styles.sectionHeader}>
//             <span className={styles.sectionTag}>Delivery</span>
//             <h2 className={styles.sectionTitle}>
//               <span className={styles.highlight}>Delivery</span> & Revision
//             </h2>
//             <p className={styles.sectionSubtitle}>
//               How we deliver your results
//             </p>
//             <div className={styles.sectionRule} />
//           </div>
//           <div className={styles.deliveryGrid}>
//             {plan.turnaroundTime && (
//               <div className={styles.deliveryCard}>
//                 <span className={styles.deliveryIcon}>⏱️</span>
//                 <h4>Turnaround Time</h4>
//                 <p>{plan.turnaroundTime.value} {plan.turnaroundTime.unit}</p>
//               </div>
//             )}
//             {plan.revision && (
//               <div className={styles.deliveryCard}>
//                 <span className={styles.deliveryIcon}>🔄</span>
//                 <h4>Revisions</h4>
//                 <p>{plan.revision.count} revisions • {plan.revision.validityDays} days validity</p>
//               </div>
//             )}
//             {plan.reviewMode && (
//               <div className={styles.deliveryCard}>
//                 <span className={styles.deliveryIcon}>👁️</span>
//                 <h4>Review Mode</h4>
//                 <p>{plan.reviewMode}</p>
//               </div>
//             )}
//           </div>
//         </section>
//       )}

//       {/* ═══ HOW IT WORKS ════════════════════════════════ */}
//       {plan.processSteps?.length > 0 && (
//         <section className={`${styles.section} ${styles.sectionAlt} ${styles.processSection}`} id="how-it-works">
//           <div className={styles.sectionAltInner}>
//             <div className={styles.sectionHeader}>
//               <span className={styles.sectionTag}>Process</span>
//               <h2 className={styles.sectionTitle}>
//                 How It <span className={styles.highlight}>Works</span>
//               </h2>
//               <p className={styles.sectionSubtitle}>
//                 Your journey to mastery in simple steps
//               </p>
//               <div className={styles.sectionRule} />
//             </div>
//             <ProcessSteps steps={plan.processSteps} />
//           </div>
//         </section>
//       )}

//       {/* ═══ WHY BUY ═════════════════════════════════════ */}
//       <section className={styles.section}>
//         <div className={styles.sectionHeader}>
//           <span className={styles.sectionTag}>Why Choose</span>
//           <h2 className={styles.sectionTitle}>
//             <span className={styles.highlight}>Proven</span> Results
//           </h2>
//           <p className={styles.sectionSubtitle}>
//             Join thousands of successful students
//           </p>
//           <div className={styles.sectionRule} />
//         </div>

//         <div className={styles.whyLayout}>
//           <div className={styles.whyText}>
//             <p>
//               Most learners fail not because of lack of talent — they lack <strong>direction, feedback, and accountability</strong>.
//             </p>
//             <p>
//               This premium program bridges that gap. You'll learn with a mentor beside you, build with real-world constraints, and receive <strong>honest, precise feedback</strong> that accelerates growth by years.
//             </p>
//             <p>
//               Every feature exists for one reason: to get you from where you are to <strong>where you want to be</strong> — faster and smarter.
//             </p>
//             <div className={styles.whyCta}>
//               <BuyButton plan={plan} />
//             </div>
//           </div>
//           <Stats />
//         </div>
//       </section>

//       {/* ═══ FAQ ═════════════════════════════════════════ */}
//       {plan.faqs?.length > 0 && (
//         <section className={`${styles.section} ${styles.sectionAlt}`} id="faq">
//           <div className={styles.sectionAltInner}>
//             <div className={styles.sectionHeader}>
//               <span className={styles.sectionTag}>FAQ</span>
//               <h2 className={styles.sectionTitle}>
//                 Common <span className={styles.highlight}>Questions</span>
//               </h2>
//               <p className={styles.sectionSubtitle}>
//                 Everything you need to know
//               </p>
//               <div className={styles.sectionRule} />
//             </div>

//             <div className={styles.faqList}>
//               {plan.faqs.map((faq, i) => (
//                 <FAQItem key={i} question={faq.question} answer={faq.answer} />
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* ═══ GALLERY ═════════════════════════════════════ */}
//       {plan.galleryImages?.length > 0 && (
//         <section className={styles.section}>
//           <div className={styles.sectionHeader}>
//             <span className={styles.sectionTag}>Gallery</span>
//             <h2 className={styles.sectionTitle}>
//               Inside the <span className={styles.highlight}>Experience</span>
//             </h2>
//             <p className={styles.sectionSubtitle}>
//               A sneak peek into the program
//             </p>
//             <div className={styles.sectionRule} />
//           </div>
//           <Gallery images={plan.galleryImages} />
//         </section>
//       )}

//       {/* ═══ BADGE & LEVEL ═══════════════════════════════ */}
//       {(plan.badge || plan.level) && (
//         <section className={`${styles.section} ${styles.sectionAlt}`}>
//           <div className={styles.sectionAltInner}>
//             <div className={styles.sectionHeader}>
//               <span className={styles.sectionTag}>Badge & Level</span>
//               <h2 className={styles.sectionTitle}>
//                 Program <span className={styles.highlight}>Details</span>
//               </h2>
//               <p className={styles.sectionSubtitle}>
//                 Program recognition and level
//               </p>
//               <div className={styles.sectionRule} />
//             </div>
//             <div className={styles.badgeLevelGrid}>
//               {plan.badge && (
//                 <div className={styles.badgeCard}>
//                   <span className={styles.badgeIcon}>🏅</span>
//                   <h4>Badge</h4>
//                   <p>{plan.badge}</p>
//                 </div>
//               )}
//               {plan.level && (
//                 <div className={styles.levelCard}>
//                   <span className={styles.levelIcon}>📊</span>
//                   <h4>Level</h4>
//                   <p>{plan.level}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* ═══ FINAL CTA ═══════════════════════════════════ */}
//       <section className={styles.ctaSection}>
//         <div className={styles.ctaInner}>
//           <div>
//             <div className={styles.ctaLimited}>
//               <span className={styles.ctaLimitedDot} />
//               Limited Seats Available
//             </div>
//             <h2 className={styles.ctaTitle}>
//               Ready to <span className={styles.highlight}>Transform</span> Your Career?
//             </h2>
//             <p className={styles.ctaBody}>
//               Join now and get lifetime access to all materials, community support, and mentorship.
//             </p>
//           </div>

//           <div className={styles.ctaRight}>
//             <div className={styles.ctaPriceBlock}>
//               <p className={styles.ctaPriceLabel}>One-time investment</p>
//               <p className={styles.ctaPriceVal}>
//                 <small>₹</small>
//                 {actualPrice?.toLocaleString("en-IN")}
//               </p>
//               {hasDiscount && (
//                 <p className={styles.ctaPriceOriginal}>
//                   Was ₹{plan.price?.toLocaleString("en-IN")}
//                 </p>
//               )}
//             </div>
//             <BuyButton plan={plan} large />
//             <div className={styles.ctaGuarantee}>
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//                 <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
//               </svg>
//               <span>7-day money-back guarantee</span>
//             </div>
//             <p className={styles.ctaNote}>🔒 Secure checkout · Instant access</p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }


// app/premium/[slug]/page.jsx - SERVER COMPONENT
import Image from "next/image";
import Link from "next/link";
import BuyButton from './BuyButton';
import styles from "./page.module.css";

// ✅ ISR - Revalidate every 1 hour
export const revalidate = 3600;

// ============================================
// DATA FETCHING
// ============================================
async function getPlan(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/premium/plan/${slug}`, {
      next: { revalidate: 3600 },
      // cache: 'for
      // ce-cache'
    });

    if (!res.ok) throw new Error(`Failed to fetch plan: ${res.status}`);
    const data = await res.json();
    return data.plan || null;
  } catch (error) {
    console.error('Error fetching plan:', error);
    return null;
  }
}

// ============================================
// STATIC DATA
// ============================================
const TRUST_ITEMS = [
  { icon: "🏆", label: "Expert Mentorship", sub: "Learn from industry veterans" },
  { icon: "💬", label: "Community Access", sub: "Join 500+ active learners" },
  { icon: "🛠", label: "Real Projects", sub: "Build production-ready apps" },
  { icon: "🚀", label: "Career Boost", sub: "Get hired faster" },
];

const STATS = [
  { num: "94%", label: "Placement Rate", sub: "Within 6 months of completion" },
  { num: "3×", label: "Salary Hike", sub: "Average increase reported" },
  { num: "500+", label: "Active Alumni", sub: "And growing every day" },
];

// ============================================
// COMPONENTS
// ============================================

// ─── Trust Strip ───
const TrustStrip = () => (
  <div className={styles.trustStrip}>
    <div className={styles.trustInner}>
      {TRUST_ITEMS.map((item, i) => (
        <div key={i} className={styles.trustItem}>
          <div className={styles.trustIcon}>{item.icon}</div>
          <div>
            <p className={styles.trustLabel}>{item.label}</p>
            <p className={styles.trustSub}>{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Features Grid ───
const FeaturesGrid = ({ features }) => (
  <div className={styles.featuresGrid}>
    {features?.map((feature, i) => (
      <div key={i} className={styles.featureCard}>
        <div className={styles.featureCheck}>✓</div>
        <p className={styles.featureText}>{feature}</p>
      </div>
    ))}
  </div>
);

// ─── Process Steps ───
const ProcessSteps = ({ steps }) => (
  <div className={styles.processLayout}>
    {steps?.map((step, i) => (
      <div key={i} className={styles.stepRow}>
        <div className={styles.stepLeft}>
          <div className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</div>
          {i < steps.length - 1 && <div className={styles.stepLine} />}
        </div>
        <div className={styles.stepBody}>
          <span className={styles.stepBadge}>Step {i + 1}</span>
          <h3 className={styles.stepTitle}>{step.title}</h3>
          <p className={styles.stepDesc}>{step.description}</p>
        </div>
      </div>
    ))}
  </div>
);

// ─── FAQ Items ───
const FAQItem = ({ question, answer }) => (
  <details className={styles.faqItem}>
    <summary className={styles.faqTrigger}>
      <span>{question}</span>
      <svg className={styles.faqChevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </summary>
    <div className={styles.faqBody}>
      <p>{answer}</p>
    </div>
  </details>
);

// ─── Gallery ───
const Gallery = ({ images }) => (
  <div className={styles.galleryGrid}>
    {images?.slice(0, 4).map((img, i) => (
      <div key={i} className={`${styles.galItem} ${i === 0 ? styles.galMain : ''}`}>
        <Image
          src={img}
          alt={`Gallery ${i + 1}`}
          fill
          className={styles.galImage}
          loading="lazy"
        />
      </div>
    ))}
  </div>
);

// ─── Stats ───
const Stats = () => (
  <div className={styles.stats}>
    {STATS.map((stat, i) => (
      <div key={i} className={styles.statCard}>
        <span className={styles.statNum}>{stat.num}</span>
        <div className={styles.statLabel}>
          <strong>{stat.label}</strong>
          <span>{stat.sub}</span>
        </div>
      </div>
    ))}
  </div>
);

// ─── Deliverables ───
const Deliverables = ({ deliverables }) => (
  <div className={styles.deliverablesGrid}>
    {deliverables?.map((item, i) => (
      <div key={i} className={styles.deliverableCard}>
        <span className={styles.deliverableIcon}>{item.icon || '📦'}</span>
        <h4>{item.title}</h4>
        <p>{item.description}</p>
      </div>
    ))}
  </div>
);

// ─── Plans (Multi-tier) ───
const PlansDisplay = ({ plans }) => (
  <div className={styles.plansGrid}>
    {plans?.map((plan, i) => (
      <div key={i} className={`${styles.planCard} ${plan.isRecommended ? styles.recommended : ''}`}>
        {plan.isRecommended && <span className={styles.recommendedBadge}>⭐ Recommended</span>}
        <h4>{plan.name}</h4>
        <div className={styles.planPrice}>
          <span className={styles.planCurrency}>₹</span>
          <span className={styles.planAmount}>{plan.price}</span>
          {plan.discountedPrice && (
            <span className={styles.planOriginal}>₹{plan.discountedPrice}</span>
          )}
        </div>
        {plan.deliveryTime && (
          <p className={styles.planDelivery}>⏱️ {plan.deliveryTime.value} {plan.deliveryTime.unit}</p>
        )}
        {plan.features?.length > 0 && (
          <ul className={styles.planFeatures}>
            {plan.features.map((f, idx) => (
              <li key={idx}>✓ {f}</li>
            ))}
          </ul>
        )}
      </div>
    ))}
  </div>
);

// ─── Delivery Info ───
const DeliveryInfo = ({ turnaroundTime, revision, reviewMode }) => (
  <div className={styles.deliveryGrid}>
    {turnaroundTime && (
      <div className={styles.deliveryCard}>
        <span className={styles.deliveryIcon}>⏱️</span>
        <h4>Turnaround Time</h4>
        <p>{turnaroundTime.value} {turnaroundTime.unit}</p>
      </div>
    )}
    {revision && (
      <div className={styles.deliveryCard}>
        <span className={styles.deliveryIcon}>🔄</span>
        <h4>Revisions</h4>
        <p>{revision.count} revisions • {revision.validityDays} days validity</p>
      </div>
    )}
    {reviewMode && (
      <div className={styles.deliveryCard}>
        <span className={styles.deliveryIcon}>👁️</span>
        <h4>Review Mode</h4>
        <p>{reviewMode}</p>
      </div>
    )}
  </div>
);

// ─── Badge & Level ───
const BadgeLevel = ({ badge, level }) => (
  <div className={styles.badgeLevelGrid}>
    {badge && (
      <div className={styles.badgeCard}>
        <span className={styles.badgeIcon}>🏅</span>
        <h4>Badge</h4>
        <p>{badge}</p>
      </div>
    )}
    {level && (
      <div className={styles.levelCard}>
        <span className={styles.levelIcon}>📊</span>
        <h4>Level</h4>
        <p>{level}</p>
      </div>
    )}
  </div>
);

// ============================================
// MAIN PAGE
// ============================================
export default async function PremiumDetailPage({ params }) {
  const plan = await getPlan(params.slug);

  if (!plan) {
    return (
      <div className={styles.notFound}>
        <h1>Plan Not Found</h1>
        <Link href="/premium" className={styles.backLink}>← Back to Plans</Link>
      </div>
    );
  }

  const hasDiscount = plan.discountedPrice != null && plan.discountedPrice < plan.price;
  const actualPrice = hasDiscount ? plan.discountedPrice : plan.price;
  const discountPercent = hasDiscount ? Math.round(((plan.price - plan.discountedPrice) / plan.price) * 100) : 0;

  // Category badge mapping
  const categoryMap = {
    'mock-interview': { label: 'Mock Interview', emoji: '🎯', color: '#4F46E5' },
    'resume': { label: 'Resume Writing', emoji: '📄', color: '#059669' },
    'linkedin': { label: 'LinkedIn Optimization', emoji: '💼', color: '#0A66C2' },
    'career-guidance': { label: 'Career Guidance', emoji: '🧭', color: '#D97706' },
    'mentorship': { label: 'Mentorship', emoji: '👨‍🏫', color: '#7C3AED' },
    'portfolio': { label: 'Portfolio Review', emoji: '🎨', color: '#DC2626' },
    'website-review': { label: 'Website Review', emoji: '🌐', color: '#0891B2' },
  };
  const categoryInfo = categoryMap[plan.category] || { label: 'Premium', emoji: '✨', color: '#6B7280' };

  return (
    <div className={styles.page}>
      
      {/* ════════════════════════════════════════════════════
         HERO SECTION
         ════════════════════════════════════════════════════ */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroLeft}>
            <span className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              {categoryInfo.emoji} {categoryInfo.label}
            </span>

            <h1 className={styles.heroTitle}>
              {plan.title}
            </h1>

            {plan.shortDescription && (
              <p className={styles.heroShortDesc}>{plan.shortDescription}</p>
            )}
            <p className={styles.heroDesc}>{plan.description}</p>

            <div className={styles.heroPriceRow}>
              <div className={styles.priceWrapper}>
                <span className={styles.currency}>₹</span>
                <span className={styles.price}>{actualPrice?.toLocaleString("en-IN")}</span>
                {hasDiscount && (
                  <span className={styles.priceOriginal}>₹{plan.price?.toLocaleString("en-IN")}</span>
                )}
              </div>
              {hasDiscount && (
                <span className={styles.saveBadge}>Save {discountPercent}%</span>
              )}
            </div>

            <div className={styles.heroActions}>
              <BuyButton plan={plan} />
              <a className={styles.btnSecondary} href="#features">
                Explore Features →
              </a>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.heroImageCard}>
              {plan.bannerImage ? (
                <Image
                  src={plan.bannerImage}
                  alt={plan.title}
                  fill
                  className={styles.heroImage}
                  priority
                />
              ) : (
                <div className={styles.heroNoBanner}>
                  <span>{categoryInfo.emoji}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
         TRUST STRIP
         ════════════════════════════════════════════════════ */}
      <TrustStrip />

      {/* ════════════════════════════════════════════════════
         PLANS (Multi-tier)
         ════════════════════════════════════════════════════ */}
      {plan.plans?.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>📋 Plans</span>
            <h2 className={styles.sectionTitle}>Choose Your <span className={styles.highlight}>Plan</span></h2>
            <p className={styles.sectionSubtitle}>Select the plan that best fits your needs</p>
            <div className={styles.sectionRule} />
          </div>
          <PlansDisplay plans={plan.plans} />
        </section>
      )}

      {/* ════════════════════════════════════════════════════
         FEATURES
         ════════════════════════════════════════════════════ */}
      {plan.features?.length > 0 && (
        <section id="features" className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.sectionAltInner}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTag}>✨ Features</span>
              <h2 className={styles.sectionTitle}>Everything You <span className={styles.highlight}>Get</span></h2>
              <p className={styles.sectionSubtitle}>All the tools and resources you need to succeed</p>
              <div className={styles.sectionRule} />
            </div>
            <FeaturesGrid features={plan.features} />
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════
         DELIVERABLES
         ════════════════════════════════════════════════════ */}
      {plan.deliverables?.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>📦 Deliverables</span>
            <h2 className={styles.sectionTitle}>What You'll <span className={styles.highlight}>Receive</span></h2>
            <p className={styles.sectionSubtitle}>Everything included in this package</p>
            <div className={styles.sectionRule} />
          </div>
          <Deliverables deliverables={plan.deliverables} />
        </section>
      )}

      {/* ════════════════════════════════════════════════════
         DELIVERY & REVISION
         ════════════════════════════════════════════════════ */}
      {(plan.turnaroundTime || plan.revision || plan.reviewMode) && (
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.sectionAltInner}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTag}>⏱️ Delivery</span>
              <h2 className={styles.sectionTitle}><span className={styles.highlight}>Delivery</span> & Revision</h2>
              <p className={styles.sectionSubtitle}>How we deliver your results</p>
              <div className={styles.sectionRule} />
            </div>
            <DeliveryInfo 
              turnaroundTime={plan.turnaroundTime}
              revision={plan.revision}
              reviewMode={plan.reviewMode}
            />
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════
         HOW IT WORKS
         ════════════════════════════════════════════════════ */}
      {plan.processSteps?.length > 0 && (
        <section className={styles.section} id="how-it-works">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>⚙️ Process</span>
            <h2 className={styles.sectionTitle}>How It <span className={styles.highlight}>Works</span></h2>
            <p className={styles.sectionSubtitle}>Your journey to mastery in simple steps</p>
            <div className={styles.sectionRule} />
          </div>
          <ProcessSteps steps={plan.processSteps} />
        </section>
      )}

      {/* ════════════════════════════════════════════════════
         WHY CHOOSE
         ════════════════════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.sectionAltInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>💡 Why Choose</span>
            <h2 className={styles.sectionTitle}><span className={styles.highlight}>Proven</span> Results</h2>
            <p className={styles.sectionSubtitle}>Join thousands of successful students</p>
            <div className={styles.sectionRule} />
          </div>

          <div className={styles.whyLayout}>
            <div className={styles.whyText}>
              <p>
                Most learners fail not because of lack of talent — they lack <strong>direction, feedback, and accountability</strong>.
              </p>
              <p>
                This premium program bridges that gap. You'll learn with a mentor beside you, build with real-world constraints, and receive <strong>honest, precise feedback</strong> that accelerates growth by years.
              </p>
              <p>
                Every feature exists for one reason: to get you from where you are to <strong>where you want to be</strong> — faster and smarter.
              </p>
              <div className={styles.whyCta}>
                <BuyButton plan={plan} />
              </div>
            </div>
            <Stats />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
         BADGE & LEVEL
         ════════════════════════════════════════════════════ */}
      {(plan.badge || plan.level) && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>🏅 Recognition</span>
            <h2 className={styles.sectionTitle}>Program <span className={styles.highlight}>Details</span></h2>
            <p className={styles.sectionSubtitle}>Program recognition and level</p>
            <div className={styles.sectionRule} />
          </div>
          <BadgeLevel badge={plan.badge} level={plan.level} />
        </section>
      )}

      {/* ════════════════════════════════════════════════════
         FAQ
         ════════════════════════════════════════════════════ */}
      {plan.faqs?.length > 0 && (
        <section className={`${styles.section} ${styles.sectionAlt}`} id="faq">
          <div className={styles.sectionAltInner}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTag}>❓ FAQ</span>
              <h2 className={styles.sectionTitle}>Common <span className={styles.highlight}>Questions</span></h2>
              <p className={styles.sectionSubtitle}>Everything you need to know</p>
              <div className={styles.sectionRule} />
            </div>
            <div className={styles.faqList}>
              {plan.faqs.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════
         GALLERY
         ════════════════════════════════════════════════════ */}
      {plan.galleryImages?.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>🖼️ Gallery</span>
            <h2 className={styles.sectionTitle}>Inside the <span className={styles.highlight}>Experience</span></h2>
            <p className={styles.sectionSubtitle}>A sneak peek into the program</p>
            <div className={styles.sectionRule} />
          </div>
          <Gallery images={plan.galleryImages} />
        </section>
      )}

      {/* ════════════════════════════════════════════════════
         FINAL CTA
         ════════════════════════════════════════════════════ */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <div>
            <div className={styles.ctaLimited}>
              <span className={styles.ctaLimitedDot} />
              Limited Seats Available
            </div>
            <h2 className={styles.ctaTitle}>
              Ready to <span className={styles.highlight}>Transform</span> Your Career?
            </h2>
            <p className={styles.ctaBody}>
              Join now and get lifetime access to all materials, community support, and mentorship.
            </p>
          </div>

          <div className={styles.ctaRight}>
            <div className={styles.ctaPriceBlock}>
              <p className={styles.ctaPriceLabel}>One-time investment</p>
              <p className={styles.ctaPriceVal}>
                <small>₹</small>{actualPrice?.toLocaleString("en-IN")}
              </p>
              {hasDiscount && (
                <p className={styles.ctaPriceOriginal}>Was ₹{plan.price?.toLocaleString("en-IN")}</p>
              )}
            </div>
            <BuyButton plan={plan} large />
            <div className={styles.ctaGuarantee}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>7-day money-back guarantee</span>
            </div>
            <p className={styles.ctaNote}>🔒 Secure checkout · Instant access</p>
          </div>
        </div>
      </section>

    </div>
  );
}