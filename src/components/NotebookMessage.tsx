import React, { useMemo, useState } from "react";
import { motion, AnimatePresence, color } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NotebookMessageProps {
  message: string;
  onPageChange?: (page: number) => void;
  className?: string;
}

const WORDS_PER_PAGE = 30; // Closer to 5-7 lines per page

export default function NotebookMessage({ message, className = "" }: NotebookMessageProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = useMemo(() => {
    if (!message) return [];
    
    // Split by words to prevent cutting in the middle
    const words = message.split(/\s+/);
    const result = [];
    let currentChunk: string[] = [];
    
    words.forEach((word) => {
        currentChunk.push(word);
        if (currentChunk.length >= WORDS_PER_PAGE) {
            result.push(currentChunk.join(" "));
            currentChunk = [];
        }
    });

    if (currentChunk.length > 0) {
        result.push(currentChunk.join(" "));
    }
    
    return result;
  }, [message]);

  if (pages.length === 0) return null;

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  return (
    <div className={`relative ${className} flex flex-col items-center justify-center transition-all duration-1000 `}>
      <div className="relative w-full max-w-[340px] aspect-[4/5] sm:aspect-[3/4] ">
        {/* Soft Paper Stack Look */}
        <AnimatePresence mode="popLayout">
            <motion.div 
                key={currentPage}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] flex flex-col p-10 lg:p-12"
                style={{backgroundColor:"#fbfbea"}}
                
            >
                {/* Subtle Paper Texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none grainy-bg " />
                
                <div className="relative z-10 flex-1 flex flex-col justify-center text-center ">
                    <p className="text-2xl font-handwritten text-slate-700 leading-relaxed tracking-wide whitespace-pre-line">
                        {pages[currentPage]}
                    </p>
                </div>

                {/* Minimalist Nav */}
                <div className="relative z-20 mt-8 flex items-center justify-between">
                    <button 
                        onClick={(e) => { e.stopPropagation(); prevPage(); }}
                        disabled={currentPage === 0}
                        className={`p-1 transition-all pointer-events-auto ${currentPage === 0 ? 'opacity-0' : 'opacity-20 hover:opacity-100 hover:text-rose-400'}`}
                    >
                        <ChevronLeft size={18} strokeWidth={1} />
                    </button>
                    
                    <span className="text-[9px] uppercase tracking-[0.3em] text-stone-300 font-bold font-sans">
                        {currentPage + 1} / {pages.length}
                    </span>

                    <button 
                        onClick={(e) => { e.stopPropagation(); nextPage(); }}
                        disabled={currentPage === pages.length - 1}
                        className={`p-1 transition-all pointer-events-auto ${currentPage === pages.length - 1 ? 'opacity-0' : 'opacity-20 hover:opacity-100 hover:text-rose-400'}`}
                    >
                        <ChevronRight size={18} strokeWidth={1} />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>

        {/* Catch-all navigation surface */}
        <div className="absolute inset-0 z-30 flex cursor-pointer" onClick={(e) => {
             const rect = e.currentTarget.getBoundingClientRect();
             const x = e.clientX - rect.left;
             if (x < rect.width / 2) prevPage();
             else nextPage();
        }} />
      </div>
    </div>
  );
}
