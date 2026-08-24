import Link from "next/link";
import Image from "next/image";
import { Program } from "@/components/admin/program";

export default function ProgramCard({ program }: { program: Program }) {
  return (
    <Link
      href={`/career/learning/programs/${program.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative h-44 w-full bg-slate-100">
        {program.thumbnail || program.image ? (
          <Image
            src={program.thumbnail || program.image || ""}
            alt={program.name}
            fill
            className="object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-2xl font-bold text-white"
            style={{ backgroundColor: program.color || "#4F46E5" }}
          >
            {program.name.charAt(0)}
          </div>
        )}

        {program.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
            {program.category}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {program.level}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-700">
          {program.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
          {program.shortDescription}
        </p>

        {program.careerTrack && (
          <p className="mt-2 text-xs text-slate-400">
            Part of:{" "}
            <span className="font-medium text-slate-600">
              {typeof program.careerTrack === "object" ? program.careerTrack.title : "Career Track"}
            </span>
          </p>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            {program.discountPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900">
                  ₹{program.discountPrice}
                </span>
                <span className="text-sm text-slate-400 line-through">
                  ₹{program.price}
                </span>
              </div>
            ) : program.price ? (
              <span className="text-lg font-bold text-slate-900">
                ₹{program.price}
              </span>
            ) : (
              <span className="text-sm font-medium text-emerald-600">
                Free
              </span>
            )}
          </div>

          {program.rating ? (
            <div className="flex items-center gap-1 text-sm text-amber-500">
              ⭐ <span className="text-slate-700">{program.rating}</span>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}