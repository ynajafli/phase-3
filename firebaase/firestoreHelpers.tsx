import { db } from "./config";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Save user data to Firestore
export const saveUserProfile = async (uid: string, data: any) => {
  try {
    await setDoc(doc(db, "users", uid), data, { merge: true });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Read user data from Firestore
export const getUserProfile = async (uid: string) => {
  try {
    const docRef = doc(db, "users", uid);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      return { data: snapshot.data(), error: null };
    } else {
      return { data: null, error: "User not found" };
    }
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};
