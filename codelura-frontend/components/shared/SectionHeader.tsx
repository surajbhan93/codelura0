import { motion } from "framer-motion";

interface Props {
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ title, subtitle }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center max-w-2xl mx-auto mb-12"
    >
      <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-gray-600 text-lg">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
