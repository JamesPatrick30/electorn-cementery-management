import { db } from "../firebaseConfig"; // make sure path is correct
import { collection, query, where, getDocs, limit } from "firebase/firestore";

export const AuthService = {
  async login(email: string, password: string): Promise<string> {
    try {
      const usersRef = collection(db, "users"); // db must be Firestore instance
      const q = query(
        usersRef,
        where("email", "==", email),
        where("password", "==", password),
        limit(1)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return "Login Successful";
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error: any) {
      console.error("Firestore Error logging user:", error);
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
};