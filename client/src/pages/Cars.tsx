import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CarCard from "@/components/car/CarCard";
import CarGallery from "@/components/car/CarGallery";
import CarForm from "@/components/car/CarForm";
import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Car, InsertCar } from "@shared/schema";

export default function Cars() {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isAddCarOpen, setIsAddCarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cars, isLoading } = useQuery<Car[]>({ 
    queryKey: ["/api/cars"]
  });

  const { data: user } = useQuery({ 
    queryKey: ["/api/me"]
  });

  const addCarMutation = useMutation({
    mutationFn: async (data: InsertCar) => {
      await apiRequest("POST", "/api/cars", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      setIsAddCarOpen(false);
      toast({ 
        title: "Fahrzeug hinzugefuegt",
        description: "Das Fahrzeug wurde zur Kollektion hinzugefuegt."
      });
    },
    onError: (error) => {
      toast({
        title: "Fehler beim Hinzufuegen",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredCars = cars?.filter(car => {
    const matchesSearch = car.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = priceFilter === "all" ? true :
      priceFilter === "luxury" ? car.price >= 100000 :
      priceFilter === "premium" ? car.price >= 50000 && car.price < 100000 :
      car.price < 50000;
    const matchesType = typeFilter === "all" ? true : car.specs.bodyType === typeFilter;
    return matchesSearch && matchesPrice && matchesType;
  });

  return (
    <div className="min-h-screen">
      <div className="relative h-64 md:h-96">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/img/DHMgallerie.jpeg)' }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative container max-w-7xl mx-auto px-8 h-full flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Unsere Kollektion
            </h1>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Exklusive Premiumfahrzeuge – handverlesen fuer Sie
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-8 py-12">
        <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Marke, Modell oder Jahr suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select onValueChange={setPriceFilter} defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Preisbereich" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Preise</SelectItem>
                  <SelectItem value="luxury">Luxus (CHF 100k+)</SelectItem>
                  <SelectItem value="premium">Premium (CHF 50k-100k)</SelectItem>
                  <SelectItem value="standard">Standard (unter CHF 50k)</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setTypeFilter} defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Fahrzeugtyp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Typen</SelectItem>
                  <SelectItem value="Sedan">Limousine</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Coupe">Coupe</SelectItem>
                  <SelectItem value="Convertible">Cabriolet</SelectItem>
                  <SelectItem value="Wagon">Kombi</SelectItem>
                  <SelectItem value="Electric">Elektro</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {user?.isAdmin && (
              <Button 
                onClick={() => setIsAddCarOpen(true)} 
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Fahrzeug hinzufuegen
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-lg bg-card animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars?.map((car) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <CarCard
                    car={car}
                    onClick={() => setSelectedCar(car)}
                  />
                </motion.div>
              ))}
            </div>
            {filteredCars?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  Keine Fahrzeuge entsprechen Ihrer Suche
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={!!selectedCar} onOpenChange={() => setSelectedCar(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCar && (() => {
            const images = (() => {
              try {
                if (Array.isArray(selectedCar.images)) return selectedCar.images;
                return JSON.parse(selectedCar.images);
              } catch {
                return [];
              }
            })();
            const specs = (() => {
              try {
                if (typeof selectedCar.specs === 'object') return selectedCar.specs;
                return JSON.parse(selectedCar.specs);
              } catch {
                return { engine: '', transmission: '', fuelType: '', bodyType: '', color: '' };
              }
            })();
            return (
              <div className="space-y-4">
                <CarGallery images={images} title={selectedCar.title} />
                <h2 className="text-2xl font-bold">{selectedCar.title}</h2>
                <p className="text-xl font-bold text-primary">
                  {new Intl.NumberFormat('de-CH', {
                    style: 'currency',
                    currency: 'CHF',
                  }).format(selectedCar.price)}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Jahr:</span>{" "}
                    {selectedCar.year}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Kilometerstand:</span>{" "}
                    {selectedCar.mileage.toLocaleString('de-CH')} km
                  </div>
                  <div>
                    <span className="text-muted-foreground">Motor:</span>{" "}
                    {specs.engine || '–'}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Getriebe:</span>{" "}
                    {specs.transmission || '–'}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Kraftstoff:</span>{" "}
                    {specs.fuelType || '–'}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Karosserie:</span>{" "}
                    {specs.bodyType || '–'}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Farbe:</span>{" "}
                    {specs.color || '–'}
                  </div>
                </div>
                <p className="text-muted-foreground">{selectedCar.description}</p>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Add Car Dialog */}
      <Dialog open={isAddCarOpen} onOpenChange={setIsAddCarOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Neues Fahrzeug zur Kollektion hinzufuegen</DialogTitle>
          </DialogHeader>
          <CarForm
            onSubmit={async (data) => {
              await addCarMutation.mutateAsync(data);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}