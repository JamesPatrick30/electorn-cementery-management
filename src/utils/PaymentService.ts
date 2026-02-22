import { db } from "../firebaseConfig";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  orderBy, 
  Timestamp 
} from "firebase/firestore";

const COLLECTION_NAME = "payment";

export const PaymentService = {
  /**
   * 1. Get Summary: Replaces getPaymentSummary
   * Uses reduce() to calculate total and find the latest date in one pass.
   */
  async getPaymentSummary(plotId: string) {
    const q = query(collection(db, COLLECTION_NAME), where("plotId", "==", plotId));
    const snapshot = await getDocs(q);

    return snapshot.docs.reduce((acc, doc) => {
      const data = doc.data();
      
      // Accumulate Total
      acc.totalPaid += (data.price || 0);

      // Find Furthest Next Due Date
      const nextDue = data.nextDueDate?.toDate();
      if (nextDue && (!acc.latestDueDate || nextDue > acc.latestDueDate)) {
        acc.latestDueDate = nextDue;
      }

      return acc;
    }, { totalPaid: 0, latestDueDate: null as Date | null });
  },

  /**
   * 2. Get All Records: Replaces getAllPayments
   */
  async getAllPayments(plotId: string) {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("plotId", "==", plotId),
      orderBy("lastPaymentDate", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  /**
   * 3. Pay Function: Replaces pay
   * Handles the "Add 1 month" logic using native JavaScript
   */
  async processPayment(plotId: string, name: string, price: number) {
    const lastPaymentDate = new Date();
    
    // Calculate Next Due Date (Last Payment + 1 Month)
    const nextDueDate = new Date();
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);

    const paymentData = {
      plotId,
      name,
      price,
      lastPaymentDate: Timestamp.fromDate(lastPaymentDate),
      nextDueDate: Timestamp.fromDate(nextDueDate),
      status: "paid"
    };

    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), paymentData);
      console.log("Payment Recorded: ", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Payment Failed: ", error);
      throw error;
    }
  }
};