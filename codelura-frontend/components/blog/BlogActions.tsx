"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaRegBookmark,
  FaBookmark,
  FaCopy,
  FaHeart,
  FaRegHeart
} from "react-icons/fa";
import { MdEmail, MdShare } from "react-icons/md";

interface Blog {
  _id: string;
  slug: string;
  title: string;
  content: string;
  likesCount?: number;
}

interface BlogActionsProps {
  blog: Blog;
}

export default function BlogActions({ blog }: BlogActionsProps) {
  const [likesCount, setLikesCount] = useState(blog.likesCount || 0);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const blogUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/${blog.slug}`
      : "";

  const handleLike = async () => {
    try {
      setLoading(true);
      setLiked(!liked);

      const res = await api.post(
        `/blogs/${blog._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setLikesCount(res.data.likesCount);

    } catch (err) {
      setLiked(!liked);
      toast.error("Login required");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(blogUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      id: "facebook",
      icon: FaFacebookF,
      url: `https://www.facebook.com/sharer/sharer.php?u=${blogUrl}`,
      label: "Facebook",
      bgColor: "bg-blue-600",
      hoverColor: "hover:bg-blue-700"
    },
    {
      id: "twitter",
      icon: FaTwitter,
      url: `https://twitter.com/intent/tweet?url=${blogUrl}`,
      label: "Twitter",
      bgColor: "bg-sky-500",
      hoverColor: "hover:bg-sky-600"
    },
    {
      id: "linkedin",
      icon: FaLinkedinIn,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${blogUrl}`,
      label: "LinkedIn",
      bgColor: "bg-blue-700",
      hoverColor: "hover:bg-blue-800"
    },
    {
      id: "whatsapp",
      icon: FaWhatsapp,
      url: `https://wa.me/?text=${blogUrl}`,
      label: "WhatsApp",
      bgColor: "bg-green-500",
      hoverColor: "hover:bg-green-600"
    },
    {
      id: "email",
      icon: MdEmail,
      url: `mailto:?subject=${blog.title}&body=${blogUrl}`,
      label: "Email",
      bgColor: "bg-slate-600",
      hoverColor: "hover:bg-slate-700"
    }
  ];

  return (
    <div className="mt-16 mb-12">
      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-12"></div>

      <div className="max-w-4xl mx-auto space-y-10">

        {/* ENGAGEMENT SECTION */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-gradient-to-b from-rose-500 to-pink-500 rounded-full"></div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">
              Show Your Support
            </h3>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* LIKE BUTTON */}
            <button
              onClick={handleLike}
              disabled={loading}
              className={`
                group relative inline-flex items-center gap-3 px-8 py-4
                rounded-2xl font-semibold text-base transition-all duration-500
                shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                overflow-hidden
                ${liked
                  ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white"
                  : "bg-white text-slate-700 border-2 border-slate-200 hover:border-rose-300"
                }
              `}
            >
              {!liked && (
                <span className="absolute inset-0 bg-gradient-to-r from-rose-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              )}
              
              <span className="relative z-10 inline-flex items-center gap-3">
                {liked ? (
                  <FaHeart className="w-5 h-5 animate-pulse" />
                ) : (
                  <FaRegHeart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                )}
                <span className="font-bold">
                  {liked ? "Liked" : "Like this article"}
                </span>
                <span className={`
                  px-2.5 py-0.5 rounded-full text-sm font-bold
                  ${liked 
                    ? "bg-white/20 text-white" 
                    : "bg-slate-100 text-slate-600 group-hover:bg-rose-100 group-hover:text-rose-600"
                  }
                  transition-colors duration-300
                `}>
                  {likesCount}
                </span>
              </span>
            </button>

            {/* BOOKMARK BUTTON */}
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`
                group relative inline-flex items-center gap-3 px-8 py-4
                rounded-2xl font-semibold text-base transition-all duration-500
                shadow-lg hover:shadow-xl active:scale-95
                overflow-hidden
                ${bookmarked
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                  : "bg-white text-slate-700 border-2 border-slate-200 hover:border-amber-300"
                }
              `}
            >
              {!bookmarked && (
                <span className="absolute inset-0 bg-gradient-to-r from-amber-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              )}
              
              <span className="relative z-10 inline-flex items-center gap-3">
                {bookmarked ? (
                  <FaBookmark className="w-5 h-5 animate-pulse" />
                ) : (
                  <FaRegBookmark className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                )}
                <span className="font-bold">
                  {bookmarked ? "Saved" : "Save for later"}
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* SHARE SECTION */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">
              Share This Article
            </h3>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {shareLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col items-center justify-center gap-3 p-5 bg-white rounded-2xl border-2 border-slate-100 hover:border-transparent transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  title={link.label}
                >
                  <div className={`
                    relative w-12 h-12 rounded-xl ${link.bgColor} 
                    flex items-center justify-center
                    ${link.hoverColor}
                    transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
                    shadow-lg
                  `}>
                    <IconComponent className="w-6 h-6 text-white" />
                    
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                  </div>
                  
                  <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-800 transition-colors text-center">
                    {link.label}
                  </span>
                </a>
              );
            })}

            {/* COPY LINK BUTTON */}
            <button
              onClick={copyLink}
              className={`
                group relative flex flex-col items-center justify-center gap-3 p-5 
                rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                ${copied
                  ? "bg-gradient-to-br from-green-500 to-emerald-600 border-transparent"
                  : "bg-white border-slate-100 hover:border-transparent"
                }
              `}
              title="Copy link"
            >
              <div className={`
                relative w-12 h-12 rounded-xl flex items-center justify-center
                transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
                shadow-lg
                ${copied 
                  ? "bg-white/20" 
                  : "bg-gradient-to-br from-slate-600 to-slate-700 group-hover:from-slate-700 group-hover:to-slate-800"
                }
              `}>
                <FaCopy className="w-6 h-6 text-white" />
                
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
              </div>
              
              <span className={`text-xs font-semibold transition-colors text-center ${
                copied ? "text-white" : "text-slate-600 group-hover:text-slate-800"
              }`}>
                {copied ? "Copied!" : "Copy"}
              </span>
            </button>
          </div>

          <div className="flex items-start gap-3 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
            <MdShare className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-slate-600 leading-relaxed">
              Help us reach more readers by sharing this article with your network. 
              <span className="font-semibold text-slate-700"> Every share matters!</span>
            </p>
          </div>
        </div>

      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mt-12"></div>
    </div>
  );
}