import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import ContactForm from "@/components/forms/ContactForm";
import { apiRequest } from "@/lib/queryClient";
import type { InsertContact } from "@shared/schema";

const showroomImage = "https://images.unsplash.com/photo-1498887960847-2a5e46312788";

export default function Contact() {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Nachricht gesendet",
        description: "Wir melden uns in Kuerze bei Ihnen.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen">
      <div className="relative h-64 md:h-96">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${showroomImage})` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative container max-w-7xl mx-auto px-8 h-full flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Kontakt
            </h1>
            <p className="text-lg text-gray-200">
              Kontaktieren Sie unsere Spezialisten
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">Visit Our Showroom</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  123 Luxury Lane<br />
                  Beverly Hills, CA 90210
                </p>
                <p className="text-muted-foreground">
                  Monday - Friday: 9:00 AM - 7:00 PM<br />
                  Saturday: 10:00 AM - 6:00 PM<br />
                  Sunday: By Appointment
                </p>
                <p className="text-muted-foreground">
                  Phone: (310) 555-0123<br />
                  Email: info@luxurycars.com
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-card rounded-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-6">Nachricht senden</h2>
              <ContactForm
                onSubmit={async (data) => {
                  await mutation.mutateAsync(data);
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}