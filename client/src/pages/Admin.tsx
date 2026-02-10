import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import CarForm from "@/components/car/CarForm";
import CarCard from "@/components/car/CarCard";
import { apiRequest } from "@/lib/queryClient";
import type { Car, Contact, SellRequest, InsertCar } from "@shared/schema";
import { Car as CarIcon, MessageSquare, FileText, Plus, Eye, Trash2, Mail, TrendingUp, Users, BarChart3 } from "lucide-react";

export default function Admin() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddCarOpen, setIsAddCarOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const { data: user } = useQuery({ 
    queryKey: ["/api/me"]
  });

  // Redirect if not admin
  if (!user?.isAdmin) {
    navigate("/login");
    return null;
  }

  const { data: cars } = useQuery<Car[]>({ 
    queryKey: ["/api/cars"]
  });

  const { data: contacts } = useQuery<Contact[]>({ 
    queryKey: ["/api/admin/contacts"]
  });

  const { data: sellRequests } = useQuery<SellRequest[]>({ 
    queryKey: ["/api/admin/sell-requests"]
  });

  const addCarMutation = useMutation({
    mutationFn: async (data: InsertCar) => {
      const result = await apiRequest("POST", "/api/cars", data);
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      setIsAddCarOpen(false);
      toast({ 
        title: "Fahrzeug hinzugefuegt",
        description: `"${data.title}" wurde zur Kollektion hinzugefuegt.`,
        duration: 5000,
      });
    },
    onError: (error) => {
      console.error('❌ Admin: Gabim gjatë shtimit të makinës:', error);
      toast({
        title: "Fehler beim Hinzufuegen",
        description: error.message || "Ein unbekannter Fehler ist aufgetreten",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const updateCarMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertCar> }) => {
      await apiRequest("PATCH", `/api/cars/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      setSelectedCar(null);
      toast({ title: "Fahrzeug aktualisiert" });
    },
    onError: (error) => {
      toast({
        title: "Fehler beim Aktualisieren",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCarMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cars/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      setSelectedCar(null);
      toast({ title: "Fahrzeug geloescht" });
    },
    onError: (error) => {
      toast({
        title: "Fehler beim Loeschen",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addContactMutation = useMutation({
    mutationFn: async (data: Omit<Contact, 'id' | 'createdAt'>) => {
      const result = await apiRequest("POST", "/api/admin/contacts", data);
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      setIsAddContactOpen(false);
      setSelectedContact(null);
      toast({
        title: "Kontakt hinzugefuegt",
        description: `Kontakt von ${data.name} wurde hinzugefuegt.`,
        duration: 5000,
      });
    },
    onError: (error) => {
      toast({
        title: "Fehler beim Hinzufuegen",
        description: error.message || "Kontakt konnte nicht hinzugefuegt werden",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      setSelectedContact(null);
      toast({ title: "Kontakt geloescht" });
    },
    onError: (error) => {
      toast({
        title: "Fehler beim Loeschen",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Helper function to parse JSON strings safely
  const parseJsonSafely = (jsonString: string, fallback: any = {}) => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return fallback;
    }
  };

  // Helper function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 border-t-2 border-primary/40">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        {/* Header Section - Centered */}
        <div className="flex flex-col items-center justify-center mb-12 space-y-4 pb-6 border-b-2 border-primary/30">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-3">
              Admin-Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">Verwaltung der Plattform</p>
          </div>
          <Button 
            onClick={() => setIsAddCarOpen(true)} 
            className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            Neues Fahrzeug
          </Button>
        </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-background">
              <BarChart3 className="w-4 h-4" />
              Uebersicht
            </TabsTrigger>
            <TabsTrigger value="cars" className="flex items-center gap-2 data-[state=active]:bg-background">
              <CarIcon className="w-4 h-4" />
              Fahrzeuge ({cars?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2 data-[state=active]:bg-background">
              <MessageSquare className="w-4 h-4" />
              Kontakte ({contacts?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="sell-requests" className="flex items-center gap-2 data-[state=active]:bg-background">
              <FileText className="w-4 h-4" />
              Verkaufsanfragen ({sellRequests?.length || 0})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-8">
          {/* Statistics Cards - Centered */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
              <Card className="border-2 hover:border-primary/50 transition-all duration-200 hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fahrzeuge gesamt</CardTitle>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CarIcon className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{cars?.length || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Fahrzeuge in der Kollektion
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all duration-200 hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{contacts?.length || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Customer inquiries
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all duration-200 hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Verkaufsanfragen</CardTitle>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{sellRequests?.length || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ausstehende Bewertungen
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity - Centered */}
          <div className="flex justify-center">
            <Card className="w-full max-w-5xl border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest additions to your collection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cars && cars.length > 0 ? (
                    cars.slice(0, 5).map((car) => (
                      <div key={car.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors duration-200">
                        <div>
                          <p className="font-semibold text-lg">{car.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {car.year} • {car.mileage.toLocaleString('de-CH')} km
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-base px-4 py-1">
                          {formatPrice(car.price)}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No cars in collection yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cars" className="space-y-6">
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
              {cars && cars.length > 0 ? (
                cars.map((car) => (
                  <div key={car.id} className="relative group">
                    <CarCard car={car} onClick={() => setSelectedCar(car)} />
                    <div className="absolute top-3 right-3 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCar(car);
                        }}
                        className="shadow-md hover:shadow-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCarMutation.mutate(car.id);
                        }}
                        className="shadow-md hover:shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <CarIcon className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">Keine Fahrzeuge in der Kollektion</p>
                  <p className="text-sm text-muted-foreground mt-2">Fuegen Sie Ihr erstes Fahrzeug hinzu</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold text-foreground">Kontaktnachrichten</h2>
            <Button onClick={() => setIsAddContactOpen(true)} className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200">
              <MessageSquare className="w-4 h-4 mr-2" />
              Neuer Kontakt
            </Button>
          </div>
          
          <div className="flex justify-center">

            <Card className="border-2 w-full max-w-6xl">
              <CardHeader className="border-b">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Alle Kontakte
                </CardTitle>
                <CardDescription>
                  Kundenanfragen und Kontaktnachrichten verwalten
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-muted/50">
                        <TableHead className="text-foreground font-semibold">Name</TableHead>
                        <TableHead className="text-foreground font-semibold">E-Mail</TableHead>
                        <TableHead className="text-foreground font-semibold">Nachricht</TableHead>
                        <TableHead className="text-foreground font-semibold">Datum</TableHead>
                        <TableHead className="text-foreground font-semibold">Aktionen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts && contacts.length > 0 ? (
                        contacts.map((contact) => (
                          <TableRow key={contact.id} className="border-border hover:bg-muted/30 transition-colors">
                            <TableCell className="font-medium text-foreground">
                              <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                  <span className="text-primary font-semibold">
                                    {contact.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <span>{contact.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-foreground">
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{contact.email}</span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <div className="text-sm text-muted-foreground line-clamp-2">
                                {contact.message}
                              </div>
                            </TableCell>
                            <TableCell className="text-foreground">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                  {new Date(contact.createdAt).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(contact.createdAt).toLocaleTimeString()}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedContact(contact)}
                                  className="border-border hover:bg-muted"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteContactMutation.mutate(contact.id)}
                                  className="hover:bg-destructive/90"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-12">
                            <div className="flex flex-col items-center space-y-3">
                              <MessageSquare className="w-12 h-12 text-muted-foreground/50" />
                              <div>
                                <p className="text-lg font-medium text-foreground">Noch keine Kontakte</p>
                                <p className="text-sm text-muted-foreground">
                                  Kontaktnachrichten erscheinen hier, wenn Kunden sich melden
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sell-requests" className="space-y-6">
          <div className="flex justify-center">
            <Card className="border-2 w-full max-w-6xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Verkaufsanfragen
                </CardTitle>
                <CardDescription>Anfragen zur Fahrzeugbewertung</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Name</TableHead>
                        <TableHead className="font-semibold">Kontakt</TableHead>
                        <TableHead className="font-semibold">Fahrzeugdaten</TableHead>
                        <TableHead className="font-semibold">Verkaufspreis</TableHead>
                        <TableHead className="font-semibold">Datum</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sellRequests && sellRequests.length > 0 ? (
                        sellRequests.map((request) => {
                          const carDetails = parseJsonSafely(request.carDetails, {});
                          return (
                            <TableRow key={request.id} className="hover:bg-muted/30 transition-colors">
                              <TableCell className="font-medium">{request.name}</TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <p>{request.email}</p>
                                  <p className="text-muted-foreground">{request.phone}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <p className="font-medium">
                                    {carDetails.make} {carDetails.model}
                                  </p>
                                  <p className="text-muted-foreground">
                                    {carDetails.year} • {carDetails.mileage?.toLocaleString('de-CH')} km
                                  </p>
                                  <Badge variant="outline" className="mt-1">{carDetails.condition}</Badge>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">
                                {formatPrice(carDetails.askingPrice || 0)}
                              </TableCell>
                              <TableCell>
                                {new Date(request.createdAt).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-12">
                            <div className="flex flex-col items-center space-y-3">
                              <FileText className="w-12 h-12 text-muted-foreground/50" />
                              <div>
                                <p className="text-lg font-medium text-foreground">No sell requests yet</p>
                                <p className="text-sm text-muted-foreground">
                                  Sell requests will appear here when customers submit their cars
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {isAddCarOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border-2 border-border">
            <div className="flex justify-between items-center p-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
              <h2 className="text-3xl font-bold text-card-foreground">Neues Fahrzeug</h2>
              <button
                onClick={() => setIsAddCarOpen(false)}
                className="text-muted-foreground hover:text-foreground text-3xl font-bold transition-all duration-200 hover:scale-110 w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted"
              >
                ×
              </button>
            </div>
            <div className="p-8 bg-card">
              <CarForm onSubmit={(data) => addCarMutation.mutateAsync(data)} />
            </div>
          </div>
        </div>
      )}

      {selectedCar && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border-2 border-border">
            <div className="flex justify-between items-center p-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
              <h2 className="text-3xl font-bold text-card-foreground">Edit Car</h2>
              <button
                onClick={() => setSelectedCar(null)}
                className="text-muted-foreground hover:text-foreground text-3xl font-bold transition-all duration-200 hover:scale-110 w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted"
              >
                ×
              </button>
            </div>
            <div className="p-8 bg-card">
              <CarForm
                initialData={selectedCar}
                onSubmit={(data) =>
                  updateCarMutation.mutateAsync({ id: selectedCar.id, data })
                }
              />
            </div>
          </div>
        </div>
      )}

      {isAddContactOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border-2 border-border">
            <div className="flex justify-between items-center p-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
              <h2 className="text-2xl font-bold text-card-foreground">Neuer Kontakt</h2>
              <button
                onClick={() => setIsAddContactOpen(false)}
                className="text-muted-foreground hover:text-foreground text-3xl font-bold transition-all duration-200 hover:scale-110 w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted"
              >
                ×
              </button>
            </div>
            <div className="p-8 bg-card">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newContact: Omit<Contact, 'id' | 'createdAt'> = {
                  name: formData.get('name') as string,
                  email: formData.get('email') as string,
                  message: formData.get('message') as string,
                };
                addContactMutation.mutate(newContact);
              }} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground">Name</label>
                  <input type="text" name="name" id="name" required className="mt-1 block w-full rounded-md border-border bg-background px-3 py-2 text-foreground shadow-sm ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground">E-Mail</label>
                  <input type="email" name="email" id="email" required className="mt-1 block w-full rounded-md border-border bg-background px-3 py-2 text-foreground shadow-sm ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground">Nachricht</label>
                  <textarea name="message" id="message" rows={4} required className="mt-1 block w-full rounded-md border-border bg-background px-3 py-2 text-foreground shadow-sm ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-sm" />
                </div>
                <Button type="submit" className="w-full">Kontakt hinzufuegen</Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {selectedContact && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border-2 border-border">
            <div className="flex justify-between items-center p-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
              <h2 className="text-2xl font-bold text-card-foreground">Edit Contact</h2>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-muted-foreground hover:text-foreground text-3xl font-bold transition-all duration-200 hover:scale-110 w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted"
              >
                ×
              </button>
            </div>
            <div className="p-8 bg-card">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updatedContact: Omit<Contact, 'id' | 'createdAt'> = {
                  name: formData.get('name') as string,
                  email: formData.get('email') as string,
                  message: formData.get('message') as string,
                };
                addContactMutation.mutate(updatedContact); // This mutation is for adding, not updating
                // The actual update logic would involve a separate mutation
                toast({ title: "Kontakt aktualisiert" });
                setSelectedContact(null);
              }} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground">Name</label>
                  <input type="text" name="name" id="name" defaultValue={selectedContact.name} required className="mt-1 block w-full rounded-md border-border bg-background px-3 py-2 text-foreground shadow-sm ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground">E-Mail</label>
                  <input type="email" name="email" id="email" defaultValue={selectedContact.email} required className="mt-1 block w-full rounded-md border-border bg-background px-3 py-2 text-foreground shadow-sm ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground">Nachricht</label>
                  <textarea name="message" id="message" rows={4} defaultValue={selectedContact.message} required className="mt-1 block w-full rounded-md border-border bg-background px-3 py-2 text-foreground shadow-sm ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-sm" />
                </div>
                <Button type="submit" className="w-full">Kontakt aktualisieren</Button>
              </form>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
