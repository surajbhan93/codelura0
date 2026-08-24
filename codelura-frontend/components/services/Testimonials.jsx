"use client";

import { motion } from "framer-motion";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const fadeUp = {
hidden: { opacity: 0, y: 28 },
show: { opacity: 1, y: 0 },
};

const REVIEWS = [
{
name: "Hemant Panday",
role: "Founder, Lokharido",
avatar:
"https://res.cloudinary.com/dqaucdncd/image/upload/v1781932142/WhatsApp_Image_2026-03-12_at_19.16.02_nefoey.jpg",
text:
"Codelura Technologies developed our eCommerce platform, Lokharido, exactly as envisioned. The website is fast, secure, mobile responsive, and equipped with all the features needed to manage products, orders, and customers efficiently.",
projectLink: "https://lokharido.com/",
},
{
  name: "Priya Verma",
  role: "Operations Head, Verma Logistics",
  avatar:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces",
  text:
    "The Codelura team handled our social media marketing with great professionalism. Their creative content and consistent management significantly improved our brand visibility and audience engagement.",
},
{
  name: "J.P. Singh",
  role: "Founder, JP Tutorials",
  avatar:
    "https://res.cloudinary.com/dqaucdncd/image/upload/v1781932738/cropped_circle_image_tyk19l.png",
  text:
  "Codelura Technologies created a fast, professional website for JP Tutorials that enhanced our online presence. Their team delivered on time and provided excellent support throughout the project.",
  projectLink: "https://www.jptutorials.in/",
},
{
name: "Aman Gupta",
role: "CEO, TechNova",
avatar:
"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
text:
"The project was delivered before the deadline and exceeded our expectations. Performance, UI and scalability were all top-notch.",
},
{
  name: "Dr. Suhrab Singh",
  role: "Founder, Neo Dental Care",
  avatar:
    "https://res.cloudinary.com/dqaucdncd/image/upload/v1781933928/cropped_circle_image_1_n1xwui.png",
 text:
    "Codelura Technologies created a fast, professional website for Neo Dental Care that enhanced our online presence and improved patient engagement. The project was delivered on time with excellent support.",
  projectLink: "https://neodentalcare.in/",
},

{
name: "Karan Malhotra",
role: "Founder, StartupHub",
avatar:
"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
text:
"Their attention to detail and commitment to quality stood out. We were impressed by the performance and scalability of the final product.",
},
{
  name: "Manuel R Avila",
  role: "Marketing Manager, Roofing Monkey",
  avatar:
    "https://res.cloudinary.com/dqaucdncd/image/upload/v1781934190/cropped_circle_image_2_ly6hs4.png",
  text:
    "Codelura Technologies built a modern, professional website for Roofing Monkey. The team delivered on time, understood our requirements clearly, and provided excellent support throughout the project.",
  projectLink: "https://www.roofingmonkey.ca/",
},
{
name: "Neha Kapoor",
role: "CEO, Kapoor Consultancy",
avatar:
"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces",
text:
"Excellent communication, transparent pricing, and timely delivery. The support team has been incredibly responsive even after project completion.",
},
];

export default function Testimonials() {
const settings = {
dots: true,
arrows: false,
infinite: true,
autoplay: true,
autoplaySpeed: 3500,
speed: 700,
slidesToShow: 3,
slidesToScroll: 1,
pauseOnHover: true,
responsive: [
{
breakpoint: 1024,
settings: {
slidesToShow: 2,
},
},
{
breakpoint: 640,
settings: {
slidesToShow: 1,
},
},
],
};

return (
<section style={{ padding: "0 0 80px" }}> <div className="cl-wrap"> <div className="cl-line" />


    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
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
        Client Feedback
      </span>

      <h2
        className="syne"
        style={{
          fontSize: "clamp(24px,3.5vw,44px)",
          fontWeight: 800,
          margin: "16px 0 12px",
        }}
      >
        What our recent <span className="cl-grad">clients say</span>
      </h2>

      <p
        style={{
          color: "rgba(255,255,255,0.55)",
          fontSize: 15,
        }}
      >
        Real feedback from businesses we've worked with
      </p>
    </motion.div>

    <Slider {...settings}>
      {REVIEWS.map((r) => (
        <div key={r.name} className="testimonial-slide">
          <div className="testimonial-card">
            <p className="testimonial-text">
              "{r.text}"
            </p>

            <div className="testimonial-footer">
              <img
                src={r.avatar}
                alt={r.name}
                className="testimonial-avatar"
              />

              <div>
                <div className="testimonial-name">
                  {r.name}
                </div>

                <div className="testimonial-role">
                  {r.role}
                </div>
              </div>
            </div>

            {r.projectLink && (
              <a
                href={r.projectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="testimonial-link"
              >
                Visit Website ↗
              </a>
            )}
          </div>
        </div>
      ))}
    </Slider>
  </div>

  <style>{`
    .testimonial-slide{
      padding:0 12px;
    }

    .testimonial-card{
      height:320px;
      padding:26px;
      border-radius:20px;
      background:rgba(255,255,255,0.04);
      border:1px solid rgba(255,255,255,0.08);
      backdrop-filter:blur(10px);
      display:flex;
      flex-direction:column;
    }

    .testimonial-text{
      flex:1;
      font-size:14px;
      line-height:1.8;
      color:rgba(255,255,255,0.72);
      margin:0;
    }

    .testimonial-footer{
      display:flex;
      align-items:center;
      gap:12px;
      padding-top:18px;
      border-top:1px solid rgba(255,255,255,0.08);
    }

    .testimonial-avatar{
      width:48px;
      height:48px;
      border-radius:50%;
      object-fit:cover;
      flex-shrink:0;
    }

    .testimonial-name{
      color:#fff;
      font-size:15px;
      font-weight:700;
    }

    .testimonial-role{
      color:rgba(255,255,255,0.5);
      font-size:12px;
      margin-top:2px;
    }

    .testimonial-link{
      margin-top:16px;
      display:inline-flex;
      align-items:center;
      gap:6px;
      color:#ff6b35;
      font-size:13px;
      font-weight:600;
      text-decoration:none;
      transition:.3s;
    }

    .testimonial-link:hover{
      color:#ff8a57;
    }

    .slick-list{
      margin:0 -12px;
      padding-bottom:30px;
    }

    .slick-track{
      display:flex;
    }

    .slick-slide{
      height:auto;
    }

    .slick-slide > div{
      height:100%;
    }

    .slick-dots li button:before{
      color:#ff6b35 !important;
      opacity:.4;
    }

    .slick-dots li.slick-active button:before{
      color:#ff6b35 !important;
      opacity:1;
    }

    @media(max-width:640px){
      .testimonial-card{
        height:auto;
        min-height:280px;
      }
    }
  `}</style>
</section>


);
}
