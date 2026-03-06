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
import PropertyDetail from "@/pages/PropertyDetail";
import InvestmentGuide from "@/pages/InvestmentGuide";
import ChatBot from "@/components/ChatBot";
import FloatingBanner from "@/components/FloatingBanner";
import React, { useState } from "react";

console.log("[App.tsx] Imports done, defining components");

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  state: { hasError: boolean; error?: Error } = { hasError: false };
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px", textAlign: "center", fontFamily: "sans-serif" }}>
          <h1 style={{ color: "#c00" }}>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <pre style={{ textAlign: "left", background: "#f5f5f5", padding: "20px", overflow: "auto" }}>
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/properties-for-sale" component={PropertiesForSale} />
      <Route path="/listings" component={PropertiesForSale} />
      <Route path="/properties/:id" component={PropertyDetail} />
      <Route path="/new-developments" component={NewDevelopments} />
      <Route path="/services" component={Services} />
      <Route path="/about-us" component={AboutUs} />
      <Route path="/contact" component={ContactUs} />
      <Route path="/contact-us" component={ContactUs} />
      <Route path="/investment-guide" component={InvestmentGuide} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" />
          <Router />
          <FloatingBanner isChatOpen={isChatOpen} />
          <ChatBot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
