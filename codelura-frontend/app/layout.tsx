import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CursorGlow from "@/components/ui/CursorGlow";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Providers } from "./providers";
import Script from "next/script";
import LayoutWrapper from "@/components/LayoutWrapper";
export const metadata = {
  metadataBase: new URL("https://codelura.com"),
  title: "Codelura | Startup Development, Coding Skills & Tech Career Guidance",
  description: "Codelura helps developers learn coding, build startups,Notes and grow their tech careers with practical courses, projects, and job guidance.",

 keywords: [
  "Codelura",
  "Codelura startup platform",
  "startup development",
  "startup guidance India",
  "coding courses",
  "web development course",
  "mern stack development",
  "software development training",
  "tech career growth",
  "learn programming online",
  "coding mentorship",
  "developer career roadmap",
  "programming tutorials",
  "startup learning platform",
  "online tech education",
  "developer community India",
  "job guidance for developers",
  "learn coding from scratch",
  "web development mentorship"
],

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },
   manifest: "/site.webmanifest",

  openGraph: {
  title: "Codelura | Learn Coding & Build Startups",
  description:
    "Learn coding, build real startup projects, and grow your tech career with Codelura.",
  url: "https://codelura.com",
  siteName: "Codelura",
  locale: "en_US",
  type: "website",
  images: [
    {
      url: "https://codelura.com/og-image.png",
      width: 1200,
      height: 630,
      alt: "Codelura Platform",
    },
  ],
},
    twitter: {
    card: "summary_large_image",
    title: "Codelura",
    description: "Startup Development | Career Growth | Job Guidance",
    images: ["/og-image.png"]
  },
  alternates: {
  canonical: "https://codelura.com",
},
robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
},
 authors: [{ name: "Suraj Bhan", url: "https://codelura.com" }],
creator: "Suraj Bhan",
publisher: "Codelura",
category: "technology",
applicationName: "Codelura",
verification: {
  google: "OjEl21k_fS4xc-KLvDTIGTzwKGT4owc2huab4B6tFec",
},
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      {/* <body className="bg-white text-black"> */}
      <body className="bg-white text-black transition-colors duration-300 dark:bg-[#09090B] dark:text-white">

        {/* Google Analytics */}
        <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />

            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>

{/* microsoft clarity  */}
                <Script id="clarity" strategy="afterInteractive">
                {`
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "vujs54pix1");
                `}
                </Script>

                   {/* Schema JSON-LD */}
       {/* Schema JSON-LD */}
      <Script id="organization-schema" type="application/ld+json">
            {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Codelura",
            url: "https://codelura.com",
            logo: "https://codelura.com/logo.png",
            description:
              "Codelura helps developers learn coding, build startups, and grow their tech careers.",
            founder: {
              "@type": "Person",
              name: "Suraj Bhan"
            },
          sameAs: [
            "https://www.linkedin.com/company/codelura",
            "https://github.com/surajbhan93",
            "https://www.instagram.com/codelura/"
          ]
          })}
          </Script>

            <Script id="website-schema" type="application/ld+json">
            {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Codelura",
            url: "https://codelura.com",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://codelura.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
            })}
            </Script>

         <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>

         
         <CursorGlow />
        <LayoutWrapper>
        <Providers>
            {children}
        </Providers>
      </LayoutWrapper>
         <Toaster position="top-right" reverseOrder={false} />
        <Footer />
        </GoogleOAuthProvider>

        {/* Razorpay Script */}
       <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="afterInteractive"
          />
      </body>

          

    </html>
  );
}
