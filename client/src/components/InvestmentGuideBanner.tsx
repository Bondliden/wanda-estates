import { Button } from "./ui/button";
import { Download, FileText, TrendingUp, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";

export default function InvestmentGuideBanner() {
    const [, setLocation] = useLocation();

    return (
        <div className="relative overflow-hidden bg-[#2B5F8C] rounded-sm shadow-2xl border-l-4 border-[#C9A961] group transition-all duration-500 hover:shadow-gold-500/10">
            {/* Background patterns */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A961]/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -ml-16 -mb-16"></div>

            <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                {/* Visual / Icon Block */}
                <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-inner">
                    <FileText className="w-10 h-10 md:w-14 md:h-14 text-[#C9A961]" />
                </div>

                {/* Text Content */}
                <div className="flex-grow text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                        <img
                            src="/wanda_logo_horizontal.png"
                            alt="Wanda Estates Logo"
                            className="h-6 md:h-8 w-auto mx-auto md:mx-0 opacity-90 brightness-0 invert"
                        />
                        <span className="hidden md:block w-px h-6 bg-white/20"></span>
                        <h2 className="text-2xl md:text-3xl font-serif text-white uppercase tracking-wider">
                            Marbella <span className="text-[#C9A961]">Investment Guide</span> 2025
                        </h2>
                    </div>

                    <p className="text-gray-200 text-lg font-light leading-relaxed mb-6 max-w-2xl">
                        Exclusive insights on tax advantages, prime locations, and ROI projections for luxury real estate. Discover why Andalusia is the 2025 premier destination for capital preservation.
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-8 mt-2">
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                            <TrendingUp className="w-4 h-4 text-[#C9A961]" />
                            <span>7-10% Yields</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                            <ShieldCheck className="w-4 h-4 text-[#C9A961]" />
                            <span>100% Tax Exemption</span>
                        </div>
                    </div>

                    <Button
                        className="bg-[#C9A961] hover:bg-[#B39650] text-white px-8 py-6 h-auto text-lg uppercase tracking-widest rounded-none transition-all duration-300 shadow-lg flex items-center gap-3 w-full md:w-auto justify-center"
                        onClick={() => setLocation('/investment-guide')}
                    >
                        <Download className="w-5 h-5" />
                        Download Guide
                    </Button>
                </div>
            </div>
        </div>
    );
}
