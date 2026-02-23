import { db } from "../firebaseConfig";
import { 
  collection, doc, setDoc, getDoc, getDocs, 
  query, where, writeBatch, Timestamp 
} from "firebase/firestore";
import { PaymentService } from "./PaymentService";
import type { Reservation } from "../types/Reservation";

const STATUS_COL = "plotStatus";

/**
 * HELPER: Converts any date string to YYYY-MM-DD
 * This ensures "02/24/2026" becomes "2026-02-24"
 */
const normalizeDate = (dateStr: string): string => {
  if (!dateStr) return "";
  
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    
    // Check if we actually have 3 parts
    if (parts.length === 3) {
      const [m, d, y] = parts;

      // Prove to TypeScript that m, d, and y are strings and not empty
      if (m && d && y) {
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      }
    }
  }
  
  return dateStr;
};
export const ReserveService = {
  /**
   * RESERVE: Save reservation and trigger initial payment
   */
  async reserve(data: Omit<Reservation, 'created_at' | 'plotStatus'>, downPayment: number) {
    const plotRef = doc(db, STATUS_COL, data.plotId);
    
    // 1. CLEAN THE DATE HERE
    const cleanedDate = normalizeDate(data.scheduledDate);

    const reservationData: Reservation = {
      ...data,
      scheduledDate: cleanedDate, // Overwrite with clean date
      created_at: Timestamp.now(),
      plotStatus: 'Reserved'
    };

    // 2. Save Plot Status
    await setDoc(plotRef, reservationData);

    // 3. Process Initial Payment
    await PaymentService.processPayment(data.plotId, data.username, downPayment);

    return data.plotId;
  },

  /**
   * GET SINGLE: Fetch one reservation
   */
  async getByPlotId(plotId: string): Promise<Reservation | null> {
    const docRef = doc(db, STATUS_COL, plotId);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as Reservation) : null;
  },

  /**
   * GET ALL: Fetch every reservation in the cemetery
   */
  async getAllReservations(): Promise<Reservation[]> {
    const snap = await getDocs(collection(db, STATUS_COL));
    return snap.docs.map(doc => doc.data() as Reservation);
  },

  /**
   * PURGE: The "Reset Plot" button. 
   * Deletes all linked data across 4 collections atomically.
   */
  async purgePlotData(plotId: string) {
    const batch = writeBatch(db);

    // 1. Find all related documents in sub-collections
    const deceasedQuery = query(collection(db, "deceased"), where("plotId", "==", plotId));
    const paymentQuery = query(collection(db, "payment"), where("plotId", "==", plotId));
    
    const [deceasedSnap, paymentSnap] = await Promise.all([
      getDocs(deceasedQuery),
      getDocs(paymentQuery)
    ]);

    // 2. Add sub-collection deletions to batch
    deceasedSnap.forEach(d => batch.delete(d.ref));
    paymentSnap.forEach(p => batch.delete(p.ref));

    // 3. Add main document deletions to batch
    batch.delete(doc(db, "bills", plotId));
    batch.delete(doc(db, STATUS_COL, plotId));

    // 4. Commit all at once
    await batch.commit();
  },

  async checkAndAutoOccupy() {
    const today = new Date().toISOString().split('T')[0]; // Gets "YYYY-MM-DD"
    const batch = writeBatch(db);
    
    // 1. Find all Reserved plots where the date is today or earlier
    const q = query(
      collection(db, STATUS_COL),
      where("plotStatus", "==", "Reserved"),
      where("scheduledDate", "<=", today)
    );

    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("No pending transitions found.");
      return 0;
    }

    // 2. Add each plot to the batch update
    querySnapshot.forEach((document) => {
      const plotRef = doc(db, STATUS_COL, document.id);
      batch.update(plotRef, { plotStatus: "Occupied" });
    });

    // 3. Commit the changes
    await batch.commit();
    console.log(`Auto-updated ${querySnapshot.size} plots to Occupied.`);
    return querySnapshot.size;
  }
};