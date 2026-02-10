import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Car, Contact, SellRequest } from "@shared/schema";

interface DatabaseViewerProps {
  cars?: Car[];
  contacts?: Contact[];
  sellRequests?: SellRequest[];
}

export default function DatabaseViewer({ cars, contacts, sellRequests }: DatabaseViewerProps) {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("cars");

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Data has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadData = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: `${filename} has been downloaded`,
    });
  };

  const formatData = (data: any) => {
    return JSON.stringify(data, null, 2);
  };

  const getDataStats = () => {
    return {
      cars: {
        count: cars?.length || 0,
        totalValue: cars?.reduce((sum, car) => sum + car.price, 0) || 0,
        avgPrice: cars?.length ? Math.round(cars.reduce((sum, car) => sum + car.price, 0) / cars.length) : 0,
      },
      contacts: {
        count: contacts?.length || 0,
        recent: contacts?.filter(c => {
          const date = new Date(c.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return date > weekAgo;
        }).length || 0,
      },
      sellRequests: {
        count: sellRequests?.length || 0,
        pending: sellRequests?.length || 0,
        totalValue: sellRequests?.reduce((sum, req) => {
          try {
            const details = JSON.parse(req.carDetails);
            return sum + (details.askingPrice || 0);
          } catch {
            return sum;
          }
        }, 0) || 0,
      },
    };
  };

  const stats = getDataStats();

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cars Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cars.count}</div>
            <p className="text-xs text-muted-foreground">
              Total Value: ${stats.cars.totalValue.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              Avg Price: ${stats.cars.avgPrice.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contacts.count}</div>
            <p className="text-xs text-muted-foreground">
              Recent (7 days): {stats.contacts.recent}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sell Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sellRequests.count}</div>
            <p className="text-xs text-muted-foreground">
              Pending: {stats.sellRequests.pending}
            </p>
            <p className="text-xs text-muted-foreground">
              Total Value: ${stats.sellRequests.totalValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Viewer */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Raw Database Data</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const data = { cars, contacts, sellRequests };
                  downloadData(data, `sleekwheels-database-${new Date().toISOString().split('T')[0]}.json`);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cars">
                Cars ({cars?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="contacts">
                Contacts ({contacts?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="sell-requests">
                Sell Requests ({sellRequests?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cars" className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Cars Data</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(formatData(cars))}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy JSON
                </Button>
              </div>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {formatData(cars)}
                </pre>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="contacts" className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Contacts Data</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(formatData(contacts))}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy JSON
                </Button>
              </div>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {formatData(contacts)}
                </pre>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="sell-requests" className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Sell Requests Data</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(formatData(sellRequests))}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy JSON
                </Button>
              </div>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {formatData(sellRequests)}
                </pre>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
