import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface CarGalleryProps {
  images: string[];
  title: string;
}

export default function CarGallery({ images, title }: CarGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrentIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => api.off("select", onSelect);
  }, [api]);

  if (!images?.length) {
    return (
      <div className="aspect-video rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
        Keine Bilder
      </div>
    );
  }

  return (
    <div className="relative w-full group">
      <Carousel className="w-full" setApi={setApi}>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt={`${title} - Bild ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 h-8 w-8 rounded-full bg-black/50 text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 disabled:opacity-30 [&_svg]:h-4 [&_svg]:w-4" />
        <CarouselNext className="right-2 h-8 w-8 rounded-full bg-black/50 text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 disabled:opacity-30 [&_svg]:h-4 [&_svg]:w-4" />
      </Carousel>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-primary" : "bg-primary/50"
            }`}
            onClick={() => {
              api?.scrollTo(index);
              setCurrentIndex(index);
            }}
            aria-label={`Bild ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
