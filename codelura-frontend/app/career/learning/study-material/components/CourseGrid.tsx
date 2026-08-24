"use client";

// import { useState, useMemo, useCallback, useDeferredValue } from "react";
import {
  useState,
  useMemo,
  useCallback,
  useDeferredValue,
  useRef,
} from "react";
import { Course, FilterType, SortType } from "../types";
import { SearchBar } from "./SearchBar";
import { Filters } from "./Filters";
import { CourseCard } from "./CourseCard";
import { Pagination } from "./Pagination";

const ITEMS_PER_PAGE = 6;

export function CourseGrid({ initialCourses }: { initialCourses: Course[] }) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("popular");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const coursesRef = useRef<HTMLDivElement>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());
// const [page, setPage] = useState(1);
  // Non-blocking non-thrashing search input optimization
  const deferredSearch = useDeferredValue(search);

  const toggleSave = useCallback((id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleFilterChange = useCallback((f: FilterType) => {
    setFilter(f);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((s: SortType) => {
    setSort(s);
  }, []);

  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const filteredCourses = useMemo(() => {
    let list = initialCourses;

    if (filter === "free") {
      list = list.filter((c) => !c.isPaid);
    } else if (filter === "paid") {
      list = list.filter((c) => c.isPaid);
    }

    const query = deferredSearch.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.category.toLowerCase().includes(query)
      );
    }

    if (sort === "newest") {
      return [...list].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return list;
  }, [initialCourses, filter, deferredSearch, sort]);

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE) || 1;
  const start = (page - 1) * ITEMS_PER_PAGE;
  const visibleCourses = useMemo(
    () => filteredCourses.slice(start, start + ITEMS_PER_PAGE),
    [filteredCourses, start]
  );

  const handlePageChange = useCallback((newPage: number) => {
  setPage(newPage);

  requestAnimationFrame(() => {
    coursesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}, []);

  return (
    <>
      <SearchBar value={search} onChange={handleSearchChange} />
      <Filters
        filter={filter}
        sort={sort}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      {visibleCourses.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm max-w-lg mx-auto">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-slate-900 font-bold text-xl">No study materials found</h3>
          <p className="text-slate-500 text-sm mt-2">Try clearing filters or searching for another keyword.</p>
        </div>
      ) : (
        <>
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> */}
          <div ref={coursesRef}>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                isSaved={saved.has(course._id)}
                onToggleSave={toggleSave}
              />
            ))}
            
          </div>
          </div>
          {/* <Pagination page={page} totalPages={totalPages} onPageChange={setPage} /> */}
          <Pagination
  page={page}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>
        </>
      )}
    </>
  );
}