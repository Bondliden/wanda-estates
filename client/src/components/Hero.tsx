import videoSource from "@assets/generated_videos/Dec_11__0958_31s_202512111144_8qsab.mp4";

export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden" id="hero">
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
      </div>

      {/* Static Centered Content */}
      <div className="relative z-10 container mx-auto h-full flex items-center justify-center px-4">
        <div className="max-w-md overflow-hidden text-center text-white">
          <h2 className="text-xs lg:text-sm font-serif leading-snug tracking-wide">
            Privacidad, diseño y arquitectura en la Costa del Sol.
            <br />
            Viva donde otros sueñan vacacionar.
          </h2>
        </div>
      </div>
    </section>
  );
}
