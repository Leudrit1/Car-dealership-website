import { motion } from "framer-motion";
import { 
  Settings, 
  Wrench, 
  Paintbrush, 
  Car, 
  Battery, 
  Shield 
} from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: <Settings className="w-12 h-12 text-white" />,
      title: "Regelmaessige Wartung",
      description: "Ihr Fahrzeug bleibt in bestem Zustand durch unseren Wartungsservice.",
    },
    {
      icon: <Wrench className="w-12 h-12 text-white" />,
      title: "Reparatur",
      description: "Fachgerechte Diagnose und Reparatur mit Originalteilen.",
    },
    {
      icon: <Paintbrush className="w-12 h-12 text-white" />,
      title: "Aufbereitung",
      description: "Professionelle Aufbereitung fuer Optik und Lackschutz.",
    },
    {
      icon: <Car className="w-12 h-12 text-white" />,
      title: "Kaufpruefung",
      description: "Gruendliche Pruefung vor dem Kauf Ihres Fahrzeugs.",
    },
    {
      icon: <Battery className="w-12 h-12 text-white" />,
      title: "Elektro-Service",
      description: "Wartung und Upgrades fuer Elektro- und Hybridfahrzeuge.",
    },
    {
      icon: <Shield className="w-12 h-12 text-white" />,
      title: "Garantieverlaengerung",
      description: "Umfassende Garantieoptionen fuer langfristigen Schutz.",
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
            Premium-Service fuer Ihr Fahrzeug
          </h2>
          <p className="text-lg text-zinc-300">
            Hoechste Qualitaet in allen Bereichen
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card/50 backdrop-blur-sm p-6 rounded-xl"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}