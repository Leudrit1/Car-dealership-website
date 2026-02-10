import { useState, useCallback, useEffect } from "react";
import { type InsertCar, type Car } from "@shared/schema";
import { Upload } from "lucide-react";

interface CarFormProps {
  onSubmit: (data: InsertCar) => Promise<void>;
  initialData?: Car;
}

type ImageItem = { url: string; file?: File };

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CarForm({ onSubmit, initialData }: CarFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    year: "",
    mileage: "",
    description: "",
    engine: "",
    transmission: "",
    fuelType: "",
    bodyType: "",
    color: "",
  });
  
  const getInitialImages = (): ImageItem[] => {
    if (!initialData?.images) return [];
    let urls: string[] = [];
    if (Array.isArray(initialData.images)) urls = initialData.images;
    else try { urls = JSON.parse(initialData.images); } catch { return []; }
    return urls.map((url) => ({ url }));
  };
  
  const [imageItems, setImageItems] = useState<ImageItem[]>(getInitialImages());
  const [isDragging, setIsDragging] = useState(false);

  // Update form data and images when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        price: initialData.price?.toString() || "",
        year: initialData.year?.toString() || "",
        mileage: initialData.mileage?.toString() || "",
        description: initialData.description || "",
        engine: "",
        transmission: "",
        fuelType: "",
        bodyType: "",
        color: "",
      });
      
      if (initialData.specs) {
        try {
          const specs = typeof initialData.specs === 'string' 
            ? JSON.parse(initialData.specs) 
            : initialData.specs;
          setFormData(prev => ({
            ...prev,
            engine: specs.engine || "",
            transmission: specs.transmission || "",
            fuelType: specs.fuelType || "",
            bodyType: specs.bodyType || "",
            color: specs.color || "",
          }));
        } catch (e) {
          console.warn('Failed to parse specs');
        }
      }
      setImageItems(getInitialImages());
    }
  }, [initialData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const addFiles = useCallback((files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      alert("Bitte waehlen Sie nur Bilddateien (jpg, png, usw.).");
      return;
    }
    const remainingSlots = 10 - imageItems.length;
    const toAdd = imageFiles.slice(0, remainingSlots);
    if (imageFiles.length > remainingSlots) {
      alert(`Ju mund të shtoni maksimum 10 foto. Do të shtohen vetëm ${remainingSlots} foto.`);
    }
    const newItems: ImageItem[] = toAdd.map(file => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setImageItems(prev => [...prev, ...newItems].slice(0, 10));
  }, [imageItems.length]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) addFiles(Array.from(e.dataTransfer.files));
  }, [addFiles]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      addFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.price || !formData.year || !formData.mileage || !formData.description) {
      alert('Bitte fuellen Sie alle Pflichtfelder aus');
      return;
    }
    
    // Validate numeric values
    if (Number(formData.price) <= 0 || Number(formData.year) <= 1900 || Number(formData.mileage) < 0) {
      alert('Ju lutem plotësoni vlerat numerike të vlefshme');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const imageUrlsToSave: string[] = await Promise.all(
        imageItems.map(async (item) => {
          if (item.file) return fileToDataUrl(item.file);
          return item.url;
        })
      );
      
      const processedData = {
        title: formData.title.trim(),
        price: Number(formData.price),
        year: Number(formData.year),
        mileage: Number(formData.mileage),
        description: formData.description.trim(),
        images: JSON.stringify(imageUrlsToSave.length > 0 ? imageUrlsToSave : ['https://via.placeholder.com/400x300']),
        specs: JSON.stringify({
          engine: formData.engine,
          transmission: formData.transmission,
          fuelType: formData.fuelType,
          bodyType: formData.bodyType,
          color: formData.color,
        }),
      };
      
      await onSubmit(processedData);
      
      setFormData({
        title: "",
        price: "",
        year: "",
        mileage: "",
        description: "",
        engine: "",
        transmission: "",
        fuelType: "",
        bodyType: "",
        color: "",
      });
      setImageItems([]);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Fehler beim Senden: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground border-b border-border pb-3">Basic Information</h3>
        
        <div>
          <label className="block text-sm font-medium mb-3 text-foreground">Titel</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="z.B. 2023 Mercedes-Benz S-Klasse"
            className="w-full p-4 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-3 text-foreground">Preis (CHF)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">CHF</span>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="z.B. 85000"
                min="0"
                className="w-full p-4 pl-12 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-foreground">Jahr</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
              placeholder="z.B. 2023"
              min="1900"
              max={new Date().getFullYear() + 1}
              className="w-full p-4 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-foreground">Kilometerstand</label>
            <input
              type="number"
              value={formData.mileage}
              onChange={(e) => handleInputChange('mileage', e.target.value)}
              placeholder="e.g. 15000"
              min="0"
              className="w-full p-4 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3 text-foreground">Beschreibung</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Ausfuehrliche Fahrzeugbeschreibung..."
            className="w-full p-4 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground placeholder:text-muted-foreground min-h-[120px] transition-all duration-200"
            required
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground border-b border-border pb-3">Bilder</h3>
        <div
          className={`p-8 border-2 border-dashed rounded-xl text-center transition-all duration-200 ${
            isDragging ? 'border-primary bg-primary/10' : 'border-border bg-muted/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
            max={10}
          />
          <label 
            htmlFor="image-upload" 
            className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <Upload className="w-8 h-8 mx-auto mb-3 text-primary" />
            <div className="mb-2 text-lg font-medium">Drop images here or click to browse</div>
            <div className="text-sm text-muted-foreground">Maximum 10 images, each up to 5MB</div>
          </label>
        </div>
        {imageItems.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {imageItems.map((item, index) => (
              <div key={index} className="relative group">
                <img src={item.url} alt={`Bild ${index + 1}`} className="w-full h-28 object-cover rounded-lg border border-border" />
                <button
                  type="button"
                  onClick={() => {
                    if (item.url.startsWith("blob:")) URL.revokeObjectURL(item.url);
                    setImageItems(prev => prev.filter((_, i) => i !== index));
                  }}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-destructive/90 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {imageItems.length >= 10 && (
          <p className="text-sm text-muted-foreground text-center mt-2">
            Maximal 10 Bilder erlaubt
          </p>
        )}
      </div>

      {/* Specifications */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground border-b border-border pb-3">Technische Daten</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-3 text-foreground">Motor</label>
            <input
              type="text"
              value={formData.engine}
              onChange={(e) => handleInputChange('engine', e.target.value)}
              placeholder="z.B. 3.0L V6 Twin-Turbo"
              className="w-full p-4 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-foreground">Getriebe</label>
            <select
              value={formData.transmission}
              onChange={(e) => handleInputChange('transmission', e.target.value)}
              className="w-full p-4 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground transition-all duration-200"
            >
              <option value="" className="bg-background">Getriebe waehlen</option>
              <option value="Automatic" className="bg-background">Automatik</option>
              <option value="Manual" className="bg-background">Schaltgetriebe</option>
              <option value="DCT" className="bg-background">Doppelkupplung (DCT)</option>
              <option value="CVT" className="bg-background">CVT</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-foreground">Kraftstoff</label>
            <select
              value={formData.fuelType}
              onChange={(e) => handleInputChange('fuelType', e.target.value)}
              className="w-full p-4 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground transition-all duration-200"
            >
              <option value="" className="bg-background">Kraftstoff waehlen</option>
              <option value="Petrol" className="bg-background">Benzin</option>
              <option value="Diesel" className="bg-background">Diesel</option>
              <option value="Electric" className="bg-background">Elektro</option>
              <option value="Hybrid" className="bg-background">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-foreground">Karosserie</label>
            <select
              value={formData.bodyType}
              onChange={(e) => handleInputChange('bodyType', e.target.value)}
              className="w-full p-4 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground transition-all duration-200"
            >
              <option value="" className="bg-background">Karosserie waehlen</option>
              <option value="Sedan" className="bg-background">Limousine</option>
              <option value="SUV" className="bg-background">SUV</option>
              <option value="Coupe" className="bg-background">Coupe</option>
              <option value="Convertible" className="bg-background">Cabriolet</option>
              <option value="Wagon" className="bg-background">Kombi</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-foreground">Farbe</label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
              placeholder="z.B. Metallic Silber"
              className="w-full p-4 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        {isSubmitting && (
          <div className="mb-6 p-4 bg-primary/20 border border-primary/30 rounded-lg">
            <p className="text-primary text-sm text-center">
              Wird gesendet... Bitte warten.
            </p>
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-lg hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          {isSubmitting ? "Wird gesendet..." : (initialData ? "Fahrzeug aktualisieren" : "Fahrzeug hinzufuegen")}
        </button>
      </div>
    </form>
  );
}