import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Cars from "@/pages/Cars";
import Contact from "@/pages/Contact";
import Sell from "@/pages/Sell";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <Navbar />
      <main className="border-t-2 border-[hsl(6_78%_45%_/_0.3)]">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/cars" component={Cars} />
          <Route path="/contact" component={Contact} />
          <Route path="/sell" component={Sell} />
          <Route path="/admin" component={Admin} />
          <Route path="/login" component={Login} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;