/**
 * ================================================================================================
 * NIGOH PLATFORM - CORE CONFIGURATION (NO-STORAGE EDITION V8.0)
 * ================================================================================================
 * * O'ZGARISH:
 * - Firebase Storage butunlay olib tashlandi.
 * - Rasm va fayllar to'g'ridan-to'g'ri Telegramga yuboriladi.
 * - 100% Bepul va CORS muammosiz.
 * ================================================================================================
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, updatePassword, sendPasswordResetEmail, deleteUser } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, setDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 1. FIREBASE CONFIG (Storage Bucket olib tashlandi)
const firebaseConfig = {
    apiKey: "AIzaSyCrn_NMDxZRjU0tToRnZCdqx9CEef_mwuk",
    authDomain: "studio-1879510232-1b0ed.firebaseapp.com",
    projectId: "studio-1879510232-1b0ed",
    messagingSenderId: "921358775126",
    appId: "1:921358775126:web:4f2d183feb17b50f1edcf7"
};

// 2. TELEGRAM CONFIG
const TELEGRAM_CONFIG = {
    botToken: "8589526911:AAEPYGVtWU8oq5DgOQlAw2LXhmYdcOe7D3Q",
    adminId: "5883103021",
    apiUrl: "https://api.telegram.org/bot"
};

// 3. INIT
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

console.log("%c NIGOH (NO-STORAGE MODE) ONLINE ", "background:#10b981; color:white; font-weight:bold;");

// ------------------------------------------------------------------------------------------------
// 4. TELEGRAM BRIDGE (DIRECT UPLOAD)
// ------------------------------------------------------------------------------------------------

async function sendTelegramNotification(data) {
    if (!TELEGRAM_CONFIG.botToken || !TELEGRAM_CONFIG.adminId) return false;

    const { type, description, address, userEmail, date, mapLink, imageFile } = data;

    // Ikonkalar
    let icon = "📝";
    if (type.includes("Yo'l")) icon = "🚧";
    if (type.includes("Kommunal")) icon = "💡";
    if (type.includes("Korrupsiya")) icon = "💸";
    if (type.includes("Ekologiya")) icon = "🌳";

    // Matn
    const message = `
<b>🔔 YANGI MUROJAAT</b>

👤 <b>Kimdan:</b> ${userEmail}
📅 <b>Vaqt:</b> ${date}

${icon} <b>Turi:</b> ${type}
📍 <b>Manzil:</b> ${address}

📝 <b>Mazmuni:</b>
<i>${description.replace(/<[^>]*>?/gm, '')}</i>

🌍 <a href="${mapLink}">Xaritada ko'rish</a>`.trim();

    try {
        const formData = new FormData();
        formData.append("chat_id", TELEGRAM_CONFIG.adminId);
        formData.append("caption", message);
        formData.append("parse_mode", "HTML");

        let method = "sendMessage";

        // Agar rasm bo'lsa
        if (imageFile) {
            // Fayl turini aniqlash
            if (imageFile.type.startsWith('image/')) {
                method = "sendPhoto";
                formData.append("photo", imageFile);
            } else if (imageFile.type.startsWith('video/')) {
                method = "sendVideo";
                formData.append("video", imageFile);
            } else {
                method = "sendDocument";
                formData.append("document", imageFile);
            }
            console.log(`📤 Telegramga fayl (${method}) yuborilmoqda...`);
        } else {
            // Fayl yo'q bo'lsa
            console.log("📤 Telegramga matn yuborilmoqda...");
            formData.append("text", message); // sendMessage uchun 'text' kerak
            formData.delete("caption"); // sendMessage da caption bo'lmaydi
        }

        const response = await fetch(`${TELEGRAM_CONFIG.apiUrl}${TELEGRAM_CONFIG.botToken}/${method}`, {
            method: "POST",
            body: formData
        });

        const resData = await response.json();

        if (resData.ok) {
            console.log("✅ Telegramga muvaffaqiyatli bordi!");
            return true;
        } else {
            console.error("Telegram Error:", resData);
            return false;
        }

    } catch (error) {
        console.error("Network Error:", error);
        return false;
    }
}

// 5. EXPORT (Storage funksiyalari olib tashlandi)
export {
    app, auth, db, provider,
    signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, updatePassword, sendPasswordResetEmail, deleteUser, GoogleAuthProvider,
    collection, addDoc, setDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, limit, serverTimestamp,
    sendTelegramNotification
};