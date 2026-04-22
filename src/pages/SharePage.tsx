import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import QRCode from "qrcode";
import { Check, Copy, Download, Flower2, ArrowLeft } from "lucide-react";

interface ShareLocationState {
  slug: string;
}

export default function SharePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ShareLocationState | null;

  const slug = state?.slug;
  const shareUrl = slug
    ? `${window.location.origin}${window.location.pathname.replace(/\/?$/, "/")}#/b/${slug}`
    : "";

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [svgString, setSvgString] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [qrReady, setQrReady] = useState(false);

  // Redirect if accessed directly with no slug
  useEffect(() => {
    if (!slug) {
      navigate("/", { replace: true });
    }
  }, [slug, navigate]);

  // Generate QR code as SVG
  useEffect(() => {
    if (!shareUrl) return;

    QRCode.toString(shareUrl, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 2,
      color: {
        dark: "#9f1239", // rose-800 — soft, matches brand
        light: "#fdf6f0", // warm off-white background
      },
      width: 280,
    })
      .then((svg: string) => {
        // Round the modules: inject rx/ry on every <rect> that isn't the background
        const rounded = svg.replace(
          /<rect([^/]*?)(?:\/>|><\/rect>)/g,
          (match, attrs) => {
            // Skip the large background rect (has width="280" or similar large value)
            if (/width="[2-9]\d{1,2}"/.test(attrs)) return match;
            return `<rect${attrs} rx="2" ry="2"/>`;
          }
        );
        setSvgString(rounded);
        setQrReady(true);
      })
      .catch(console.error);
  }, [shareUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownloadQR = () => {
    if (!svgString) return;

    // Add a white background and some padding for the download
    const fullSvg = svgString.replace(
      "<svg ",
      `<svg xmlns="http://www.w3.org/2000/svg" style="background:#fdf6f0;padding:16px;border-radius:20px;" `
    );

    const blob = new Blob([fullSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `digibouquet-${slug}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!slug) return null;

  return (
    <div className="min-h-screen grainy-bg flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="atmospheric-bg" />

      {/* Floating petals background */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none select-none text-2xl opacity-20"
          initial={{ x: Math.random() * 100 - 50 + "%", y: "-10%" }}
          animate={{
            y: "110%",
            x: `calc(${Math.random() * 100 - 50}% + ${Math.sin(i) * 30}px)`,
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "linear",
          }}
          style={{ left: `${10 + i * 15}%` }}
        >
          🌸
        </motion.div>
      ))}

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="self-start mb-8"
        >
          <Link
            to="/preview"
            className="flex items-center gap-1.5 text-sm font-serif italic text-rose-900/40 hover:text-rose-900 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to preview
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-rose-100/60 border border-rose-200/60 text-rose-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5 backdrop-blur-sm">
            <Flower2 size={12} />
            Bouquet Sent
          </div>
          <h1 className="text-4xl font-serif italic text-rose-900 mb-2">
            Share your bouquet
          </h1>
          <p className="text-sm font-serif italic text-rose-900/50">
            Anyone with this link can open your gift
          </p>
        </motion.div>

        {/* QR Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/80 shadow-2xl shadow-rose-200/40 p-8 w-full flex flex-col items-center gap-6"
        >
          {/* QR Code */}
          <div className="relative">
            <AnimatePresence>
              {qrReady && svgString ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  {/* QR SVG */}
                  <div
                    className="rounded-2xl overflow-hidden border-4 border-rose-100"
                    style={{ background: "#fdf6f0" }}
                    dangerouslySetInnerHTML={{ __html: svgString }}
                  />

                  {/* Flower icon overlay in center */}
                  <div
                    className="absolute flex items-center justify-center"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 44,
                      height: 44,
                      background: "#fdf6f0",
                      borderRadius: "50%",
                      border: "2px solid #fecdd3",
                    }}
                  >
                    <span className="text-xl leading-none select-none">✿</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-[280px] h-[280px] rounded-2xl bg-rose-50/60 flex items-center justify-center border-4 border-rose-100"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="text-3xl"
                  >
                    🌸
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Caption */}
          <p className="text-xs uppercase tracking-[0.25em] text-rose-900/40 font-bold">
            Scan to open your bouquet
          </p>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />

          {/* Link field */}
          <div className="w-full">
            <p className="text-[10px] uppercase tracking-widest text-rose-900/40 font-bold mb-2 text-center">
              Shareable Link
            </p>
            <div className="flex items-center gap-2 bg-rose-50/80 border border-rose-200/60 rounded-2xl px-4 py-3">
              <span className="text-xs text-rose-800/70 truncate flex-1 font-mono">
                {shareUrl}
              </span>
              <button
                onClick={handleCopy}
                className="shrink-0 flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-1"
                    >
                      <Check size={12} />
                      Copied
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-1"
                    >
                      <Copy size={12} />
                      Copy
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 bg-rose-500 text-white py-4 rounded-2xl font-medium shadow-lg shadow-rose-200 hover:bg-rose-600 transition-colors"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Link Copied!" : "Copy Link"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDownloadQR}
              disabled={!qrReady}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-rose-700 py-4 rounded-2xl font-medium shadow-md border border-rose-100 hover:shadow-lg hover:border-rose-200 transition-all disabled:opacity-40"
            >
              <Download size={16} />
              Download QR
            </motion.button>
          </div>
        </motion.div>

        {/* Footer links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex gap-6 mt-8"
        >
          <Link
            to="/create"
            className="text-sm font-serif italic text-rose-900/40 hover:text-rose-900 transition-colors"
          >
            Create another bouquet
          </Link>
          <Link
            to="/"
            className="text-sm font-serif italic text-rose-900/40 hover:text-rose-900 transition-colors"
          >
            Go home
          </Link>
        </motion.div>
      </div>

      {/* Hidden canvas (unused but kept for potential PNG fallback) */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
