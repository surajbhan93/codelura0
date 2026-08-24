"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

type Service = {
  _id: string;
  slug: string;
  title: string;
  shortDescription?: string;
  image?: string;
};

export default function RelatedServices() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    api
      .get("/services")
      .then((res) => {
        setServices(res.data.data || []);
      })
      .catch(console.error);
  }, []);

  return (
    <section style={{ padding: "0 0 80px" }}>
      <div className="cl-wrap">
        <div className="cl-line" />

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span
            className="cl-pill"
            style={{ marginBottom: 18, display: "inline-flex" }}
          >
            More Services
          </span>

          <h2
            className="syne"
            style={{
              fontSize: "clamp(24px,3.5vw,44px)",
              fontWeight: 800,
              margin: "16px 0",
            }}
          >
            Related <span className="cl-grad">Services</span>
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,.5)",
              fontSize: 15,
            }}
          >
            Explore more solutions to grow your business
          </p>
        </div>

        <div className="related-grid">
          {services.slice(0, 4).map((service) => (
            <Link
              key={service._id}
              href={`/services/${service.slug}`}
              className="related-card"
            >
              {service.image && (
                <img
                  src={service.image}
                  alt={service.title}
                  className="related-img"
                />
              )}

              <div className="related-body">
                <h3>{service.title}</h3>

                <p>
                  {service.shortDescription}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 30 }}>
          <Link
            href="/services/getallservices"
            className="cl-btn-p"
            style={{
              textDecoration: "none",
            }}
          >
            View All Services →
          </Link>
        </div>
      </div>

      <style>{`
        .related-grid{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:18px;
        }

        .related-card{
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.08);
          border-radius:18px;
          overflow:hidden;
          text-decoration:none;
          transition:.3s;
        }

        .related-card:hover{
          transform:translateY(-4px);
          border-color:rgba(255,107,53,.4);
        }

        .related-img{
          width:100%;
          height:160px;
          object-fit:cover;
        }

        .related-body{
          padding:16px;
        }

        .related-body h3{
          color:#fff;
          font-size:16px;
          font-weight:700;
          margin-bottom:8px;
          line-height:1.4;
        }

        .related-body p{
          color:rgba(255,255,255,.55);
          font-size:13px;
          line-height:1.6;

          display:-webkit-box;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;
          overflow:hidden;
        }

        @media(max-width:1024px){
          .related-grid{
            grid-template-columns:repeat(2,1fr);
          }
        }

        @media(max-width:768px){
          .related-grid{
            grid-template-columns:repeat(2,1fr);
            gap:12px;
          }

          .related-img{
            height:120px;
          }

          .related-body{
            padding:12px;
          }

          .related-body h3{
            font-size:14px;
          }

          .related-body p{
            font-size:12px;
          }
        }
      `}</style>
    </section>
  );
}