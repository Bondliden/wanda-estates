import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <main>
        <Hero />
        
        {/* Section below Hero as seen in HTML snippet */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
             {/* This section appeared to have a "Need Help?" block in the snippet */}
             <div className="flex justify-center">
                <div className="text-center max-w-2xl">
                   <p className="text-gray-600 text-lg mb-6">
                     Wanda Estate Property Group is a dynamic new real estate agency with a refreshing approach. Established by José Maria Esquerdo, Wanda Estate Property Group combines expertise from the real estate and financial sectors to help you make wise investments in real estate in Marbella and achieve maximum value from the property market.
                   </p>
                   <p className="text-gray-600 text-lg">
                     We have a track record for delivering ambitious luxury resorts around the world for more than 20 years in hotel and real estate development, and significant experience tailoring investments to generate rapid profits for clients.
                   </p>
                </div>
             </div>
          </div>
        </section>

      </main>
      
      {/* Simple Footer based on snippet */}
      <footer className="bg-[#f8f8f8] py-12 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
           <p>&copy; {new Date().getFullYear()} Wanda Estates. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
