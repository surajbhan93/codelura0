"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

type MenuItem = {
  name: string;
  slug: string;
  description: string;
  base?: string;
};

type MenuColumn = {
  heading: string;
  items: MenuItem[];
};

type MegaMenu = {
  key: string;
  label: string;
  columns: MenuColumn[];
};

type MenuKey = "services" | "industries" | "company";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null); // "services" | "industries" | "company" | null
  const [mobileSubOpen, setMobileSubOpen] = useState<MenuKey | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLHeadElement | null>(null);

  /* ---------------- DATA ---------------- */

  const servicesMenu: MegaMenu = {
    key: "services",
    label: "Services",
    columns: [
      {
        heading: "Core Services",
        items: [
          {
            name: "Website Development",
            slug: "website-development",
            description: "Business, corporate and ecommerce websites",
          },
          {
            name: "Software Development",
            slug: "software-development",
            description: "Custom software, CRM, ERP and automation",
          },
          {
            name: "Mobile App Development",
            slug: "mobile-app-development",
            description: "Android and iOS app solutions",
          },
        ],
      },
      {
        heading: "Growth Marketing",
        items: [
          {
            name: "Digital Marketing",
            slug: "digital-marketing",
            description: "SEO, ads, leads and social growth",
          },
          {
            name: "SEO Services",
            slug: "seo-services",
            description: "Ranking, visibility and organic leads",
          },
          {
            name: "Social Media Marketing",
            slug: "social-media-marketing",
            description: "Build and engage your audience",
          },
          {
            name: "Google Ads",
            slug: "google-ads",
            description: "PPC campaigns and lead generation",
          },
        ],
      },
      {
        heading: "Web Technology",
        items: [
          {
            name: "WordPress Development",
            slug: "wordpress-development",
            description: "Easy-to-manage websites and landing pages",
          },
          {
            name: "Laravel Development",
            slug: "laravel-development",
            description: "Secure portals and custom web apps",
          },
          {
            name: "React JS Development",
            slug: "react-js-development",
            description: "Modern dashboards and app interfaces",
          },
        ],
      },
      {
        heading: "Design & Branding",
        items: [
          {
            name: "UI/UX Design",
            slug: "ui-ux-design",
            description: "Interfaces people enjoy using",
          },
          {
            name: "Logo Design",
            slug: "logo-design",
            description: "Identity marks that stick",
          },
          {
            name: "Landing Page Design",
            slug: "landing-page-design",
            description: "High-converting campaign pages",
          },
          {
            name: "Product Design",
            slug: "product-design",
            description: "End-to-end digital product design",
          },
        ],
      },
      {
        heading: "AI & Automation",
        items: [
          {
            name: "AI Development",
            slug: "ai-development",
            description: "Custom AI solutions for business automation",
          },
          {
            name: "AI Chatbot Development",
            slug: "AI Chatbot Development",
            description: "Predictive analytics and intelligent systems",
          },
          {
            name: "OpenAI Integration",
            slug: "OpenAI Integration",
            description: "Chatbots, LLMs and AI assistants",
          },
          {
            name: "Computer Vision",
            slug: "computer-vision",
            description: "Image recognition and visual AI solutions",
          },
        ],
      },
      {
        heading: "Cloud & DevOps",
        items: [
          {
            name: "AWS Services",
            slug: "aws-services",
            description: "Cloud hosting and infrastructure management",
          },
          {
            name: "DevOps Consulting",
            slug: "devops-consulting",
            description: "CI/CD and deployment automation",
          },
          {
            name: "Docker & Kubernetes",
            slug: "docker-kubernetes",
            description: "Containerization and orchestration solutions",
          },
          {
            name: "Cloud Migration",
            slug: "cloud-migration",
            description: "Move applications securely to the cloud",
          },
        ],
      },
      {
        heading: "Business Software",
        items: [
          {
            name: "CRM Development",
            slug: "crm-development",
            description: "Customer management and sales automation",
          },
          {
            name: "ERP Development",
            slug: "erp-development",
            description: "Business operations and workflow management",
          },
          {
            name: "HRMS Software",
            slug: "hrms-software",
            description: "Employee and payroll management systems",
          },
          {
            name: "SaaS Development",
            slug: "saas-development",
            description: "Scalable cloud-based software products",
          },
        ],
      },
    ],
  };

  const industriesMenu: MegaMenu = {
    key: "industries",
    label: "Industries",
    columns: [
      {
        heading: "Healthcare",
        items: [
          {
            name: "Clinic Websites",
            slug: "clinic-websites",
            description: "Appointment-ready healthcare pages",
          },
          {
            name: "Doctor Websites",
            slug: "doctor-websites",
            description: "Doctor profile and treatment pages",
          },
          {
            name: "Clinic SEO",
            slug: "clinic-seo",
            description: "Local healthcare SEO and maps visibility",
          },
        ],
      },
      {
        heading: "Education",
        items: [
          {
            name: "Coaching Websites",
            slug: "coaching-websites",
            description: "Course pages and admission enquiries",
          },
          {
            name: "School Websites",
            slug: "school-websites",
            description: "Admission, notices and parent enquiries",
          },
          {
            name: "Online Exam Software",
            slug: "online-exam-software",
            description: "Question banks, timers and reports",
          },
        ],
      },
      {
        heading: "Commerce & Property",
        items: [
          {
            name: "Ecommerce",
            slug: "ecommerce",
            description: "Online stores and product catalogues",
          },
          {
            name: "Real Estate",
            slug: "real-estate",
            description: "Property websites and lead systems",
          },
          {
            name: "Travel & Business",
            slug: "travel-business",
            description: "Service websites and growth systems",
          },
        ],
      },
    ],
  };

  const companyMenu: MegaMenu = {
    key: "company",
    label: "Company",
    columns: [
      {
        heading: "Trust Proof",
        items: [
          {
            name: "About Us",
            slug: "about",
            description: "Company journey, mission and values",
            base: "/",
          },
          {
            name: "Our Team",
            slug: "team",
            description: "Developers, SEO, UI/UX and support",
            base: "/services/",
          },
          {
            name: "Testimonials",
            slug: "testimonial",
            description: "Client reviews and project feedback",
            base: "/",
          },
        ],
      },
      {
        heading: "Work Proof",
        items: [
          {
            name: "Portfolio",
            slug: "work",
            description: "Selected websites, apps and software work",
            base: "/",
          },
          {
            name: "Case Studies",
            slug: "case-studies",
            description: "Detailed project problems and solutions",
            base: "/services/",
          },
          {
            name: "Blog",
            slug: "blogs",
            description: "Website, software, SEO and marketing tips",
            base: "/",
          },
        ],
      },
      {
        heading: "Support",
        items: [
          {
            name: "Contact Us",
            slug: "Enquiries",
            description: "Talk to our team",
            base: "/services/",
          },
          {
            name: "Get Free Quote",
            slug: "get-quote",
            description: "Share your project requirement",
            base: "/services/",
          },
          {
            name: "Pricing",
            slug: "pricing",
            description: "Plans and project costing",
            base: "/services/",
          },
        ],
      },
    ],
  };

  const megaMenus: MegaMenu[] = [servicesMenu, industriesMenu, companyMenu];

  const simpleLinks = [{ name: "Home", href: "/services" }];

  /* ---------------- BEHAVIOR ---------------- */

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        navRef.current &&
        e.target instanceof Node &&
        !navRef.current.contains(e.target)
      ) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close any open mega menu on Escape for keyboard users
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenu(null);
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  function toggleMenu(key: MenuKey) {
    setOpenMenu((prev) => (prev === key ? null : key));
  }

  function basePath(item: MenuItem) {
    return item.base ? `${item.base}${item.slug}` : `/services/${item.slug}`;
  }

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.06),0_8px_24px_-12px_rgba(15,23,42,0.12)]"
          : "bg-white border-b border-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center text-[24px] lg:text-[26px] font-extrabold tracking-tight text-slate-900 transition-opacity hover:opacity-80"
          >
            Codelura
            <span className="text-blue-600">.</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-1">
            {simpleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-[15px] font-medium text-slate-700 rounded-lg transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                {link.name}
              </Link>
            ))}

            {megaMenus.map((menu) => {
              const isWide = menu.columns.length > 3;
              return (
                <div key={menu.key} className="relative">
                  <button
                    onClick={() => toggleMenu(menu.key as MenuKey)}
                    className={`flex items-center gap-1 px-4 py-2 text-[15px] font-medium rounded-lg transition-colors ${
                      openMenu === menu.key
                        ? "bg-slate-50 text-slate-900"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                    aria-expanded={openMenu === menu.key}
                    aria-haspopup="true"
                  >
                    {menu.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        openMenu === menu.key ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`absolute top-full mt-3 origin-top rounded-2xl border border-slate-100 bg-white shadow-[0_24px_70px_-15px_rgba(15,23,42,0.2)] transition-all duration-200 ${
                      isWide
                        ? "left-1/2 w-[min(92vw,860px)] -translate-x-[42%] p-6"
                        : "left-1/2 w-[420px] -translate-x-1/2 p-5"
                    } ${
                      openMenu === menu.key
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2 pointer-events-none"
                    }`}
                    role="menu"
                  >
                    <div
                      className={`grid gap-x-6 gap-y-6 ${
                        isWide ? "grid-cols-4" : "grid-cols-3"
                      }`}
                    >
                      {menu.columns.map((col) => (
                        <div key={col.heading} className="min-w-0">
                          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-blue-600 whitespace-nowrap">
                            {col.heading}
                          </p>
                          <ul className="space-y-2.5">
                            {col.items.map((item) => (
                              <li key={item.slug}>
                                <Link
                                  href={basePath(item)}
                                  onClick={() => setOpenMenu(null)}
                                  className="block rounded-lg -mx-2 px-2 py-1.5 transition-colors hover:bg-slate-50"
                                >
                                  <span className="block text-sm font-semibold text-slate-900 leading-snug">
                                    {item.name}
                                  </span>
                                  <span className="block text-[12.5px] text-slate-500 leading-snug">
                                    {item.description}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {menu.key === "services" && (
                      <div className="mt-6 border-t border-slate-100 pt-4 text-center">
                        <Link
                          href="/services/getallservice"
                          onClick={() => setOpenMenu(null)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
                        >
                          View All Services (100+ Services)
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="ml-3 flex items-center gap-2.5">
              <Link
                href="https://wa.me/919336289192"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500 px-4 py-2.5 text-[15px] font-semibold text-emerald-600 transition-colors hover:bg-emerald-50"
              >
                WhatsApp
              </Link>
              <Link
  href="https://calendly.com/codelura/free-project-consultation-codelura"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 text-[15px] font-semibold text-blue-600 transition-all hover:bg-blue-50"
>
  📅 Book Free Consultation
</Link>
            </div>
          </nav>

          {/* Mobile Button */}
          <button
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-50"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-x-0 top-16 bottom-0 bg-white transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto px-4 py-4">
          {simpleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-3 text-base font-medium text-slate-800 hover:bg-slate-50"
            >
              {link.name}
            </Link>
          ))}

          {megaMenus.map((menu) => (
            <div key={menu.key}>
              <button
                onClick={() =>
                  setMobileSubOpen((prev) =>
                    prev === menu.key ? null : (menu.key as MenuKey)
                  )
                }
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-slate-800 hover:bg-slate-50"
                aria-expanded={mobileSubOpen === menu.key}
              >
                {menu.label}
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${
                    mobileSubOpen === menu.key ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  mobileSubOpen === menu.key ? "max-h-[2200px]" : "max-h-0"
                }`}
              >
                <div className="space-y-4 py-2 pl-3">
                  {menu.columns.map((col) => (
                    <div key={col.heading}>
                      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-600">
                        {col.heading}
                      </p>
                      <div className="space-y-0.5">
                        {col.items.map((item) => (
                          <Link
                            key={item.slug}
                            href={basePath(item)}
                            onClick={() => {
                              setMobileOpen(false);
                              setMobileSubOpen(null);
                            }}
                            className="block rounded-lg px-2 py-2 hover:bg-slate-50"
                          >
                            <span className="block text-sm font-medium text-slate-800">
                              {item.name}
                            </span>
                            <span className="block text-xs text-slate-500">
                              {item.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}

                  {menu.key === "services" && (
                    <div className="pt-1">
                      <Link
                        href="/services/getallservices"
                        onClick={() => {
                          setMobileOpen(false);
                          setMobileSubOpen(null);
                        }}
                        className="block rounded-lg bg-blue-600 px-3 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        View All Services (100+ Services)
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4 space-y-2">
            <Link
              href="https://wa.me/919336289192"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg border border-emerald-500 px-3 py-3 text-center text-base font-semibold text-emerald-600 hover:bg-emerald-50"
            >
              WhatsApp
            </Link>
           <Link
  href="https://calendly.com/surajbhan/free-project-consultation-codelura"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 text-[15px] font-semibold text-blue-600 transition-all hover:bg-blue-50"
>
  📅 Book Free Consultation
</Link>
          </div>
        </div>
      </div>
    </header>
  );
}