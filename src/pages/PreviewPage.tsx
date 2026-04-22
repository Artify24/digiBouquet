import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import { BouquetState } from "../types";
import BouquetPreview from "../components/BouquetPreview";
import NotebookMessage from "../components/NotebookMessage";
import { saveBouquet } from "../lib/bouquetService";
import { Edit2, Plus, Send, Loader2 } from "lucide-react";

type SendState = "idle" | "saving" | "error";

export default function PreviewPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<BouquetState | null>(null);
  const [sendState, setSendState] = useState<SendState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("current_bouquet");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.greenery) parsed.greenery = [];
      setState(parsed);
    } else {
      navigate("/create");
    }
  }, [navigate]);

  if (!state) return null;

  const handleSend = async () => {
    if (sendState === "saving") return;
    setSendState("saving");
    setErrorMsg("");

    try {
      const slug = await saveBouquet(state);
      // Navigate to share screen, passing slug via router state
      navigate("/share", { state: { slug } });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrorMsg(msg);
      setSendState("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-6 grainy-bg overflow-y-auto relative">
      <div className="atmospheric-bg" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative z-10"
      >
        <h1 className="text-4xl font-serif italic text-rose-900 mb-2">
          Beautifully crafted
        </h1>
        <p className="text-xs uppercase tracking-[0.3em] text-rose-800/40 font-bold mb-1">
          Your gift is ready to be shared
        </p>
        <p className="text-sm font-serif italic text-rose-900/40">
          A small gesture, a lasting memory.
        </p>
      </motion.div>

      <div className="flex flex-col items-center w-full max-w-6xl relative z-20">
        {/* Bouquet + Message */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 w-full">
          <div className="relative group shrink-0">
            <motion.div
              className="absolute inset-0 bg-accent/20 rounded-full blur-[100px]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -15, 0],
                rotate: [0, 1, 0],
              }}
              transition={{
                opacity: { duration: 1.5 },
                scale: { duration: 1.5 },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <BouquetPreview state={state} size="lg" interactive />
            </motion.div>
          </div>

          {state.message && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="relative w-full max-w-[340px] lg:-ml-8"
            >
              <NotebookMessage message={state.message} />
            </motion.div>
          )}
        </div>

        {/* Actions */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="flex flex-col items-center w-full"
          >
            {/* Error message */}
            {sendState === "error" && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-rose-600 font-serif italic mb-4 text-center max-w-sm"
              >
                {errorMsg || "Failed to save your bouquet. Please try again."}
              </motion.p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mt-16">
              {/* Primary: Send / Save */}
              <motion.button
                whileHover={{ scale: sendState !== "saving" ? 1.03 : 1 }}
                whileTap={{ scale: sendState !== "saving" ? 0.97 : 1 }}
                onClick={handleSend}
                disabled={sendState === "saving"}
                className="flex items-center justify-center gap-2 bg-rose-500 text-white py-4 rounded-full font-medium shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all disabled:opacity-70 disabled:cursor-wait"
              >
                {sendState === "saving" ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 size={18} />
                    </motion.div>
                    Saving…
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send this bouquet
                  </>
                )}
              </motion.button>

              {/* Secondary: Download keepsake (print) */}
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 bg-white text-rose-900 py-4 rounded-full font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                Download keepsake
              </button>
            </div>

            {/* Secondary links */}
            <div className="flex gap-6 mt-8">
              <Link
                to="/create"
                className="text-sm opacity-40 hover:opacity-100 flex items-center gap-1 transition-opacity"
              >
                <Edit2 size={14} /> Edit bouquet
              </Link>
              <Link
                to="/create"
                className="text-sm opacity-40 hover:opacity-100 flex items-center gap-1 transition-opacity"
              >
                <Plus size={14} /> New gift
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
