import videoSource from "@assets/generated_videos/Dec_11__0958_31s_202512111144_8qsab.mp4";

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

      {/* Content Container removed as requested */}

    </section>
  );
}
