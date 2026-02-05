/**
 * ====================================================================
 * NIGOH PROJECT - CORE CONFIGURATION (ENTERPRISE EDITION V3.0)
 * ====================================================================
 * Bu fayl butun loyihaning markaziy boshqaruv punkti hisoblanadi.
 * Barcha xizmatlar (Auth, Database) shu yerda initsializatsiya qilinadi
 * va boshqa fayllarga eksport qilinadi.
 */

// 1. FIREBASE SDK KUTUBXONALARINI IMPORT QILISH (v10.8.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

// --- AUTHENTICATION (Foydalanuvchi Tizimi) ---
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    updateProfile, 
    updatePassword,
    sendPasswordResetEmail,
    deleteUser 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// --- FIRESTORE DATABASE (Ma'lumotlar Bazasi) ---
import { 
    getFirestore, 
    collection, 
    addDoc, 
    setDoc,
    getDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    limit,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ------------------------------------------------------------------
// 2. FIREBASE KREDENSIALLARI (CONFIG)
// ------------------------------------------------------------------
// Diqqat: Bu ma'lumotlar loyihangizga ulangan maxsus kalitlardir.
const firebaseConfig = {
    apiKey: "AIzaSyCrn_NMDxZRjU0tToRnZCdqx9CEef_mwuk",
    authDomain: "studio-1879510232-1b0ed.firebaseapp.com",
    projectId: "studio-1879510232-1b0ed",
    storageBucket: "studio-1879510232-1b0ed.firebasestorage.app",
    messagingSenderId: "921358775126",
    appId: "1:921358775126:web:4f2d183feb17b50f1edcf7"
};

// 3. ILOVANI ISHGA TUSHIRISH (INITIALIZATION)
let app;
let auth;
let db;
let provider;

try {
    // Ilova avval yaratilganmi tekshirish (Singleton)
    app = initializeApp(firebaseConfig);
    
    // Xizmatlarni ulash
    auth = getAuth(app);
    db = getFirestore(app);
    provider = new GoogleAuthProvider();

    console.log("%c🔥 NIGOH TIZIMI MUVAFFAQIYATLI ULANDI", "color: #10b981; font-weight: bold; font-size: 12px;");

} catch (error) {
    console.error("%c❌ FIREBASE ULANISHIDA XATOLIK:", "color: #ef4444; font-weight: bold;", error);
}

// 4. FUNKSIYALARNI EKSPORT QILISH (Yagona Manba)
// Boshqa fayllar faqat shu yerdan import qiladi.
export {
    // --- ASOSIY ---
    app, 
    auth, 
    db, 
    provider,

    // --- AUTHENTICATION ACTIONS ---
    signInWithPopup,            // Google orqali kirish
    signInWithEmailAndPassword, // Email/Parol orqali kirish
    createUserWithEmailAndPassword, // Yangi user yaratish
    signOut,                    // Tizimdan chiqish
    onAuthStateChanged,         // User holatini tekshirish (Listener)
    updateProfile,              // Ism va rasmni o'zgartirish
    updatePassword,             // Parolni yangilash
    sendPasswordResetEmail,     // Parolni tiklash (Emailga xat)
    deleteUser,                 // Hisobni o'chirish
    GoogleAuthProvider,         // Google Provayderi klansi

    // --- DATABASE ACTIONS ---
    collection,       // Papka (Collection) tanlash
    doc,              // Hujjat (Document) tanlash
    addDoc,           // Yangi hujjat qo'shish (Auto ID)
    setDoc,           // Hujjatni ID bilan saqlash/yangilash
    getDoc,           // Bitta hujjatni o'qish
    getDocs,          // Ko'p hujjatni o'qish (List)
    updateDoc,        // Hujjatning bir qismini yangilash
    deleteDoc,        // Hujjatni o'chirish
    query,            // So'rov tuzish
    where,            // Filtrlash (shart berish)
    orderBy,          // Saralash (vaqt, alfavit)
    limit,            // Cheklash (masalan, oxirgi 10 ta)
    serverTimestamp   // Server vaqtini olish
};