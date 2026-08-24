"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function Portfolio() {
const [projects, setProjects] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
api
.get("/work")
.then((res) => {
setProjects(res.data.data || []);
})
.catch(console.error)
.finally(() => setLoading(false));
}, []);

// Only show first 4 projects
const visibleProjects = projects.slice(0, 4);

return (
<section style={{ padding: "0 0 80px" }}> <div className="cl-wrap"> <div className="cl-line" />


    <div style={{ textAlign: "center", marginBottom: 40 }}>
      <span
        className="cl-pill"
        style={{ marginBottom: 18, display: "inline-flex" }}
      >
        Our Portfolio
      </span>

      <h2
        className="syne"
        style={{
          fontSize: "clamp(24px,3.5vw,44px)",
          fontWeight: 800,
          margin: "16px 0",
        }}
      >
        Recent <span className="cl-grad">Projects</span>
      </h2>

      <p
        style={{
          color: "rgba(255,255,255,.45)",
          maxWidth: 600,
          margin: "0 auto",
          lineHeight: 1.7,
        }}
      >
        Explore some of our latest websites, SaaS platforms,
        business applications and custom software solutions.
      </p>
    </div>

    {loading ? (
      <div className="cl-port-grid">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="cl-glass"
            style={{
              height: 300,
              borderRadius: 16,
            }}
          />
        ))}
      </div>
    ) : (
      <>
        <div className="cl-port-grid">
          {visibleProjects.map((project) => (
            <Link
              key={project._id}
              href={`/work/${project.slug}`}
              className="cl-glass portfolio-card"
              style={{
                textDecoration: "none",
                overflow: "hidden",
                display: "block",
              }}
            >
              <img
                src={
                  project.thumbnail ||
                  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&h=600&fit=crop"
                }
                alt={project.title}
                className="portfolio-img"
              />

              <div style={{ padding: 16 }}>
                {project.category && (
                  <span
                    style={{
                      color: "#ff6b35",
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                    }}
                  >
                    {project.category}
                  </span>
                )}

                <h3
                  style={{
                    color: "#fff",
                    marginTop: 8,
                    marginBottom: 8,
                    fontSize: 16,
                    lineHeight: 1.4,
                    fontWeight: 700,
                  }}
                >
                  {project.title}
                </h3>

                <p
                  className="portfolio-desc"
                  style={{
                    color: "rgba(255,255,255,.55)",
                    lineHeight: 1.6,
                    fontSize: 13,
                    margin: 0,
                  }}
                >
                  {project.shortDescription}
                </p>

                {project.techStack?.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      marginTop: 12,
                    }}
                  >
                    {project.techStack
                      .slice(0, 2)
                      .map((tech) => (
                        <span
                          key={tech}
                          style={{
                            padding: "4px 8px",
                            borderRadius: 6,
                            fontSize: 10,
                            background: "rgba(255,255,255,.06)",
                            color: "rgba(255,255,255,.7)",
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 32,
          }}
        >
          <Link
            href="/work"
            className="cl-btn-p"
            style={{
              textDecoration: "none",
            }}
          >
            View All Projects →
          </Link>
        </div>
      </>
    )}
  </div>

  <style>{`
    .cl-port-grid{
      display:grid;
      grid-template-columns:repeat(4,1fr);
      gap:20px;
    }

    .portfolio-card{
      transition:all .3s ease;
    }

    .portfolio-card:hover{
      transform:translateY(-5px);
    }

    .portfolio-img{
      width:100%;
      height:220px;
      object-fit:cover;
      display:block;
    }

    .portfolio-desc{
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      overflow:hidden;
    }

    @media(max-width:1024px){
      .cl-port-grid{
        grid-template-columns:repeat(2,1fr);
      }
    }

    @media(max-width:768px){
      .cl-port-grid{
        grid-template-columns:repeat(2,1fr);
        gap:12px;
      }

      .portfolio-img{
        height:140px;
      }

      .portfolio-card h3{
        font-size:14px !important;
      }

      .portfolio-desc{
        font-size:12px !important;
      }
    }
  `}</style>
</section>


);
}
