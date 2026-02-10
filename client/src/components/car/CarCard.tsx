import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Car } from "@shared/schema";

interface CarCardProps {
  car: Car;
  onClick?: () => void;
}

export default function CarCard({ car, onClick }: CarCardProps) {
  // Parse JSON strings from database
  const getImages = () => {
    try {
      if (Array.isArray(car.images)) return car.images;
      return JSON.parse(car.images);
    } catch {
      return [];
    }
  };

  const getSpecs = () => {
    try {
      if (typeof car.specs === 'object') return car.specs;
      return JSON.parse(car.specs);
    } catch {
      return { engine: '', transmission: '' };
    }
  };

  const images = getImages();
  const specs = getSpecs();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="overflow-hidden cursor-pointer rounded-xl" onClick={onClick}>
        <div className="aspect-video relative overflow-hidden">
          <img
            src={images[0] || '/placeholder-car.jpg'}
            alt={car.title}
            className="object-cover w-full h-full"
          />
        </div>
        <CardHeader className="p-4">
          <CardTitle className="flex items-center justify-between">
            <span>{car.title}</span>
            <Badge variant="secondary">
              {new Intl.NumberFormat('de-CH', {
                style: 'currency',
                currency: 'CHF',
              }).format(car.price)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Jahr:</span>
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Km:</span>
            <span>{car.mileage.toLocaleString('de-CH')} km</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Motor:</span>
            <span>{specs.engine || '–'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Getriebe:</span>
            <span>{specs.transmission || '–'}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}