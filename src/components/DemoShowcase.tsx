"use client";

import { motion } from "framer-motion";

const item = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function DemoShowcase() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-x-clip">
      <div className="absolute inset-0 bg-white" />
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-blue-400/[0.12] rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/[0.1] rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          variants={item}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
            Platforma in actiune
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Simplu de folosit,{" "}
            <span className="text-primary">construit pentru performanță</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="rounded-2xl border border-gray-200 shadow-2xl shadow-black/[0.06] overflow-hidden bg-white p-2">
              <img
                src="/adaugaproprietate.png"
                alt="Adauga proprietate in CRM"
                className="rounded-xl w-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          >
            <div className="flex items-start gap-3 mb-4">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
                </svg>
              </span>
              <div>
                <h3 className="text-xl font-bold text-foreground">Adauga proprietati rapid</h3>
                <p className="mt-2 text-muted leading-relaxed">
                  Introdu detaliile proprietatii in cateva secunde: tip, suprafata, pret, locatie si poze.
                  Interfata intuitiva te ghideaza pas cu pas, fara campuri inutile.
                </p>
              </div>
            </div>
            <ul className="space-y-2 ml-11">
              {["Campuri personalizabile", "Upload poze prin drag & drop", "Status automat: disponibil / vandut"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
          <motion.div
            className="order-2 lg:order-1"
            initial={{ x: -60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex items-start gap-3 mb-4">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </span>
              <div>
                <h3 className="text-xl font-bold text-foreground">Gestioneaza-ti clientii</h3>
                <p className="mt-2 text-muted leading-relaxed">
                  Pastreaza toate informatiile clientilor intr-un singur loc. Istoric complet, preferinte,
                  programari si comunicatii — totul la un click distanta.
                </p>
              </div>
            </div>
            <ul className="space-y-2 ml-11">
              {["Profil detaliat per client", "Istoric vizionari si oferte", "Notificari automate pentru follow-up"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="order-1 lg:order-2"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          >
            <div className="rounded-2xl border border-gray-200 shadow-2xl shadow-black/[0.06] overflow-hidden bg-white p-2">
              <img
                src="/clienti.png"
                alt="Lista de clienti in CRM"
                className="rounded-xl w-full"
              />
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="rounded-2xl border border-gray-200 shadow-2xl shadow-black/[0.06] overflow-hidden bg-white p-2">
              <img
                src="/programari.png"
                alt="Calendar programari in CRM"
                className="rounded-xl w-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          >
            <div className="flex items-start gap-3 mb-4">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
              </span>
              <div>
                <h3 className="text-xl font-bold text-foreground">Programeaza vizionari usor</h3>
                <p className="mt-2 text-muted leading-relaxed">
                  Calendar integrat pentru programarea vizionarilor. Clientii primesc invitatii automate,
                  iar tu vezi tot programul zilei dintr-o singura privire.
                </p>
              </div>
            </div>
            <ul className="space-y-2 ml-11">
              {["Calendar sincronizat cu telefonul", "Confirmare automata prin email", "Notificari in timp real"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
          <motion.div
            className="order-2 lg:order-1"
            initial={{ x: -60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex items-start gap-3 mb-4">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </span>
              <div>
                <h3 className="text-xl font-bold text-foreground">Exploreaza pe harta</h3>
                <p className="mt-2 text-muted leading-relaxed">
                  Vizualizeaza toate proprietatile pe harta interactiva. Filtreaza dupa zona, pret sau tip
                  si gaseste exact ce cauta clientul tau.
                </p>
              </div>
            </div>
            <ul className="space-y-2 ml-11">
              {["Harta interactiva cu filtre avansate", "Cautare dupa cartier sau strada", "Vezi preturile direct pe harta"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="order-1 lg:order-2"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          >
            <div className="rounded-2xl border border-gray-200 shadow-2xl shadow-black/[0.06] overflow-hidden bg-white p-2">
              <img
                src="/harta.png"
                alt="Harta proprietati imobiliare"
                className="rounded-xl w-full"
              />
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="rounded-2xl border border-gray-200 shadow-2xl shadow-black/[0.06] overflow-hidden bg-white p-2">
              <img
                src="/documente.png"
                alt="Gestionare documente CRM"
                className="rounded-xl w-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          >
            <div className="flex items-start gap-3 mb-4">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                </svg>
              </span>
              <div>
                <h3 className="text-xl font-bold text-foreground">Documente centralizate</h3>
                <p className="mt-2 text-muted leading-relaxed">
                  Incarca si gestioneaza contracte, acte de proprietate si orice alt document.
                  Totul organizat pe dosare, accesibil din orice dispozitiv.
                </p>
              </div>
            </div>
            <ul className="space-y-2 ml-11">
              {["Stocare securizata in cloud", "Organizare pe dosare per proprietate", "Partajare rapida cu clientii"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
