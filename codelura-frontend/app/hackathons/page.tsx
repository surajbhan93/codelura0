import HackathonHero from "@/components/hackathon/HackathonHero";
import HackathonTabs from "@/components/hackathon/HackathonTabs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hackathons & Coding Competitions | Codelura",
  description:
    "Explore and participate in upcoming, ongoing, and completed hackathons at Codelura. Build real-world AI projects, win cash prizes, and earn internship opportunities.",
};

export default function HackathonsPage() {
  return (
    <main className="min-h-screen bg-[#060713] text-white flex flex-col pt-20 md:pt-0 font-sans selection:bg-violet-600 selection:text-white">
      <HackathonHero />

      <div className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        <HackathonTabs />
      </div>
    </main>
  );
}