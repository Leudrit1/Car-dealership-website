import { motion } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import SellForm from "@/components/forms/SellForm";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import type { InsertSellRequest } from "@shared/schema";

const luxuryCarImage = "https://images.unsplash.com/photo-1601362840608-942cdd122b52";

export default function Sell() {
  const [location] = useLocation();
  const { toast } = useToast();

  // Check if user is admin
  const { data: user } = useQuery({ 
    queryKey: ["/api/me"]
  });

  const sellRequestMutation = useMutation({
    mutationFn: async (data: InsertSellRequest) => {
      await apiRequest("POST", "/api/sell", data);
    },
    onSuccess: () => {
      toast({
        title: "Anfrage gesendet",
        description: "Wir pruefen Ihr Fahrzeug und melden uns in Kuerze.",
      });
    },
    onError: (error) => {
      toast({
        title: "Fehler beim Senden",
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
          style={{ backgroundImage: `url(${luxuryCarImage})` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative w-full h-full flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-3xl text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Auto verkaufen
            </h1>
            <p className="text-lg text-gray-200">
              Erhalten Sie ein faires Angebot fuer Ihr Fahrzeug
            </p>
          </motion.div>
        </div>
      </div>

      <div className="w-full py-12 flex justify-center px-4">
        <div className="w-full max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Fahrzeugdaten</h2>
            <SellForm
              onSubmit={async (data) => {
                await sellRequestMutation.mutateAsync(data);
              }}
            />
            <p className="mt-4 text-sm text-muted-foreground text-center">
              Wenn das von Ihnen angebotene Fahrzeug zu unserem Portfolio passt,
              melden wir uns in Kuerze mit einem persoenlichen Angebot.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}