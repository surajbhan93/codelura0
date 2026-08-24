import { motion } from "framer-motion";

/* ======================
   TYPES
====================== */
interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  linkedin?: string;
  isFounder?: boolean;
}

/* ======================
   COMPONENT
====================== */
export default function TeamCard({
  member,
}: {
  member?: TeamMember;
}) {
  // 🔒 SAFETY GUARD
  if (!member) return null;

  const isFounder = member.isFounder ?? false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: isFounder ? 1.04 : 1.02 }}
      className={`
        relative overflow-hidden rounded-3xl
        ${isFounder ? "p-[2px]" : "p-[1px]"}
        bg-gradient-to-r from-red-500 via-rose-500 to-orange-400
        animate-gradient
      `}
    >
      {/* Glass Card */}
      <div
        className={`
          relative rounded-3xl h-full
          bg-white/70 dark:bg-gray-900/70
          backdrop-blur-xl
          border border-white/40 dark:border-white/10
          shadow-xl
          ${isFounder ? "p-8" : "p-6"}
        `}
      >
        {/* Founder Badge */}
        {isFounder && (
          <span
            className="
              absolute -top-3 left-6
              px-4 py-1 text-xs font-bold
              rounded-full
              bg-gradient-to-r from-red-500 to-orange-400
              text-white shadow-lg
            "
          >
            Founder
          </span>
        )}

        {/* Avatar */}
        <img
          src={member.image || "/avatar-placeholder.png"}
          alt={member.name}
          className={`
            rounded-full object-cover
            border-4 border-white dark:border-gray-800
            shadow-xl
            ${isFounder ? "h-28 w-28" : "h-24 w-24"}
          `}
        />

        {/* Name */}
        <h4 className="mt-4 text-xl font-extrabold text-gray-900 dark:text-white">
          {member.name}
        </h4>

        {/* Role */}
        <span
          className="
            inline-block mt-2 px-4 py-1 text-xs font-semibold
            rounded-full
            bg-red-100 text-red-700
            dark:bg-red-500/20 dark:text-red-400
          "
        >
          {member.role}
        </span>

        {/* Bio */}
        {member.bio && (
          <p className="mt-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {member.bio}
          </p>
        )}

        {/* LinkedIn */}
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            className="
              inline-flex items-center gap-2 mt-6
              text-sm font-semibold text-red-600
              hover:text-red-800 dark:hover:text-red-400
              transition
            "
          >
            View LinkedIn →
          </a>
        )}
      </div>
    </motion.div>
  );
}
