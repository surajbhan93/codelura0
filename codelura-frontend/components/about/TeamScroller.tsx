"use client";

import Image from "next/image";

const teamRoles = [
  { title: "Frontend & UI/UX Designer", img: "/team/frontend.jpg" },
  { title: "Backend Developer", img: "/team/backend.jpg" },
  { title: "Team head & backend doveloper", img: "/team/ceo.jpg" },
  { title: "HR Manager", img: "/team/hr.png" },
  { title: "ML Developer", img: "/team/ML.jpg" },
  { title: "Backend Developer", img: "/team/ui.png" },
  { title: "Marketing Head", img: "/team/marketing.png" },
  { title: "Database Engineer", img: "/team/database.png" },
  { title: "Social Media Handler", img: "/team/social.jpeg" },
];

export function TeamScroller() {
  return (
    <section className="pt-24 pb-16 overflow-hidden">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-semibold">
          Our <span className="text-primary">Team</span>
        </h1>
        <p className="text-neutral-400 mt-2">
          People behind Codelura vision & execution
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

        <div
          className="flex gap-10 w-max"
          style={{ animation: "scrollLeft 30s linear infinite" }}
        >
          {[...teamRoles, ...teamRoles].map((role, i) => (
            <div key={i} className="flex flex-col items-center min-w-[160px]">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 p-[3px]">
                <div className="w-full h-full bg-[#111] rounded-full overflow-hidden">
                  <Image
                    src={role.img}
                    alt={role.title}
                    width={120}
                    height={120}
                    className="rounded-full object-cover w-full h-full"
                  />
                </div>
              </div>
              <h3 className="mt-4 text-sm font-semibold text-center">{role.title}</h3>
              <p className="text-xs text-neutral-400">Explore Role</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}