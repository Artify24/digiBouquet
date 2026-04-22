import { Flower, Greenery, Wrap, Arrangement } from "./types";

export const FLOWERS: Flower[] = [
  { id: "carnation", src: "/assets/flower1.png", name: "Blush Carnation" },
  { id: "anemone", src: "/assets/flower2.png", name: "Soft Anemone" },
  { id: "tulip", src: "/assets/flower3.png", name: "Spring Tulip" },
  { id: "peony", src: "/assets/flower4.png", name: "Velvet Peony" },
  { id: "daisy", src: "/assets/flower5.png", name: "Wild Daisy" },
  { id: "sunflower", src: "/assets/flower6.png", name: "Golden Sunflower" },
  { id: "rose", src: "/assets/flower7.png", name: "Classic Rose" },
  { id: "small_flower", src: "/assets/flower8.png", name: "Petite Bloom" },
];

export const GREENERY: Greenery[] = [
  { id: "g1", src: "/assets/greenary1.png", name: "Eucalyptus" },
  { id: "g2", src: "/assets/greenary2.png", name: "Silver Dollar" },
  { id: "g3", src: "/assets/greenary3.png", name: "Wild Grass" },
  { id: "g4", src: "/assets/greenary4.png", name: "Fern Frond" },
  { id: "g5", src: "/assets/greenary5.png", name: "Olive Branch" },
  { id: "g6", src: "/assets/greenary6.png", name: "Ruscus" },
];

export const WRAPS: Wrap[] = [
  { id: "kraft", src: "/assets/wraper.png", name: "Kraft Paper" },
  { id: "bow", src: "/assets/wrapper2.png", name: "Silk Ribbon" },
];

// ─── Arrangement positions ────────────────────────────────────────────────────
// Origin (0, 0) = floralY inside the wrap opening.
// NEGATIVE y  → moves the flower UP   (toward tips of bouquet)  ✓ correct
// POSITIVE y  → moves the flower DOWN (into the wrap)            use sparingly
// Flowers should mostly cluster in negative-y space (above the wrap opening).
export const ARRANGEMENTS: Arrangement[] = [
  {
    id: "classic",
    name: "Classic",
    positions: [
    { x: 0, y: -90, scale: 1.35, rotate: 0 },      // Center focal

    { x: -60, y: -75, scale: 1.15, rotate: -12 },  // Left front
    { x: 60, y: -75, scale: 1.15, rotate: 12 },    // Right front

    { x: 0, y: -150, scale: 1.0, rotate: 0 },      // Top peak

    { x: -90, y: -115, scale: 1.0, rotate: -20 },  // Upper left
    { x: 90, y: -115, scale: 1.0, rotate: 20 },    // Upper right

    { x: -120, y: -65, scale: 0.9, rotate: -30 },  // Far left
    { x: 120, y: -65, scale: 0.9, rotate: 30 },    // Far right

    { x: -40, y: -35, scale: 0.85, rotate: -8 },   // Bottom left tuck
    { x: 40, y: -35, scale: 0.85, rotate: 8 },     // Bottom right tuck
  ],
  },
  {
    id: "wild",
    name: "Wild",
    positions: [
  { x: -20, y: -90, scale: 1.35, rotate: -5 },   // Primary focal (more centered)

  { x: 45, y: -75, scale: 1.2, rotate: 15 },     // Secondary right

  { x: -5, y: -155, scale: 0.95, rotate: 0 },    // Top center (connected now)

  { x: 65, y: -135, scale: 0.9, rotate: 25 },    // Top right airy

  { x: -80, y: -115, scale: 1.0, rotate: -25 },  // Left spread (reduced heaviness)

  { x: 75, y: -55, scale: 1.05, rotate: 35 },    // Right spill (less aggressive)

  { x: -105, y: -60, scale: 0.95, rotate: -35 }, // Left spill balanced

  { x: 5, y: -45, scale: 0.95, rotate: 0 },      // Base center (important anchor)

  { x: -45, y: -140, scale: 0.85, rotate: -10 }, // Back fill left

  { x: 25, y: -185, scale: 0.8, rotate: 10 },    // Highest accent (clean top)
],
  },
  {
  id: "round",
  name: "Round",
  positions: [
 { x: 0, y: -75, scale: 1.4, rotate: 0 },        // Center (anchor)

  { x: -80, y: -95, scale: 1.15, rotate: -18 },   // Left front (more spread)
 { x: 95, y: -90, scale: 1.15, rotate: 18 },      // Right front

  { x: 0, y: -170, scale: 1.05, rotate: 0 },      // Top (higher dome)

  { x: -120, y: -65, scale: 1.0, rotate: -30 },   // Mid left (wider)
  { x: 120, y: -65, scale: 1.0, rotate: 30 },     // Mid right

  { x: -90, y: -125, scale: 1.05, rotate: -20 },  // Upper left
 { x: 70, y: -140, scale: 1.05, rotate: 20 },   // Upper right

  { x: -50, y: -20, scale: 0.9, rotate: -10 },    // Bottom left tuck
  { x: 60, y: -10, scale: 0.9, rotate: 10 },       // Bottom right tuck
],
},
];
