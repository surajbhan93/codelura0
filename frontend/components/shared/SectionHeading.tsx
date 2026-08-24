interface Props {
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ title, subtitle }: Props) {
  return (
    <div className="mb-12 text-center">
      <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-gray-600">{subtitle}</p>
      )}
    </div>
  );
}
