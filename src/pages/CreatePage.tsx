import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { FLOWERS, ARRANGEMENTS, WRAPS, GREENERY } from "../constants";
import { BouquetState } from "../types";
import BouquetPreview from "../components/BouquetPreview";
import NotebookMessage from "../components/NotebookMessage";
import { ChevronLeft, ChevronRight, Check, Plus, Loader2 } from "lucide-react";
import { saveBouquet } from "../lib/bouquetService";

export default function CreatePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [state, setState] = useState<BouquetState>({
    flowers: [],
    greenery: [],
    arrangement: ARRANGEMENTS[0].id,
    wrap: WRAPS[1].id,
    message: "",
  });

  const nextStep = async () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      // Step 6: Save bouquet to Supabase and go to share screen
      if (isSaving) return;
      setIsSaving(true);
      setSaveError("");
      try {
        // Also persist to localStorage for PreviewPage fallback
        localStorage.setItem("current_bouquet", JSON.stringify(state));
        const slug = await saveBouquet(state);
        navigate("/share", { state: { slug } });
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "Failed to save. Please try again.");
        setIsSaving(false);
      }
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
    else navigate("/");
  };

  const addFlower = (id: string) => {
    setState((prev) => {
      if (prev.flowers.length >= 10) return prev;
      return { ...prev, flowers: [...prev.flowers, id] };
    });
  };

  const removeFlowerAt = (index: number) => {
    setState((prev) => {
      const newFlowers = [...prev.flowers];
      newFlowers.splice(index, 1);
      return { ...prev, flowers: newFlowers };
    });
  };

  const swapFlowers = (i: number, j: number) => {
    if (i < 0 || j < 0 || i >= state.flowers.length || j >= state.flowers.length) return;
    setState((prev) => {
      const newFlowers = [...prev.flowers];
      const temp = newFlowers[i];
      newFlowers[i] = newFlowers[j];
      newFlowers[j] = temp;
      return { ...prev, flowers: newFlowers };
    });
  };

  const toggleGreenery = (id: string) => {
    setState((prev) => {
      const exists = prev.greenery.includes(id);
      if (exists) {
        return { ...prev, greenery: prev.greenery.filter((g) => g !== id) };
      }
      if (prev.greenery.length >= 6) return prev;
      return { ...prev, greenery: [...prev.greenery, id] };
    });
  };

  return (
    <div className="min-h-screen grainy-bg flex flex-col overflow-x-hidden">
      <div className="atmospheric-bg" />
      <div className="relative z-10 flex flex-col flex-1">
        {/* Header */}
        <header className="p-6 flex justify-between items-center relative z-50">
          <button onClick={prevStep} className="opacity-40 hover:opacity-100 transition-opacity flex items-center gap-1 group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-serif italic">Back</span>
          </button>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`h-1 rounded-full transition-all duration-700 ${s <= step ? (s === step ? "w-6 bg-accent" : "w-3 bg-accent/60") : "w-2 bg-accent/10"
                  }`}
              />
            ))}
          </div>
          <div className="w-12 text-xs font-medium opacity-40 uppercase tracking-[0.3em] sm:block hidden pointer-events-none">
            {step < 6 ? "Crafting" : "Complete"}
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-6 gap-8">

          {/* Left/Main Column: Selection UI */}
          <main className={`flex-1 flex flex-col items-center justify-center py-6 relative order-2 lg:order-1 transition-all duration-700 ${step === 6 ? 'lg:max-w-full' : 'lg:max-w-2xl'}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full flex flex-col items-center"
              >
                {step === 1 && (
                  <div className="text-center w-full">
                    <h2 className="text-4xl mb-3 font-serif italic text-rose-900">Choose your blooms</h2>
                    <p className="text-sm font-serif italic text-rose-800/40 mb-10">Select 6 to 10 flowers to form the soul of your gift.</p>

                    {/* Selection Tray */}
                    <div className="mb-10 p-5 bg-white/30 backdrop-blur-md rounded-[2.5rem] min-h-[90px] w-full flex flex-wrap gap-2.5 justify-center border border-white/40 shadow-sm transition-all">
                      {state.flowers.length === 0 && (
                        <span className="text-rose-900/40 text-sm flex items-center justify-center italic font-serif">Your floral basket awaits...</span>
                      )}
                      {state.flowers.map((fid, idx) => {
                        const f = FLOWERS.find(fl => fl.id === fid);
                        return (
                          <motion.div
                            key={`${fid}-${idx}`}
                            layoutId={`${fid}-${idx}`}
                            className="group relative w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center cursor-pointer border border-rose-50/50"
                          >
                            <img src={f?.src} alt={f?.name} className="w-8 h-8 object-contain" />
                            <button
                              onClick={(e) => { e.stopPropagation(); removeFlowerAt(idx); }}
                              className="absolute -top-1.5 -right-1.5 bg-rose-400 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            >
                              <span className="text-[10px] leading-none">×</span>
                            </button>
                            {idx > 0 && (
                              <button
                                onClick={() => swapFlowers(idx, idx - 1)}
                                className="absolute top-1/2 -left-2.5 -translate-y-1/2 bg-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-rose-100 shadow-sm"
                              >
                                <ChevronLeft size={12} className="text-rose-400" />
                              </button>
                            )}
                            {idx < state.flowers.length - 1 && (
                              <button
                                onClick={() => swapFlowers(idx, idx + 1)}
                                className="absolute top-1/2 -right-2.5 -translate-y-1/2 bg-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-rose-100 shadow-sm"
                              >
                                <ChevronRight size={12} className="text-rose-400" />
                              </button>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {FLOWERS.map((flower) => (
                        <motion.button
                          key={flower.id}
                          whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => addFlower(flower.id)}
                          className="bg-white/40 p-3 rounded-2xl flex flex-col items-center transition-colors border border-white/40"
                        >
                          <img src={flower.src} alt={flower.name} className="w-full aspect-square object-contain mb-1" />
                          <span className="text-[10px] font-medium text-rose-900/70">{flower.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="text-center w-full">
                    <h2 className="text-3xl mb-2 font-serif italic text-rose-900">Add greenery</h2>
                    <p className="text-sm text-rose-800/60 mb-8">Select 2 to 4 foliage elements</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {GREENERY.map((item) => {
                        const isSelected = state.greenery.includes(item.id);
                        return (
                          <motion.button
                            key={item.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleGreenery(item.id)}
                            className={`relative p-4 rounded-3xl transition-all duration-300 ${isSelected ? "bg-white shadow-xl ring-2 ring-accent" : "bg-white/40 hover:bg-white/60"
                              }`}
                          >
                            <img src={item.src} alt={item.name} className="w-full aspect-square object-contain mb-2" referrerPolicy="no-referrer" />
                            <span className="text-xs font-medium opacity-70 text-rose-900">{item.name}</span>
                            {isSelected && (
                              <div className="absolute top-2 right-2 bg-accent text-white rounded-full p-1">
                                <Check size={12} />
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="text-center w-full">
                    <h2 className="text-3xl mb-2 font-serif italic text-rose-900">Arrange & Perfect</h2>
                    <p className="text-sm text-rose-800/60 mb-6">Choose a style and swap flowers to perfection.</p>

                    {/* Arrangement Selection */}
                    <div className="grid grid-cols-3 gap-3 w-full mb-8">
                      {ARRANGEMENTS.map((arr) => (
                        <button
                          key={arr.id}
                          onClick={() => setState({ ...state, arrangement: arr.id })}
                          className={`p-3 rounded-2xl transition-all duration-300 flex flex-col items-center border ${state.arrangement === arr.id ? "bg-white shadow-lg border-accent" : "bg-white/40 border-transparent hover:bg-white/60"
                            }`}
                        >
                          <div className="relative w-10 h-10 bg-accent/5 rounded-full border border-accent/10 mb-1">
                            {arr.positions.slice(0, 5).map((p, i) => (
                              <div
                                key={i}
                                className="absolute w-1.5 h-1.5 bg-accent rounded-full"
                                style={{ left: `${50 + p.x / 3}%`, top: `${50 + p.y / 3}%`, transform: 'translate(-50%, -50%)' }}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-tighter text-rose-900">{arr.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* Reordering Interface (Swap positions) */}
                    <div className="bg-white/40 backdrop-blur-sm p-6 rounded-[2rem] border border-white/60">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-rose-900/40 mb-4">Fine-tune Placement</h3>
                      <div className="flex flex-wrap gap-3 justify-center">
                        {state.flowers.map((fid, idx) => {
                          const f = FLOWERS.find(fl => fl.id === fid);
                          return (
                            <motion.div
                              key={`${fid}-${idx}`}
                              layout
                              className="group relative flex flex-col items-center"
                            >
                              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center relative border border-accent/5">
                                <img src={f?.src} alt={f?.name} className="w-8 h-8 object-contain" />
                                <div className="absolute -top-2 -left-2 w-5 h-5 bg-rose-900 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                                  {idx + 1}
                                </div>
                              </div>

                              {/* Swap Controls */}
                              <div className="flex gap-1 mt-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                {idx > 0 && (
                                  <button
                                    onClick={() => swapFlowers(idx, idx - 1)}
                                    className="p-1 bg-white rounded-lg shadow-sm hover:bg-rose-50 border border-accent/10"
                                  >
                                    <ChevronLeft size={12} className="text-accent" />
                                  </button>
                                )}
                                {idx < state.flowers.length - 1 && (
                                  <button
                                    onClick={() => swapFlowers(idx, idx + 1)}
                                    className="p-1 bg-white rounded-lg shadow-sm hover:bg-rose-50 border border-accent/10"
                                  >
                                    <ChevronRight size={12} className="text-accent" />
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                      <p className="mt-4 text-[10px] text-rose-900/30 italic">Tip: Position 1 is the center focal point</p>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="text-center w-full">
                    <h2 className="text-3xl mb-2 font-serif italic text-rose-900">Select a wrap</h2>
                    <p className="text-sm text-rose-800/60 mb-8">The final touch</p>
                    <div className="flex flex-wrap justify-center gap-6">
                      {WRAPS.map((wrap) => (
                        <button
                          key={wrap.id}
                          onClick={() => setState({ ...state, wrap: wrap.id })}
                          className={`p-6 rounded-3xl transition-all duration-300 flex flex-col items-center border ${state.wrap === wrap.id ? "bg-white shadow-xl border-accent" : "bg-white/40 border-transparent hover:bg-white/60"
                            }`}
                        >
                          <img src={wrap.src} alt={wrap.name} className="w-24 h-24 object-contain mb-2" referrerPolicy="no-referrer" />
                          <span className="font-medium text-rose-900">{wrap.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="text-center w-full">
                    <h2 className="text-4xl mb-3 font-serif italic text-rose-900">Add your message</h2>
                    <p className="text-sm font-serif italic text-rose-800/40 mb-10">A few words to make the moment timeless.</p>

                    <div className="relative w-full max-w-md mx-auto">
                      <div className="relative bg-white p-10 lg:p-14 rounded-sm shadow-2xl border border-stone-100 rotate-[-0.5deg]">
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none grainy-bg" />

                        <textarea
                          value={state.message}
                          onChange={(e) => setState({ ...state, message: e.target.value })}
                          placeholder="Write something from the heart..."
                          className="w-full outline-none h-80 bg-transparent border-none focus:ring-0 text-3xl font-handwritten resize-none placeholder:text-stone-300 text-slate-800 relative z-10 leading-relaxed text-center overflow-y-auto"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="w-full max-w-6xl">
                    {/* Top Header */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center mb-16"
                    >
                      <h2 className="text-5xl font-serif italic text-rose-900 mb-3">Your gift is ready</h2>
                      <p className="text-sm font-serif italic text-rose-900/40">A small gesture, a lasting memory.</p>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
                      {/* Bouquet Section */}
                      <div className="relative group shrink-0">
                        <motion.div
                          className="absolute inset-0 bg-accent/20 rounded-full blur-[120px]"
                          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
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
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5, duration: 1 }}
                          className="relative w-full max-w-[340px] lg:-ml-8"
                        >
                          <NotebookMessage message={state.message} />
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Right Column: Live Preview (Visible in steps 1-5) */}
          {step < 6 && (
            <aside className="lg:w-80 w-full flex flex-col items-center order-1 lg:order-2 lg:sticky lg:top-24 h-fit">
              <div className="relative w-full aspect-[3/4] max-w-md bg-white/30 backdrop-blur-md rounded-[3rem] border border-white/50 shadow-sm flex items-center justify-center overflow-hidden">
                {/* Ambient Background for Preview */}
                <div className="absolute inset-0 bg-gradient-to-b from-rose-50/50 to-amber-50/50 pointer-events-none" />
                <div className="relative z-10 scale-75 transform origin-center">
                  <BouquetPreview state={state} size="md" />
                </div>
                <div className="absolute bottom-6 left-0 right-0 text-center">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-rose-900/30 font-bold">Live Preview</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 flex gap-4">
                <div className="text-center">
                  <p className="text-lg font-serif italic text-rose-900">{state.flowers.length}</p>
                  <p className="text-[10px] uppercase text-rose-900/40 font-bold">Flowers</p>
                </div>
                <div className="w-px h-8 bg-rose-900/10 self-center" />
                <div className="text-center">
                  <p className="text-lg font-serif italic text-rose-900">{state.greenery.length}</p>
                  <p className="text-[10px] uppercase text-rose-900/40 font-bold">Greenery</p>
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* Footer / Navigation */}
        <footer className="p-8 pb-12 flex flex-col items-center gap-3 relative z-50">
          {saveError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-rose-600 font-serif italic text-center max-w-xs"
            >
              {saveError}
            </motion.p>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextStep}
            disabled={
              isSaving ||
              (step === 1 && state.flowers.length < 6) ||
              (step === 2 && state.greenery.length < 2)
            }
            className={`px-16 py-5 rounded-full text-lg font-medium shadow-xl transition-all duration-300 min-w-[240px] flex items-center justify-center gap-3 ${isSaving ||
                (step === 1 && state.flowers.length < 6) ||
                (step === 2 && state.greenery.length < 2)
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200"
              }`}
          >
            {isSaving ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 size={20} />
                </motion.div>
                Saving…
              </>
            ) : step === 6 ? (
              "Send Bouquet"
            ) : (
              "Next Step"
            )}
          </motion.button>
        </footer>
      </div>
    </div>
  );
}
