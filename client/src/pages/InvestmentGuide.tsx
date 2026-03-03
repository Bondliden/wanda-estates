import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft, TrendingUp, ShieldCheck, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function InvestmentGuide() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            <div className="print:hidden">
                <Navbar />
            </div>

            <main className="container mx-auto px-4 pt-32 pb-24">
                {/* Navigation / Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 print:hidden">
                    <Link href="/properties-for-sale">
                        <Button variant="ghost" className="flex items-center gap-2 text-gray-500 hover:text-[#2B5F8C]">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Properties
                        </Button>
                    </Link>

                    <Button
                        onClick={handlePrint}
                        className="bg-[#C9A961] hover:bg-[#B39650] text-white flex items-center gap-2 px-8"
                    >
                        <Printer className="w-4 h-4" />
                        Save as PDF / Print
                    </Button>
                </div>

                {/* Paper Container */}
                <div className="max-w-4xl mx-auto bg-white shadow-2xl p-8 md:p-16 border border-gray-100 print:shadow-none print:p-0 print:border-none">
                    {/* Logo */}
                    <div className="flex justify-between items-start mb-16">
                        <img src="/wanda_logo_horizontal.png" alt="Wanda Estates" className="h-10 md:h-12" />
                        <div className="text-right">
                            <p className="text-[#C9A961] font-serif uppercase tracking-widest text-sm">Exclusive Market Report</p>
                            <p className="text-gray-400 text-xs">Issue: Spring 2025</p>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="mb-12 border-b border-gray-100 pb-8">
                        <h1 className="text-4xl md:text-5xl font-serif text-[#2B5F8C] uppercase tracking-tighter leading-tight mb-4">
                            Marbella <br />
                            <span className="text-[#C9A961]">Investment Guide</span> 2025
                        </h1>
                        <p className="text-gray-600 text-xl font-light italic">
                            "Exclusive insights on tax advantages, prime locations, and ROI projections for luxury real estate."
                        </p>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 bg-[#fcfcfc] p-8 border-y border-gray-50">
                        <div className="text-center">
                            <TrendingUp className="w-6 h-6 text-[#C9A961] mx-auto mb-3" />
                            <p className="text-2xl font-serif text-[#2B5F8C]">7-10%</p>
                            <p className="text-xs uppercase tracking-widest text-gray-500">Short-Term Yield</p>
                        </div>
                        <div className="text-center border-x border-gray-100 px-4">
                            <ShieldCheck className="w-6 h-6 text-[#C9A961] mx-auto mb-3" />
                            <p className="text-2xl font-serif text-[#2B5F8C]">100%</p>
                            <p className="text-xs uppercase tracking-widest text-gray-500">Wealth Tax Exemption</p>
                        </div>
                        <div className="text-center">
                            <MapPin className="w-6 h-6 text-[#C9A961] mx-auto mb-3" />
                            <p className="text-2xl font-serif text-[#2B5F8C]">+14.8%</p>
                            <p className="text-xs uppercase tracking-widest text-gray-500">Peak Appreciation</p>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-12 text-gray-700 leading-relaxed text-lg">
                        <section>
                            <h2 className="text-xl font-serif text-[#2B5F8C] uppercase tracking-wider mb-4 border-l-4 border-[#C9A961] pl-4">Market Overview</h2>
                            <p>
                                The Marbella real estate market enters 2025 with unprecedented momentum. Driven by a supply-demand imbalance in the ultra-luxury segment and significant tax incentives in the Andalusia region, Costa del Sol remains the premier destination for international wealth preservation and ROI.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-serif text-[#2B5F8C] uppercase tracking-wider mb-4 border-l-4 border-[#C9A961] pl-4">Tax Advantages & Incentives</h2>
                            <div className="bg-gray-50 p-6 space-y-4">
                                <p><strong>Wealth Tax Exemption:</strong> Andalusia currently maintains a 100% exemption on regional wealth tax, making it a "tax haven" for high-net-worth individuals within Spain.</p>
                                <p><strong>Resale Property Tax (ITP):</strong> A competitive flat rate of 7% applies to all resale transactions.</p>
                                <p><strong>Andalusian Solidarity Tax:</strong> Only applies to net wealth exceeding €3,000,000.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-serif text-[#2B5F8C] uppercase tracking-wider mb-4 border-l-4 border-[#C9A961] pl-4">Prime Investment Locations</h2>
                            <p className="mb-4">For 2025, capital allocation should focus on areas with proven resilience and high rental demand:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>The Golden Mile:</strong> The heart of luxury. Limited supply makes this area inflation-proof.</li>
                                <li><strong>Sierra Blanca & Zagaleta:</strong> The summit of privacy. 9% value increase in last 12 months.</li>
                                <li><strong>Los Monteros:</strong> High growth potential with annual appreciation hitting +14.8%.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-serif text-[#2B5F8C] uppercase tracking-wider mb-4 border-l-4 border-[#C9A961] pl-4">ROI Projections</h2>
                            <p>
                                Capital appreciation is projected to reach 4-6% in 2025. Investors seeking yield should focus on high-amenity villas where short-term summer yields often break the 10% barrier.
                            </p>
                        </section>
                    </div>

                    {/* Footer of Guide */}
                    <div className="mt-24 pt-12 border-t border-gray-100 flex justify-between items-center gap-4">
                        <div className="flex-grow">
                            <p className="font-serif text-[#2B5F8C]">Tailoring Every Detail</p>
                            <p className="text-sm text-gray-400">© 2025 Wanda Estates | Luxury Real Estate Marbella</p>
                        </div>
                        <img src="/wanda_logo_horizontal.png" alt="Logo" className="h-6 opacity-30 grayscale" />
                    </div>
                </div>
            </main>

            <div className="print:hidden">
                <Footer />
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @media print {
          body { background: white !important; }
          .container { max-width: 100% !important; width: 100% !important; padding: 0 !important; }
        }
      `}} />
        </div>
    );
}
