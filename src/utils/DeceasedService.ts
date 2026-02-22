import { db } from "../firebaseConfig";
import { 
  collection, doc, getDocs, query, where, 
  updateDoc, deleteDoc, setDoc, collectionGroup 
} from "firebase/firestore";
import type { Deceased } from "../types/Cemetery";

const DECEASED_COLLECTION = "deceased";

export const DeceasedService = {
  
  /**
   * Fetch all deceased individuals in a specific plot
   * Equivalent to your getDeceasedByPlot Java method
   */
  async getByPlot(plotId: string): Promise<Deceased[]> {
    const q = query(
      collection(db, DECEASED_COLLECTION), 
      where("plotId", "==", plotId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Deceased));
  },

  /**
   * Registers a new deceased person and updates the Plot status
   */
  async addDeceased(deceasedData: Omit<Deceased, 'id'>): Promise<string> {
    const newDocRef = doc(collection(db, DECEASED_COLLECTION));
    const id = newDocRef.id;

    // Save deceased record
    await setDoc(newDocRef, { ...deceasedData, id });

    // Business Logic: You might want to automatically update the Plot status here
    // await PlotService.updateStatus(deceasedData.plotId, 'occupied');

    return id;
  },

  /**
   * Updates details (e.g., correcting a name or date)
   */
  async update(id: string, updates: Partial<Deceased>): Promise<void> {
    const docRef = doc(db, DECEASED_COLLECTION, id);
    await updateDoc(docRef, updates);
  },

  /**
   * Removes record (Permanent deletion)
   */
  async delete(id: string): Promise<void> {
    const docRef = doc(db, DECEASED_COLLECTION, id);
    await deleteDoc(docRef);
  }
};