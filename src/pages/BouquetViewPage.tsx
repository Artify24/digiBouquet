import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useParams, Link } from "react-router-dom";
import { BouquetState } from "../types";
import BouquetPreview from "../components/BouquetPreview";
import NotebookMessage from "../components/NotebookMessage";
import { getBouquet } from "../lib/bouquetService";

type LoadState = "loading" | "found" | "not_found";

export default function BouquetViewPage() {
  const { slug } = useParams<{ slug: string }>();
  const [bouquet, setBouquet] = useState<BouquetState | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [showGift, setShowGift] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLoadState("not_found");
      return;
    }

    getBouquet(slug).then((data) => {
      if (data) {
        setBouquet(data);
        setLoadState("found");
        setTimeout(() => setShowGift(true), 1500);
      } else {
        setLoadState("not_found");
      }
    });
  }, [slug]);

  // ─── Loading ─────────────────────────────────────────────────────────────────
  if (loadState === "loading") {
    return (
      <div className="min-h-screen grainy-bg flex flex-col items-center justify-center gap-6 relative">
        <div className="atmospheric-bg" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          {/* Spinning petal loader */}
          <div className="relative w-20 h-20">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 flex items-start justify-center"
                style={{ rotate: i * 60 }}
                animate={{ rotate: [i * 60, i * 60 + 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.1 }}
              >
                <div
                  className="w-3 h-7 rounded-full"
                  style={{ background: `hsl(${340 + i * 8}, 80%, ${65 + i * 3}%)`, opacity: 0.7 }}
                />
              </motion.div>
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-rose-300" />
            </div>
          </div>
          <p className="text-rose-900/50 font-serif italic text-sm tracking-wide">
            Unwrapping your bouquet…
          </p>
        </div>
      </div>
    );
  }

  // ─── Not Found ────────────────────────────────────────────────────────────────
  if (loadState === "not_found") {
    return (
      <div className="min-h-screen grainy-bg flex flex-col items-center justify-center px-6 text-center relative">
        <div className="atmospheric-bg" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-sm"
        >
          {/* Wilted flower illustration */}
          <div className="text-7xl mb-8 opacity-60 select-none">🥀</div>
          <h1 className="text-3xl font-serif italic text-rose-900 mb-3">
            This bouquet has faded
          </h1>
          <p className="text-sm font-serif italic text-rose-900/50 mb-10 leading-relaxed">
            The link you followed doesn't match any bouquet we know of — it may
            have expired or the address might be incorrect.
          </p>
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="bg-rose-500 text-white px-10 py-4 rounded-full font-medium shadow-lg shadow-rose-200 hover:bg-rose-600 transition-colors"
            >
              Create your own bouquet
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // ─── Found ────────────────────────────────────────────────────────────────────
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
              <h1 className="text-4xl font-serif italic text-rose-900 leading-tight">
                Someone made this
                <br />
                special for you
              </h1>
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
                {/* Bouquet */}
                <div className="relative group shrink-0">
                  <motion.div
                    className="absolute inset-0 bg-accent/20 rounded-full blur-[100px]"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity }}
                  />
                  <motion.div
                    className="relative z-10"
                    animate={{ y: [0, -15, 0], rotate: [0, 1, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <BouquetPreview state={bouquet!} size="lg" interactive />
                  </motion.div>
                </div>

                {/* Message */}
                {bouquet?.message && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="relative w-full max-w-[340px] lg:-ml-8"
                  >
                    <NotebookMessage message={bouquet.message} />
                  </motion.div>
                )}
              </div>

              {/* CTA */}
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
