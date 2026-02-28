import type { Timestamp } from "firebase/firestore";

export interface Deceased {
  id: string;          // Firestore Document ID
  plotId: string;      // Foreign key to the Plot
  name: string;
  deathDate: string;
  addedAt: Timestamp;       // Timestamp when the record was created
  // notes?: string;
}

export interface Plot {
  id: string;
  section: string;     // e.g., "Section A"
  row: string;         // e.g., "Row 12"
  number: string;      // e.g., "Grave 4"
  status: 'occupied' | 'reserved' | 'available';
}