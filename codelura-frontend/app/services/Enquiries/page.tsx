import { Metadata } from "next";
import { Suspense } from "react";
import ContactForm from "./ContactForm";

// Metadata for SEO
export const metadata: Metadata = {
  title: "Contact Us | Codelura - Let's Build Something Great",
  description: "Get in touch with Codelura for web development, mobile apps, UI/UX design, and digital product development. Fast turnaround, transparent process, and post-launch support.",
  keywords: "contact us, web development, mobile app development, UI/UX design, digital product development, Codelura contact, software development agency",
  openGraph: {
    title: "Contact Codelura - Let's Build Something Great",
    description: "Share your idea with us and we'll turn it into reality. Web apps, mobile apps, e-commerce, and more.",
    type: "website",
    url: "https://codelura.com/contact",
    siteName: "Codelura",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://codelura.com/contact",
  },
};

export default function Page() {
  return (
    <Suspense fallback={<ContactPageSkeleton />}>
      <ContactForm />
    </Suspense>
  );
}

// Skeleton loading component
function ContactPageSkeleton() {
  return (
    <main className="min-h-screen bg-[#080B14] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-96 bg-white/5 rounded-2xl animate-pulse" />
          <div className="h-96 bg-white/5 rounded-2xl animate-pulse" />
        </div>
      </div>
    </main>
  );
}