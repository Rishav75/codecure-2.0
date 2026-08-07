import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// The config will be injected automatically or we can read from process.env if available, 
// but Firebase in AI Studio injects `firebase-applet-config.json`.
// We will fetch it dynamically.

let auth: any = null;
let db: any = null;
let googleProvider: any = null;

export const initFirebase = async () => {
  try {
    const res = await fetch('/firebase-applet-config.json');
    if (!res.ok) throw new Error("Could not load Firebase config");
    const config = await res.json();
    const app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } catch (e) {
    console.error("Firebase initialization failed:", e);
  }
};

export { auth, db, googleProvider };
