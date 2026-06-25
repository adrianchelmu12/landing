const stats = [
  { value: "500+", label: "Agenții partenere" },
  { value: "25.000+", label: "Proprietăți listate" },
  { value: "98%", label: "Rata de satisfacție" },
  { value: "24/7", label: "Suport disponibil" },
];

export default function Stats() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{s.value}</div>
            <div className="text-sm text-white/70">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
