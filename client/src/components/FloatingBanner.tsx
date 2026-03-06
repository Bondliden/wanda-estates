import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingBannerProps {
    isChatOpen: boolean;
}

const phrases = [
    "Pregúntale a Wanda y encuentra tu casa ideal en Costa del Sol →",
    "Wanda te da la mejor oferta inmobiliaria con valor imbatible →",
    "Habla con Wanda para tu vivienda perfecta en la Costa →"
];

export default function FloatingBanner({ isChatOpen }: FloatingBannerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % phrases.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    if (isChatOpen || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onMouseEnter={() => setIsVisible(false)}
                className="fixed bottom-24 right-8 z-[45] max-w-[280px] p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-[#C9A961]/20 cursor-pointer group transition-all duration-300 hover:shadow-2xl"
            >
                <div className="relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentIndex}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.5 }}
                            className="text-[#1a3a54] text-sm font-medium leading-relaxed font-sans pr-6"
                        >
                            {phrases[currentIndex]}
                        </motion.p>
                    </AnimatePresence>

                    <motion.span
                        animate={{
                            x: [0, 5, 0],
                            opacity: [1, 0.5, 1]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "easeInOut"
                        }}
                        className="absolute right-0 bottom-0 text-[#C9A961] font-bold text-lg"
                    >
                        →
                    </motion.span>
                </div>

                {/* Subtle accent line */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C9A961]/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </motion.div>
        </AnimatePresence>
    );
}
