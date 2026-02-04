/**
 * ------------------------------------------------------------------
 * NIGOH PROJECT - FIREBASE CONFIGURATION (FIXED EXPORTS)
 * ------------------------------------------------------------------
 */

// 1. KUTUBXONALARNI IMPORT QILISH
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

// Autentifikatsiya (Auth)
import { 
    getAuth, 
    GoogleAuthProvider, // <-- Bu yerda bor
    signInWithPopup,
    onAuthStateChanged, 
    signOut, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    updateProfile,
    sendPasswordResetEmail,
    updatePassword, 
    deleteUser      
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Firestore Database (Baza)
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    setDoc,
    getDoc,
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ------------------------------------------------------------------
// 2. FIREBASE SOZLAMALARI
// ------------------------------------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyCrn_NMDxZRjU0tToRnZCdqx9CEef_mwuk",
    authDomain: "studio-1879510232-1b0ed.firebaseapp.com",
    projectId: "studio-1879510232-1b0ed",
    storageBucket: "studio-1879510232-1b0ed.firebasestorage.app",
    messagingSenderId: "921358775126",
    appId: "1:921358775126:web:4f2d183feb17b50f1edcf7"
};

// 3. ILOVANI ISHGA TUSHIRISH
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider(); // Bu kerak bo'lishi mumkin

// 4. FUNKSIYALARNI EKSPORT QILISH
export { 
    // Asosiy
    auth, 
    db, 
    provider,

    // Auth Class & Funksiyalari
    GoogleAuthProvider, // <-- MUHIM: BU QATOR QO'SHILDI!
    signInWithPopup,
    onAuthStateChanged, 
    signOut, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    updateProfile,
    sendPasswordResetEmail,
    updatePassword, 
    deleteUser,     

    // Database Funksiyalari
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    setDoc,
    getDoc,
    updateDoc, 
    deleteDoc, 
    query,
    where,
    orderBy
};