import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
 apiKey: "AIzaSyAgPvTH-0FDbFYIstOpyd9l_2lym-ap0xk",
  authDomain: "interview-c67e0.firebaseapp.com",
  projectId: "interview-c67e0",
  storageBucket: "interview-c67e0.firebasestorage.app",
  messagingSenderId: "690683423646",
  appId: "1:690683423646:web:a2db93320b752a3141848f",
  measurementId: "G-NWCJFLYB0B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage, analytics };