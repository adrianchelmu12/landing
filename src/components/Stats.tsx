const steps = [
  {
    step: "01",
    title: "Creeaza cont gratuit",
    description:
      "Inregistreaza-te in 30 de secunde. Fara card de credit, trial complet 14 zile.",
  },
  {
    step: "02",
    title: "Adauga proprietatile",
    description:
      "Introdu detaliile proprietatilor si pozele. Interfata intuitiva te ghideaza pas cu pas.",
  },
  {
    step: "03",
    title: "Gestioneaza si creste",
    description:
      "Programeaza vizionari, urmareste clientii si inchide mai multe vanzari.",
  },
];

export default function Stats() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
            Cum functioneaza
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Pregatit in{" "}
            <span className="text-primary">mai putin de 3 minute</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={s.step} className="relative text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <span className="text-lg font-bold text-primary">{s.step}</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted leading-relaxed max-w-xs mx-auto">
                {s.description}
              </p>
              {i < 2 && (
                <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/30 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
