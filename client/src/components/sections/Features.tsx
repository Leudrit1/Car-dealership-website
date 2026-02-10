import { motion } from "framer-motion";
import { 
  SparkleIcon, 
  TimerIcon, 
  ShieldCheckIcon, 
  HeartIcon, 
  MapIcon, 
  BatteryChargingIcon,
  CreditCardIcon,
  VideoIcon,
  UmbrellaIcon
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <SparkleIcon className="w-8 h-8 text-white" />,
      title: "Premium-Qualitaet",
      description: "Nur ausgewaehlte Fahrzeuge in unserer Kollektion",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <TimerIcon className="w-8 h-8 text-white" />,
      title: "Schnelle Reaktion",
      description: "Support und schneller Service",
      color: "from-red-500 to-rose-500",
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8 text-white" />,
      title: "Gepruefte Historie",
      description: "Vollstaendige Fahrzeughistorie und Dokumentation",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <CreditCardIcon className="w-8 h-8 text-white" />,
      title: "Flexible Finanzierung",
      description: "Wettbewerbsfaehige Konditionen und massgeschneiderte Raten",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <VideoIcon className="w-8 h-8 text-white" />,
      title: "Virtuelle Besichtigung",
      description: "Detaillierte virtuelle Touren fuer jedes Fahrzeug",
      color: "from-yellow-500 to-amber-500",
    },
    {
      icon: <UmbrellaIcon className="w-8 h-8 text-white" />,
      title: "Versicherung",
      description: "Umfassende Versicherungsloesungen",
      color: "from-indigo-500 to-violet-500",
    },
    {
      icon: <HeartIcon className="w-8 h-8 text-white" />,
      title: "Kunde im Mittelpunkt",
      description: "Persoenlicher Service nach Ihren Wuenschen",
      color: "from-red-500 to-orange-500",
    },
    {
      icon: <MapIcon className="w-8 h-8 text-white" />,
      title: "Probefahrt",
      description: "Probefahrt nach Ihren Terminwuenschen",
      color: "from-rose-500 to-red-400",
    },
    {
      icon: <BatteryChargingIcon className="w-8 h-8 text-white" />,
      title: "Zukunftssicher",
      description: "Elektro- und Hybridfahrzeuge verfuegbar",
      color: "from-emerald-500 to-green-500",
    },
  ];

  return (
    <section className="relative py-16 bg-black/5 rounded-xl overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/70 to-transparent pointer-events-none" />
      <div className="container max-w-7xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 pl-4 section-red-line">
            Warum wir
          </h2>
          <p className="text-lg text-muted-foreground">
            Premium-Autohandel auf hoechstem Niveau
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative overflow-hidden rounded-xl p-6"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10`} />
              <div className="relative z-10">
                <div className="mb-4 inline-block rounded-full bg-card/50 p-3">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}