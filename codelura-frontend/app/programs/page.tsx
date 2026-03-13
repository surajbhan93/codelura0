"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Program {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  category: string;
  image?: string;
  points: string[];
}

export default function CareerProgramPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const { data } = await api.get("/program");
        if (data.success) {
          setPrograms(data.data);
        }
      } catch (error) {
        console.error("Program fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <main className="bg-[#0B0F19] text-white min-h-screen">

      {/* HERO SECTION */}
      <section className="py-24 px-6 text-center max-w-6xl mx-auto">
        <span className="inline-block px-4 py-1 text-xs tracking-widest border border-orange-500 text-orange-400 rounded-full mb-6">
          CODELURA CAREER ACCELERATOR
        </span>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Build Real Skills. <span className="text-orange-500">Launch Real Careers.</span>
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg">
          A structured, mentorship-driven program designed to transform learners into
          industry-ready professionals.
        </p>
      </section>

      {/* PROGRAM TRACKS */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Choose Your <span className="text-orange-500">Career Track</span>
        </h2>

        {loading ? (
          <div className="text-center text-gray-400">
            Loading programs...
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program) => (
              <div
                key={program._id}
                className="bg-[#121826] rounded-2xl border border-gray-800 hover:border-orange-500 transition overflow-hidden"
              >

                {/* IMAGE */}
                {program.image && (
                  <div className="relative h-48 w-full">
                    <img
                      src={program.image}
                      alt={program.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                  </div>
                )}

                {/* CONTENT */}
                <div className="p-8">
                  <h3 className="text-xl font-semibold mb-4">
                    {program.name}
                  </h3>

                  <p className="text-gray-400 mb-6">
                    {program.shortDescription}
                  </p>

                  {/* Points */}
                  <ul className="text-gray-400 space-y-2 mb-6">
                    {program.points?.map((point, index) => (
                      <li key={index}>• {point}</li>
                    ))}
                  </ul>

                  {/* Redirect */}
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}/program/${program.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 font-medium hover:text-orange-500 transition"
                  >
                    Access Program →
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 bg-[#0F1523]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            How The Program Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-gray-400">
            <div>
              <h4 className="text-orange-500 font-semibold mb-2">Step 1</h4>
              <p>Structured Learning Roadmap</p>
            </div>
            <div>
              <h4 className="text-orange-500 font-semibold mb-2">Step 2</h4>
              <p>Build Real Production Projects</p>
            </div>
            <div>
              <h4 className="text-orange-500 font-semibold mb-2">Step 3</h4>
              <p>Hackathons & Reviews</p>
            </div>
            <div>
              <h4 className="text-orange-500 font-semibold mb-2">Step 4</h4>
              <p>Portfolio + Career Launch</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}