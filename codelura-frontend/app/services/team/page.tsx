"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import TeamCard from "@/components/shared/TeamCard";

/* ======================
   TYPES
====================== */
interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  linkedin?: string;
  isFounder?: boolean;
}

/* ======================
   STATIC DATA
====================== */
const departments = [
  {
    title: "Frontend Development",
    desc: "Modern, responsive and high-performance user interfaces using React, Next.js and Tailwind CSS.",
  },
  {
    title: "Backend Engineering",
    desc: "Scalable APIs, databases, authentication, cloud architecture and SaaS development.",
  },
  {
    title: "AI & Automation",
    desc: "LLMs, AI chatbots, workflow automation, OCR, RAG and business AI solutions.",
  },
  {
    title: "UI / UX Design",
    desc: "Clean, intuitive and user-friendly product experiences with modern design principles.",
  },
  {
    title: "Cloud & DevOps",
    desc: "AWS, Docker, CI/CD pipelines, Linux servers and deployment automation.",
  },
  {
    title: "Digital Marketing",
    desc: "SEO, Google Business Profile, Meta Ads and complete social media management.",
  },
  {
    title: "Career Mentorship",
    desc: "Resume reviews, mock interviews, referrals and complete placement guidance.",
  },
  {
    title: "Support & Maintenance",
    desc: "Continuous improvements, monitoring and long-term technical support.",
  },
];

const values = [
  {
    title: "Innovation",
    desc: "We constantly explore new technologies to build better digital products.",
  },
  {
    title: "Quality",
    desc: "Every project is built with performance, security and scalability in mind.",
  },
  {
    title: "Transparency",
    desc: "Clear communication and honest collaboration throughout every project.",
  },
  {
    title: "Growth",
    desc: "Helping businesses grow while empowering students to build successful careers.",
  },
];

const stats = [
  {
    value: "200+",
    label: "Projects Delivered",
  },
  {
    value: "40+",
    label: "Business Clients",
  },
  {
    value: "5000+",
    label: "Students Mentored",
  },
  {
    value: "2500+",
    label: "Job Referrals",
  },
];

/* ======================
   COMPONENT
====================== */
export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ======================
     FETCH TEAM
  ====================== */
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get("/team");
        setTeam(res.data.data || []);
      } catch {
        setError("Failed to load team");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  /* ======================
     SPLIT FOUNDER / MEMBERS
  ====================== */
  const founder = team.find((m) => m.isFounder === true);
  const members = team.filter((m) => !m.isFounder);

  return (
    <main className="bg-[#0B1220] text-white">
      {/* Hero */}
      <section className="border-b border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <span className="text-xs uppercase tracking-[0.2em] text-[#5FB0FF]">
            Meet Our Team
          </span>
          <h1 className="mt-5 text-5xl font-bold leading-tight">
            Passionate people building
            <span className="text-[#5FB0FF]"> amazing technology.</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#8FA3C7]">
            Behind every successful product is a dedicated team of developers,
            designers, AI engineers and mentors committed to delivering
            exceptional experiences for businesses and students.
          </p>
        </div>
      </section>

      

      {/* Team Members (Dynamic from API) */}
      <section className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center text-4xl font-bold">
            Our Team
          </h2>

          {/* Loading */}
          {loading && (
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-3xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="mb-4 h-24 w-24 rounded-full bg-white/10" />
                  <div className="mb-2 h-4 w-3/4 rounded bg-white/10" />
                  <div className="h-3 w-1/2 rounded bg-white/10" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <p className="text-center text-red-400">{error}</p>
          )}

          {/* Members Grid */}
          {!loading && !error && members.length > 0 && (
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              {members.map((m) => (
                <TeamCard key={m._id} member={m} />
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && members.length === 0 && (
            <p className="text-center text-[#8FA3C7]">
              No team members found
            </p>
          )}
        </div>
      </section>

      {/* Departments */}
      <section className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center text-4xl font-bold">
            Our Expertise
          </h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {departments.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#8FA3C7]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center text-4xl font-bold">
            Our Core Values
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#8FA3C7]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center"
              >
                <h2 className="text-5xl font-bold text-[#5FB0FF]">
                  {item.value}
                </h2>
                <p className="mt-3 text-[#8FA3C7]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-4xl font-bold">Want to build with our team?</h2>
          <p className="mt-5 text-lg leading-8 text-[#8FA3C7]">
            Whether you&apos;re looking for a technology partner, AI solutions,
            mentorship or career guidance, we&apos;re here to help.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-[#2D82DC] px-8 py-3 font-semibold"
            >
              Start a Project
            </Link>
            <Link
              href="/careers"
              className="rounded-full border border-white/15 px-8 py-3 font-semibold"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}