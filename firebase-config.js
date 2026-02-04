/**
 * ------------------------------------------------------------------
 * NIGOH PROJECT - FIREBASE CONFIGURATION
 * ------------------------------------------------------------------
 * Bu fayl loyihaning "Yuragi" hisoblanadi.
 * Barcha Autentifikatsiya va Baza (Firestore) operatsiyalari shu yerdan boshqariladi.
 */

// 1. KUTUBXONALARNI IMPORT QILISH (CDN ORQALI)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

// Autentifikatsiya (Kirish, Chiqish, Ro'yxatdan o'tish)
import { 
    getAuth, 
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged, 
    signOut, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    updateProfile,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Firestore Database (Ma'lumotlarni saqlash, o'qish, o'chirish)
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    setDoc,
    getDoc,
    updateDoc, 
    deleteDoc, // O'chirish funksiyasi
    query,
    where,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ------------------------------------------------------------------
// 2. FIREBASE SOZLAMALARI (SIZNING KODINGIZDAN OLINDI)
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
const provider = new GoogleAuthProvider();

// 4. FUNKSIYALARNI EXPORT QILISH (Boshqa fayllar ishlata olishi uchun)
export { 
    // Asosiy obyektlar
    auth, 
    db, 
    provider,

    // Auth funksiyalari
    onAuthStateChanged, 
    signOut, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    updateProfile,
    signInWithPopup,
    sendPasswordResetEmail,

    // Database funksiyalari
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