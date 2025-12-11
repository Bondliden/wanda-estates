import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedListings from "@/components/FeaturedListings";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        {/* Intro Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6 text-center max-w-4xl">
            <span className="text-secondary text-sm font-bold uppercase tracking-widest mb-4 block">Welcome to Wanda Estates</span>
            <h2 className="text-3xl md:text-5xl font-serif text-primary mb-8 leading-snug">
              A Refreshing Approach to <br/>Luxury Real Estate
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10 font-light">
              With over 20 years of experience in hotel and real estate development, 
              we combine industry expertise with financial acumen to help our clients 
              make wise property investments in Marbella. We don't just sell homes; 
              we curate lifestyles and secure legacies.
            </p>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-none uppercase tracking-widest px-8 py-6">
              Learn More About Us
            </Button>
          </div>
        </section>

        <FeaturedListings />

        {/* CTA Section */}
        <section className="py-32 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-20 bg-fixed"></div>
          <div className="container mx-auto px-6 relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-8">Looking to Sell Your Property?</h2>
            <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light">
              Trust your property with Marbella's most dynamic real estate team. 
              We offer bespoke marketing strategies to reach the right buyers globally.
            </p>
            <Button className="bg-secondary text-primary hover:bg-white hover:text-primary rounded-none uppercase tracking-widest px-10 py-6 text-sm font-bold">
              Request a Valuation
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
