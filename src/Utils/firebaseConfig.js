
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore, collection} from "firebase/firestore"

const firebaseConfig = {
  apiKey:import.meta.env.VITE_REACT_APP_FB_API_KEY,
  authDomain: "meet-now-8e61e.firebaseapp.com",
  projectId: "meet-now-8e61e",
  storageBucket: "meet-now-8e61e.appspot.com",
  messagingSenderId: "402882854831",
  appId: "1:402882854831:web:fd31822f3b59aaaaeff95a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth=getAuth(app);
export const db=getFirestore(app);

export const usersRef = collection(db, "users");
export const meetingsRef = collection(db, "meetings");

