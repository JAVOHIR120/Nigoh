/**
 * ================================================================================================
 * NIGOH PLATFORM - CORE CONFIGURATION ENGINE (ULTIMATE EDITION V5.0)
 * ================================================================================================
 * * AUTHOR:      Nigoh Development Team
 * DATE:        2026-05-20
 * DESCRIPTION: Bu fayl butun ekotizimning markaziy boshqaruv punkti hisoblanadi.
 * U Firebase xizmatlari va Telegram API o'rtasidagi ko'prikni ta'minlaydi.
 * * MODULES:     1. Firebase Authentication (Kirish/Chiqish)
 * 2. Cloud Firestore (Ma'lumotlar Bazasi)
 * 3. Cloud Storage (Fayllar ombori)
 * 4. Telegram Notification System (Xabarnomalar)
 * * DIQQAT:      Ushbu faylni o'zgartirishdan oldin zaxira nusxasini oling!
 * ================================================================================================
 */

// ------------------------------------------------------------------------------------------------
// 1. FIREBASE SDK IMPORT (MODULAR WEB V9+)
// ------------------------------------------------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

// Authentication
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

// Firestore Database
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

// Cloud Storage
import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// ------------------------------------------------------------------------------------------------
// 2. TIZIM KONFIGURATSIYASI (CREDENTIALS)
// ------------------------------------------------------------------------------------------------

/**
 * A) FIREBASE CONFIGURATION
 * Google Cloud Console orqali olingan maxfiy kalitlar.
 */
const firebaseConfig = {
    apiKey: "AIzaSyCrn_NMDxZRjU0tToRnZCdqx9CEef_mwuk",
    authDomain: "studio-1879510232-1b0ed.firebaseapp.com",
    projectId: "studio-1879510232-1b0ed",
    storageBucket: "studio-1879510232-1b0ed.firebasestorage.app",
    messagingSenderId: "921358775126",
    appId: "1:921358775126:web:4f2d183feb17b50f1edcf7"
};

/**
 * B) TELEGRAM BOT CONFIGURATION
 * Murojaatlarni zudlik bilan adminga yetkazish uchun.
 */
const TELEGRAM_CONFIG = {
    // Siz bergan yangi Token
    botToken: "8589526911:AAEPYGVtWU8oq5DgOQlAw2LXhmYdcOe7D3Q",
    
    // Sizning ID raqamingiz (Admin)
    adminId: "5883103021",
    
    // API Endpoints
    apiUrl: "https://api.telegram.org/bot"
};

// ------------------------------------------------------------------------------------------------
// 3. INITIALIZATION (ISHGA TUSHIRISH)
// ------------------------------------------------------------------------------------------------
let app, auth, db, storage, provider;

try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    
    // Initialize Services
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    provider = new GoogleAuthProvider();

    // System Health Check Log
    console.log(
        "%c NIGOH SYSTEM v5.0 %c ONLINE ",
        "background:#3b82f6; color:white; font-weight:bold; padding:4px; border-radius:4px 0 0 4px;",
        "background:#10b981; color:white; font-weight:bold; padding:4px; border-radius:0 4px 4px 0;"
    );

} catch (error) {
    console.error(
        "%c CRITICAL ERROR %c Firebase Connection Failed ",
        "background:#ef4444; color:white; font-weight:bold; padding:4px;",
        "background:#1e293b; color:#ef4444; padding:4px;",
        error
    );
}

// ------------------------------------------------------------------------------------------------
// 4. TELEGRAM BRIDGE (XABAR YUBORISH TIZIMI)
// ------------------------------------------------------------------------------------------------

/**
 * Murojaat ma'lumotlarini Telegram Botga yuboradi.
 * @param {Object} data - Murojaat ma'lumotlari (type, desc, address, etc.)
 */
async function sendTelegramNotification(data) {
    if (!TELEGRAM_CONFIG.botToken || !TELEGRAM_CONFIG.adminId) {
        console.warn("Telegram konfiguratsiyasi to'liq emas!");
        return;
    }

    // 1. Xabar shablonini tayyorlash (HTML Mode)
    const { type, description, address, userEmail, date, mapLink, imageFile } = data;
    
    // Status ikonkalarini aniqlash
    let typeIcon = "📝";
    if (type.includes("Yo'l")) typeIcon = "🚧";
    if (type.includes("Kommunal")) typeIcon = "💡";
    if (type.includes("Korrupsiya")) typeIcon = "💸";
    if (type.includes("Ekologiya")) typeIcon = "🌳";

    const message = `
<b>🔔 YANGI MUROJAAT (#${Date.now().toString().slice(-4)})</b>

👤 <b>Foydalanuvchi:</b> ${userEmail}
📅 <b>Vaqt:</b> ${date}

${typeIcon} <b>Muammo Turi:</b> ${type}
📍 <b>Manzil:</b> ${address}

📝 <b>Tavsif:</b>
<i>${description}</i>

🌍 <a href="${mapLink}">Xaritada Ko'rish (Google Maps)</a>
    `;

    try {
        // 2. So'rov yuborish
        if (imageFile) {
            // A) Agar rasm bo'lsa -> sendPhoto
            const formData = new FormData();
            formData.append("chat_id", TELEGRAM_CONFIG.adminId);
            formData.append("photo", imageFile);
            formData.append("caption", message);
            formData.append("parse_mode", "HTML");

            const response = await fetch(`${TELEGRAM_CONFIG.apiUrl}${TELEGRAM_CONFIG.botToken}/sendPhoto`, {
                method: "POST",
                body: formData
            });
            
            const resData = await response.json();
            if(!resData.ok) throw new Error(resData.description);

        } else {
            // B) Agar rasm bo'lmasa -> sendMessage
            const response = await fetch(`${TELEGRAM_CONFIG.apiUrl}${TELEGRAM_CONFIG.botToken}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CONFIG.adminId,
                    text: message,
                    parse_mode: "HTML",
                    disable_web_page_preview: true
                })
            });

            const resData = await response.json();
            if(!resData.ok) throw new Error(resData.description);
        }

        console.log("✅ Telegram Notification Sent!");
        return true;

    } catch (error) {
        console.error("❌ Telegram API Error:", error);
        return false;
    }
}

// ------------------------------------------------------------------------------------------------
// 5. EXPORT MODULES (YAGONA CHIQISH NUQTASI)
// ------------------------------------------------------------------------------------------------
// Boshqa fayllar faqat shu yerdan import qilishi kerak.

export {
    // Core Services
    app, auth, db, storage, provider,

    // Authentication Functions
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    updatePassword,
    sendPasswordResetEmail,
    deleteUser,
    GoogleAuthProvider,

    // Database Functions
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
    serverTimestamp,

    // Storage Functions
    ref,
    uploadBytes,
    getDownloadURL,

    // Custom Functions
    sendTelegramNotification
};