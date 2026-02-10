import { motion } from "framer-motion";

export default function HistoryVision() {
  return (
    <section className="relative py-16 bg-black mt-8 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/70 to-transparent pointer-events-none" />

      <div className="relative container max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Geschichte und Vision
          </h2>
          <p className="text-lg text-zinc-300">
            Seit unseren Anfaengen in der Schweiz begleiten wir Kundinnen und
            Kunden auf dem Weg zu ihrem passenden Fahrzeug. Was als kleine
            Auswahl von Liebhaberfahrzeugen begann, ist heute eine kuratierte
            Kollektion von Premium- und Luxusautos.
          </p>
          <p className="text-zinc-300">
            Unsere Vision ist es, einen Ort zu schaffen, an dem Vertrauen,
            Transparenz und Leidenschaft fuer Automobile im Mittelpunkt stehen.
            Jedes Fahrzeug wird sorgfaeltig ausgewaehlt, damit Sie sich auf das
            Wesentliche konzentrieren koennen: Fahrfreude.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-xl border border-primary/40 bg-black/40">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-black/10 to-transparent pointer-events-none" />
            <img
              src="/img/image.png"
              alt="Geschichte und Vision"
              className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-primary/40 rounded-xl opacity-40" />
          <div className="absolute -top-4 -right-4 w-32 h-32 border border-primary/40 rounded-full opacity-30" />
        </motion.div>
      </div>
    </section>
  );
}

