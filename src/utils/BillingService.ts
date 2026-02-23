import { db } from "../firebaseConfig";
import { 
  doc, setDoc, getDoc, updateDoc, 
  collection, query, where, getDocs, 
  increment, writeBatch 
} from "firebase/firestore";
import type { Bill } from "../types/Billing"; // Define this interface in your types folder

const BILLS_COL = "bills";

export const BillingService = {
  /**
   * CREATE: Setup initial contract
   */
  async createBillInfo(plotId: string, totalPrice: number, downPayment: number, monthsTerm: number) {
    const remainingBalance = totalPrice - downPayment;
    const status = totalPrice === downPayment ? "paid" : "active";

    const billData: Bill = {
      plotId,
      totalPrice,
      downPayment,
      monthsTerm,
      remainingBalance,
      status
    };

    await setDoc(doc(db, BILLS_COL, plotId), billData);
  },

  /**
   * READ & CALCULATE: Get monthly dues
   */
  async getMonthlyDues(plotId: string) {
    const docSnap = await getDoc(doc(db, BILLS_COL, plotId));
    
    if (!docSnap.exists()) throw new Error("No billing record found.");

    const data = docSnap.data() as Bill;
    const monthlyAmount = (data.totalPrice - data.downPayment) / data.monthsTerm;

    return {
      monthlyAmount,
      remainingBalance: data.remainingBalance,
      data
    };
  },

  /**
   * UPDATE: Deduct payment and verify completion
   * Uses an Atomic Increment for data safety
   */
  async processPaymentDeduction(plotId: string, amountPaid: number) {
    const billRef = doc(db, BILLS_COL, plotId);

    // 1. Deduct from balance
    await updateDoc(billRef, {
      remainingBalance: increment(-amountPaid)
    });

    // 2. Verify if fully paid
    await this.verifyAndCompletePayment(plotId);
  },

  /**
   * VERIFY: Checks total payments vs target price
   */
  async verifyAndCompletePayment(plotId: string) {
    const billSnap = await getDoc(doc(db, BILLS_COL, plotId));
    if (!billSnap.exists()) return;

    const { totalPrice } = billSnap.data() as Bill;

    // Fetch all payments for this plot
    const q = query(collection(db, "payment"), where("plotId", "==", plotId));
    const paymentSnap = await getDocs(q);
    
    let totalPaid = 0;
    paymentSnap.forEach(p => totalPaid += (p.data().price || 0));

    if (totalPaid >= totalPrice) {
      await this.markAsFullyPaid(plotId);
    }
  },

  /**
   * FINAL STATUS UPDATE: Updates multiple collections using a Batch
   */
  async markAsFullyPaid(plotId: string) {
    const batch = writeBatch(db);

    // Update Bill
    const billRef = doc(db, BILLS_COL, plotId);
    batch.update(billRef, { status: "paid", remainingBalance: 0 });

    // Update Plot Status (using a more direct doc reference if possible)
    const plotQuery = query(collection(db, "plotStatus"), where("plotId", "==", plotId));
    const plotSnap = await getDocs(plotQuery);
    
    plotSnap.forEach(plotDoc => {
      batch.update(plotDoc.ref, { plotStatus: "Fully Paid" });
    });

    await batch.commit();
    console.log(`Plot ${plotId} is now officially Fully Paid!`);
  }
};