// Firebase SDK larini import qilamiz
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    updateProfile, 
    sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import { 
    getFirestore, 
    collection, 
    addDoc, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    deleteDoc, // <-- MANA SHU YETISHMAYOTGAN EDI
    query, 
    where, 
    getDocs, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Sizning loyihangiz sozlamalari
const firebaseConfig = {
  apiKey: "AIzaSyCrn_NMDxZRjU0tToRnZCdqx9CEef_mwuk",
  authDomain: "studio-1879510232-1b0ed.firebaseapp.com",
  projectId: "studio-1879510232-1b0ed",
  storageBucket: "studio-1879510232-1b0ed.firebasestorage.app",
  messagingSenderId: "921358775126",
  appId: "1:921358775126:web:4f2d183feb17b50f1edcf7"
};

// Firebaseni ishga tushirish
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Barcha kerakli funksiyalarni eksport qilamiz
export { 
    auth, 
    db, 
    provider, 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    updateProfile, 
    sendPasswordResetEmail,
    collection, 
    addDoc, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc,
    deleteDoc, // <-- BU HAM EKSPORT BO'LISHI SHART
    query,
    where,
    getDocs,
    orderBy 
};