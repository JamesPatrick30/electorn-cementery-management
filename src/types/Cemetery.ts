export interface Deceased {
  id: string;          // Firestore Document ID
  plotId: string;      // Foreign key to the Plot
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  dateOfDeath: string;
  intermentDate: string;
  notes?: string;
}

export interface Plot {
  id: string;
  section: string;     // e.g., "Section A"
  row: string;         // e.g., "Row 12"
  number: string;      // e.g., "Grave 4"
  status: 'occupied' | 'reserved' | 'available';
}