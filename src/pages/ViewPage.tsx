import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useParams, Link } from "react-router-dom";
import { BouquetState } from "../types";
import BouquetPreview from "../components/BouquetPreview";
import NotebookMessage from "../components/NotebookMessage";

export default function ViewPage() {
  const { id } = useParams();
  const [state, setState] = useState<BouquetState | null>(null);
  const [showGift, setShowGift] = useState(false);

  useEffect(() => {
    if (id) {
      try {
        const decoded = JSON.parse(atob(id));
        if (!decoded.greenery) decoded.greenery = [];
        setState(decoded);
        setTimeout(() => setShowGift(true), 1500);
      } catch (e) {
        console.error("Failed to decode bouquet", e);
      }
    }
  }, [id]);

  if (!state) return (
    <div className="min-h-screen flex items-center justify-center grainy-bg font-serif italic text-rose-900/40">
      Looking for your bouquet...
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 grainy-bg overflow-hidden relative">
      <div className="atmospheric-bg" />

      <div className="relative z-10 w-full flex flex-col items-center">
        <AnimatePresence>
          {!showGift ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl font-serif italic text-rose-900 leading-tight">Made with care<br />special for you</h1>
            </motion.div>
          ) : (
            <motion.div
              key="bouquet"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="flex flex-col items-center w-full max-w-6xl"
            >
              <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 w-full relative">
                <div className="relative group shrink-0">
                  <motion.div
                    className="absolute inset-0 bg-accent/20 rounded-full blur-[100px]"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity }}
                  />
                  <motion.div
                    className="relative z-10"
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 1, 0]
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <BouquetPreview state={state} size="lg" interactive />
                  </motion.div>
                </div>

                {state.message && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="relative w-full max-w-[340px] lg:-ml-8"
                  >
                    <NotebookMessage message={state.message} />
                  </motion.div>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                className="mt-16"
              >
                <Link to="/">
                  <button className="bg-white/50 backdrop-blur-sm text-rose-600 px-10 py-4 rounded-full font-medium hover:bg-white transition-all border border-rose-200 shadow-sm font-serif italic">
                    Create your own bouquet
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
