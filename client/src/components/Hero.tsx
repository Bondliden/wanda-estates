import videoSource from "@assets/generated_videos/cinematic_drone_shot_of_luxury_marbella_villa.mp4";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
         <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={videoSource} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20" /> 
      </div>

      {/* Content Container - Mimicking the Divi layout with 2 columns */}
      <div className="relative z-10 container mx-auto h-full flex items-center px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-8">
          {/* Left Column (Empty in original) */}
          <div className="hidden md:block"></div>

          {/* Right Column (Content) */}
          <div className="flex flex-col items-center md:items-center text-center text-white bg-black/40 p-12 backdrop-blur-sm rounded-sm">
            <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-wide uppercase">
              Luxury Apartments
            </h1>
            <h3 className="text-xl md:text-2xl font-light mb-6">
              Within a private estate
            </h3>
            <p className="text-lg mb-8 text-gray-200">
              Prices from €299,000
            </p>
            <Button 
              className="bg-white text-[#2ea3f2] hover:bg-gray-100 hover:text-[#2ea3f2] uppercase tracking-wider font-bold px-8 py-6 rounded-none text-sm transition-all"
            >
              View Property
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
