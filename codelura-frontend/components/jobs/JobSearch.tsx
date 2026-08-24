"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const TYPES = [
  { value: "",           label: "All Types" },
  { value: "internship", label: "Internship" },
  { value: "full-time",  label: "Full-Time"  },
  { value: "part-time",  label: "Part-Time"  },
  { value: "contract",   label: "Contract"   },
];

export default function JobSearch() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [query,    setQuery]    = useState(searchParams.get("q")    ?? "");
  const [type,     setType]     = useState(searchParams.get("type") ?? "");
  const [focused,  setFocused]  = useState(false);
//   const debounceRef = useRef<ReturnType<typeof setTimeout>>();
const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Push search params to URL so the server can re-filter */
 useEffect(() => {
  if (debounceRef.current) {
    clearTimeout(debounceRef.current);
  }

  debounceRef.current = setTimeout(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (type) params.set("type", type);
    router.push(`?${params.toString()}`, { scroll: false });
  }, 350);

  return () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  };
}, [query, type]);
  return (
    <>
      <style>{`
        .js-root {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* ── Search bar ── */
        .js-bar {
          display: flex;
          align-items: center;
          gap: 0;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 12px;
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .js-bar.focused {
          border-color: #e8a87c;
          box-shadow: 0 0 0 3px rgba(232,168,124,0.18);
        }
        .js-icon {
          padding: 0 14px;
          color: #a89d8e;
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
        .js-icon svg { width: 16px; height: 16px; }

        .js-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #f9f5ef;
          padding: 13px 0;
          caret-color: #e8a87c;
        }
        .js-input::placeholder { color: #6b5f50; }

        .js-clear {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0 14px;
          color: #6b5f50;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }
        .js-clear:hover { color: #e8a87c; }
        .js-clear svg { width: 14px; height: 14px; }

        /* ── Filter pills ── */
        .js-filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .js-pill {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          padding: 5px 14px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: #a89d8e;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s, color 0.18s;
          white-space: nowrap;
        }
        .js-pill:hover {
          border-color: #e8a87c;
          color: #e8a87c;
        }
        .js-pill.active {
          background: #c8410a;
          border-color: #c8410a;
          color: #fff;
        }

        /* ── Active indicator text ── */
        .js-active-info {
          font-size: 12px;
          color: #6b5f50;
          padding-left: 2px;
        }
        .js-active-info strong { color: #e8a87c; font-weight: 600; }
      `}</style>

      <div className="js-root">

        {/* Search input */}
        <div className={`js-bar${focused ? " focused" : ""}`}>
          <span className="js-icon">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="6.5" cy="6.5" r="4.5" />
              <path d="M10 10l3.5 3.5" />
            </svg>
          </span>
          <input
            className="js-input"
            type="text"
            placeholder="Search jobs, companies, skills…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {query && (
            <button className="js-clear" onClick={() => setQuery("")} aria-label="Clear search">
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M2 2l10 10M12 2L2 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Type filter pills */}
        <div className="js-filters">
          {TYPES.map((t) => (
            <button
              key={t.value}
              className={`js-pill${type === t.value ? " active" : ""}`}
              onClick={() => setType(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Active filter hint */}
        {(query || type) && (
          <p className="js-active-info">
            Showing results for
          {query && <> <strong>&quot;{query}&quot;</strong></>}
            {query && type && " in"}
            {type && <> <strong>{TYPES.find(t => t.value === type)?.label}</strong></>}
          </p>
        )}
      </div>
    </>
  );
}