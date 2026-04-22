import { motion } from "motion/react";
import { FLOWERS, GREENERY, WRAPS, ARRANGEMENTS } from "../constants";
import { BouquetState } from "../types";

interface BouquetPreviewProps {
  state: BouquetState;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
}

export default function BouquetPreview({
  state,
  size = "md",
  interactive = false,
}: BouquetPreviewProps) {
  const arrangement =
    ARRANGEMENTS.find((a) => a.id === state.arrangement) || ARRANGEMENTS[0];
  const wrap = WRAPS.find((w) => w.id === state.wrap) || WRAPS[0];

  const scaleMap = {
    sm: 0.6,
    md: 0.9,
    lg: 1.2,
  };

  const baseScale = scaleMap[size];

  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      style={{ width: 450 * baseScale, height: 550 * baseScale }}
    >
      {/* Wrap (Back) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 120 * baseScale, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        style={{ zIndex: 5 }}
      >
        <img
          src={wrap.src}
          alt={wrap.name}
          className="w-full h-full object-contain scale-[1.5] "
          style={{opacity:0.4}}
        />
      </motion.div>

      {/* Greenery */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 10 }}
      >
        {state.greenery.map((greeneryId, i) => {
          const g = GREENERY.find((item) => item.id === greeneryId);
          if (!g) return null;

          const angle =
            (i * (160 / Math.max(1, state.greenery.length - 1))) - 80;

          return (
            <motion.img
              key={`${g.id}-${i}`}
              src={g.src}
              className="absolute opacity-60 drop-shadow-sm"
              style={{
                width: 380 * baseScale,
                height: 380 * baseScale,
                transform: `rotate(${angle}deg) translateY(${-80 * baseScale}px)`,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 1 }}
            />
          );
        })}
      </div>

      {/* Background Flowers */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 15 }}
      >
        {state.flowers.map((flowerId, i) => {
          if (i < 5) return null;

          const flower = FLOWERS.find((f) => f.id === flowerId);
          if (!flower) return null;

          const pos =
            arrangement.positions[
              i === 0 ? 0 : i % arrangement.positions.length
            ];

          return (
            <motion.img
              key={`${flowerId}-${i}-bg`}
              src={flower.src}
              className="absolute drop-shadow-sm brightness-90"
              style={{
                width: 130 * baseScale * pos.scale,
                height: 130 * baseScale * pos.scale,
                left: `calc(50% + ${pos.x * baseScale - 60 * baseScale}px)`,
                top: `calc(50% + ${pos.y * baseScale}px)`,
                transform: `translate(-50%, -50%) rotate(${pos.rotate}deg)`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.05, duration: 0.8 }}
            />
          );
        })}
      </div>

      {/* Foreground Flowers */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 25 }}
      >
        {state.flowers.map((flowerId, i) => {
          if (i >= 5) return null;

          const flower = FLOWERS.find((f) => f.id === flowerId);
          if (!flower) return null;

          const pos =
            arrangement.positions[
              i === 0 ? 0 : i % arrangement.positions.length
            ];

          return (
            <motion.img
              key={`${flowerId}-${i}-fg`}
              src={flower.src}
              className="absolute drop-shadow-md"
              style={{
                width: 150 * baseScale * pos.scale,
                height: 150 * baseScale * pos.scale,
                left: `calc(50% + ${pos.x * baseScale - 60 * baseScale}px)`,
                top: `calc(50% + ${pos.y * baseScale}px)`,
                transform: `translate(-50%, -50%) rotate(${pos.rotate}deg)`,
              }}
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: 0.7 + i * 0.05,
                type: "spring",
                stiffness: 60,
                damping: 18,
              }}
            />
          );
        })}
      </div>

      {/* Floating Effect */}
      {interactive && (
        <motion.div
          className="absolute inset-0"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 1, 0, -1, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.div>
  );
}