import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FloatingBannerProps {
    isChatOpen: boolean;
}

export default function FloatingBanner({ isChatOpen }: FloatingBannerProps) {
    const { t } = useTranslation();
    const [isMinimized, setIsMinimized] = useState(false);

    if (isChatOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    width: isMinimized ? "56px" : "320px",
                    height: isMinimized ? "56px" : "auto",
                    borderRadius: isMinimized ? "100px" : "8px"
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`fixed bottom-24 right-8 z-[45] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-[#C9A961]/20 cursor-pointer group transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.2)] overflow-hidden flex items-center justify-center`}
                onClick={() => {
                    if (isMinimized) {
                        setIsMinimized(false);
                    } else {
                        (window as any).dispatchEvent(new CustomEvent('open-chat'));
                    }
                }}
            >
                {!isMinimized ? (
                    <div className="flex flex-col gap-3 relative w-full p-6">
                        {/* Minimize button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMinimized(true);
                            }}
                            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-[#C9A961] transition-colors"
                        >
                            <ChevronDown className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a3a54] to-[#2c3e50] flex items-center justify-center text-[#C9A961] shadow-inner font-serif italic text-xl">
                                W
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-[#C9A961] font-bold uppercase tracking-[0.2em]">{t("chat.advisor")}</span>
                                <span className="text-[#1a3a54] text-sm font-bold leading-none">{t("chat.subtitle")}</span>
                            </div>
                        </div>

                        <p className="text-[#2c3e50] text-xs leading-relaxed font-light italic">
                            "{t("chat.banner")}"
                        </p>

                        <div className="flex items-center justify-between mt-2">
                            <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> {t("chat.status")}
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
                ) : (
                    <motion.div
                        initial={{ rotate: -180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        className="w-full h-full flex items-center justify-center bg-[#1a3a54] text-[#C9A961]"
                    >
                        <ChevronUp className="w-6 h-6" />
                    </motion.div>
                )}

                {/* Golden accent bar at top */}
                {!isMinimized && <div className="absolute top-0 left-0 w-full h-1 bg-[#C9A961]" />}
            </motion.div>
        </AnimatePresence>
    );
}
