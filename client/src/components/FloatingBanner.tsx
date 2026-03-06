import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingBannerProps {
    isChatOpen: boolean;
}

export default function FloatingBanner({ isChatOpen }: FloatingBannerProps) {
    if (isChatOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-chat'))}
                className="fixed bottom-24 right-8 z-[45] max-w-[320px] p-6 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-[#C9A961]/20 cursor-pointer group transition-all duration-500 rounded-lg hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.2)]"
            >
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a3a54] to-[#2c3e50] flex items-center justify-center text-[#C9A961] shadow-inner font-serif italic text-xl">
                            W
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-[#C9A961] font-bold uppercase tracking-[0.2em]">Asesor Personal</span>
                            <span className="text-[#1a3a54] text-sm font-bold leading-none">Concierge de Lujo 24/7</span>
                        </div>
                    </div>

                    <p className="text-[#2c3e50] text-xs leading-relaxed font-light italic">
                        "¡Hola! Soy su asesor personal de inmuebles de lujo. ¿Cómo puedo ayudarle a encontrar su santuario mediterráneo?"
                    </p>

                    <div className="flex items-center justify-between mt-2">
                        <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online ahora
                        </span>
                        <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="text-[#C9A961] font-bold"
                        >
                            →
                        </motion.span>
                    </div>
                </div>

                {/* Golden accent bar at top */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[#C9A961]" />
            </motion.div>
        </AnimatePresence>
    );
}
