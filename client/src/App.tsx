import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "sonner";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PropertiesForSale from "@/pages/PropertiesForSale";
import NewDevelopments from "@/pages/NewDevelopments";
import Services from "@/pages/Services";
import AboutUs from "@/pages/AboutUs";
import ContactUs from "@/pages/ContactUs";
import ChatBot from "@/components/ChatBot";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/properties-for-sale" component={PropertiesForSale} />
      <Route path="/new-developments" component={NewDevelopments} />
      <Route path="/services" component={Services} />
      <Route path="/about-us" component={AboutUs} />
      <Route path="/contact-us" component={ContactUs} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <Router />
        <ChatBot />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
