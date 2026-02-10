import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Thomas Mueller",
      role: "Unternehmer",
      content: "Der beste Autohandel, den ich erlebt habe. Service und Beratung sind erstklassig.",
      rating: 5,
    },
    {
      name: "Anna Schneider",
      role: "Autobegeisterte",
      content: "Hier habe ich mein Wunschauto gefunden. Das Team hat alles fuer mich moeglich gemacht.",
      rating: 5,
    },
    {
      name: "Markus Weber",
      role: "Geschaeftsfuehrer",
      content: "Exzellenter Service von Anfang bis Ende. Kompetenz bei Premiumfahrzeugen.",
      rating: 5,
    },
  ];

  return (
    <section className="py-16 bg-zinc-900 rounded-xl">
      <div className="container max-w-7xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Das sagen unsere Kunden
          </h2>
          <p className="text-lg text-zinc-300">
            Ueberzeugen Sie sich selbst
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card/50 backdrop-blur-sm p-8 rounded-lg"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-lg mb-6 text-zinc-300">{testimonial.content}</p>
              <div>
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-zinc-300">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}