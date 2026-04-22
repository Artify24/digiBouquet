import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { FLOWERS } from "../constants";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center grainy-bg overflow-hidden relative">
      <div className="atmospheric-bg" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute top-12 z-10"
      >
        <span className="text-sm tracking-[0.3em] uppercase font-medium opacity-60">Digibouquet</span>
      </motion.div>

      <div className="relative w-64 h-64 mb-12 z-10">
        <motion.div
          className="absolute inset-0 bg-accent/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src={FLOWERS[6].src} // Rose
          alt="Floating Flower"
          className="w-full h-full object-contain relative z-10"
          animate={{
            y: [-10, 10, -10],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          referrerPolicy="no-referrer"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="max-w-md relative z-10"
      >
        <h1 className="text-5xl md:text-6xl mb-6 leading-[1.1] font-serif italic text-rose-950">
          Craft a gift that speaks for you
        </h1>
        <p className="text-lg opacity-50 mb-10 font-serif italic text-rose-900">
          A small gesture. A lasting memory.
        </p>

        <Link to="/create">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-rose-500 hover:bg-rose-600 text-white px-10 py-5 rounded-full text-lg font-medium shadow-xl shadow-rose-200 transition-colors"
          >
            Create your bouquet
          </motion.button>
        </Link>

        <p className="mt-8 text-xs uppercase tracking-widest opacity-30 font-bold">
          Free to send • No sign up
        </p>
      </motion.div>
    </div>
  );
}
