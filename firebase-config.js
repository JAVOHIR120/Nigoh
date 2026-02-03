// Firebase kutubxonalarini internetdan (CDN) chaqirib olamiz
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Siz yuborgan maxsus kalitlar (Configs)
const firebaseConfig = {
  apiKey: "AIzaSyCrn_NMDxZRjU0tToRnZCdqx9CEef_mwuk",
  authDomain: "studio-1879510232-1b0ed.firebaseapp.com",
  projectId: "studio-1879510232-1b0ed",
  storageBucket: "studio-1879510232-1b0ed.firebasestorage.app",
  messagingSenderId: "921358775126",
  appId: "1:921358775126:web:4f2d183feb17b50f1edcf7"
};

// Firebaseni ishga tushirish (Start)
const app = initializeApp(firebaseConfig);

// Xizmatlarni ishga tushirish
const auth = getAuth(app);       // Login tizimi
const db = getFirestore(app);    // Ma'lumotlar bazasi
const provider = new GoogleAuthProvider(); // Google orqali kirish

// Boshqa fayllarda (login.html, profile.html) ishlatish uchun eksport qilamiz
export { 
    auth, 
    db, 
    provider, 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    collection, 
    addDoc, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    updateProfile, 
    sendPasswordResetEmail 
};