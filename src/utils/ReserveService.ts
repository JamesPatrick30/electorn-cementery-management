import { db } from "../firebaseConfig";
import { 
  collection, doc, setDoc, getDoc, getDocs, 
  query, where, writeBatch, Timestamp 
} from "firebase/firestore";
import { PaymentService } from "./PaymentService"; // Replaces paymentAdaptor
import type { Reservation } from "../types/Reservation";
const STATUS_COL = "plotStatus";

export const ReserveService = {
  /**
   * RESERVE: Save reservation and trigger initial payment
   */
  async reserve(data: Omit<Reservation, 'created_at' | 'plotStatus'>, downPayment: number) {
    const plotRef = doc(db, STATUS_COL, data.plotId);
    
    const reservationData: Reservation = {
      ...data,
      created_at: Timestamp.now(),
      plotStatus: 'Reserved'
    };

    // 1. Save Plot Status
    await setDoc(plotRef, reservationData);

    // 2. Process Initial Payment (Downpayment)
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
  }
};