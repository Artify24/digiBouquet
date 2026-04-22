export interface Flower {
  id: string;
  src: string;
  name: string;
}

export interface Greenery {
  id: string;
  src: string;
  name: string;
}

export interface Wrap {
  id: string;
  src: string;
  name: string;
}

export interface Arrangement {
  id: string;
  name: string;
  positions: { x: number; y: number; scale: number; rotate: number }[];
}

export interface BouquetState {
  flowers: string[]; // IDs
  greenery: string[]; // IDs
  arrangement: string; // ID
  wrap: string; // ID
  message: string;
}
