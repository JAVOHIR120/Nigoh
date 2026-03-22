/**
 * ================================================================================================
 * NIGOH PLATFORM - CORE CONFIGURATION ENGINE (FINAL EDITION V10.0)
 * ================================================================================================
 * * AUTHOR:      Nigoh Development Team
 * * DATE:        2026-05-20
 * * MODE:        NO-STORAGE (Direct Telegram Upload)
 * * * DESCRIPTION: 
 * Bu tizimning "Miyasi". U quyidagi vazifalarni bajaradi:
 * 1. Firebase Authentication (Foydalanuvchilarni tanish).
 * 2. Cloud Firestore (Ma'lumotlar bazasi).
 * 3. Telegram API Bridge (Fayllarni to'g'ridan-to'g'ri uzatish).
 * * * DIQQAT: 
 * Bu versiyada Firebase Storage o'chirilgan. Fayllar saqlanmaydi, 
 * ular tranzit orqali to'g'ri Telegramga ketadi.
 * ================================================================================================
 */

// ------------------------------------------------------------------------------------------------
// 1. FIREBASE SDK IMPORT (MODULAR WEB V9+)
// ------------------------------------------------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

// Authentication Services
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

// Firestore Database Services
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

// ------------------------------------------------------------------------------------------------
// 2. TIZIM KONFIGURATSIYASI (CREDENTIALS)
// ------------------------------------------------------------------------------------------------

/**
 * A) FIREBASE CONFIGURATION
 * Storage Bucket olib tashlandi, chunki biz uni ishlatmaymiz.
 */
const firebaseConfig = {
    apiKey: "AIzaSyCrn_NMDxZRjU0tToRnZCdqx9CEef_mwuk",
    authDomain: "studio-1879510232-1b0ed.firebaseapp.com",
    projectId: "studio-1879510232-1b0ed",
    messagingSenderId: "921358775126",
    appId: "1:921358775126:web:4f2d183feb17b50f1edcf7"
};

/**
 * B) TELEGRAM BOT CONFIGURATION
 * Murojaatlarni qabul qiluvchi bot va admin sozlamalari.
 */
const TELEGRAM_CONFIG = {
    botToken: "8589526911:AAEPYGVtWU8oq5DgOQlAw2LXhmYdcOe7D3Q",
    adminId: "5883103021",
    apiUrl: "https://api.telegram.org/bot"
};

// ------------------------------------------------------------------------------------------------
// 3. INITIALIZATION (ISHGA TUSHIRISH)
// ------------------------------------------------------------------------------------------------
let app, auth, db, provider;

try {
    // 1. Ilovani ishga tushirish
    app = initializeApp(firebaseConfig);
    
    // 2. Xizmatlarni ulash
    auth = getAuth(app);
    db = getFirestore(app);
    provider = new GoogleAuthProvider();

    // 3. Status Log
    console.log(
        "%c NIGOH SYSTEM V10.0 %c ONLINE (NO-STORAGE) ",
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
// 4. TELEGRAM BRIDGE (UNIVERSAL FILE SENDER)
// ------------------------------------------------------------------------------------------------

/**
 * Murojaat ma'lumotlarini Telegram Botga yuboradi.
 * Fayl turini avtomatik aniqlaydi va to'g'ri metod (Photo/Video/Document) tanlaydi.
 * * @param {Object} data - Murojaat ma'lumotlari
 */
async function sendTelegramNotification(data) {
    // 1. Konfiguratsiya tekshiruvi
    if (!TELEGRAM_CONFIG.botToken || !TELEGRAM_CONFIG.adminId) {
        console.warn("⚠️ Telegram konfiguratsiyasi to'liq emas!");
        return false;
    }

    const { type, description, address, userEmail, date, mapLink, imageFile } = data;
    
    // 2. Ikonkalarni aniqlash
    let typeIcon = "📝";
    if (type.includes("Yo'l")) typeIcon = "🚧";
    if (type.includes("Kommunal")) typeIcon = "💡";
    if (type.includes("Korrupsiya")) typeIcon = "💸";
    if (type.includes("Ekologiya")) typeIcon = "🌳";

    // 3. Xabar matnini tayyorlash (HTML)
    // Telegram caption limiti 1024 belgi. 
    let cleanDesc = description.replace(/<[^>]*>?/gm, ''); // HTML teglarni olib tashlash
    if (cleanDesc.length > 900) cleanDesc = cleanDesc.substring(0, 900) + "... (davomi bor)";

    const message = `
<b>🔔 YANGI MUROJAAT</b>

👤 <b>Foydalanuvchi:</b> ${userEmail}
📅 <b>Vaqt:</b> ${date}

${typeIcon} <b>Muammo Turi:</b> ${type}
📍 <b>Manzil:</b> ${address}

📝 <b>Tavsif:</b>
<i>${cleanDesc}</i>

🌍 <a href="${mapLink}">Xaritada Ko'rish (Google Maps)</a>
    `.trim();

    try {
        const formData = new FormData();
        formData.append("chat_id", TELEGRAM_CONFIG.adminId);
        formData.append("caption", message);
        formData.append("parse_mode", "HTML");

        let method = "sendMessage";
        let paramName = "";

        // 4. Fayl logikasi (Agar fayl bo'lsa)
        if (imageFile) {
            const mime = imageFile.type; // masalan: 'image/jpeg', 'video/mp4', 'application/pdf'
            console.log(`📂 Fayl turi aniqlandi: ${mime} (${(imageFile.size / 1024 / 1024).toFixed(2)} MB)`);

            // Telegram API metodini tanlash
            if (mime.startsWith('image/')) {
                method = "sendPhoto";
                paramName = "photo";
            } else if (mime.startsWith('video/')) {
                method = "sendVideo";
                paramName = "video";
            } else if (mime.startsWith('audio/')) {
                method = "sendAudio";
                paramName = "audio";
            } else {
                // Boshqa barcha fayllar (PDF, ZIP, DOC, EXE va h.k.)
                method = "sendDocument";
                paramName = "document";
            }

            formData.append(paramName, imageFile);
            console.log(`📤 Telegramga ${method} orqali yuborilmoqda...`);

        } else {
            // Fayl yo'q bo'lsa faqat matn yuborish
            console.log("📤 Telegramga faqat MATN yuborilmoqda...");
            formData.append("text", message); // sendMessage uchun 'text' kerak
            formData.delete("caption"); // sendMessage da caption bo'lmaydi
        }

        // 5. So'rov yuborish (POST Request)
        const response = await fetch(`${TELEGRAM_CONFIG.apiUrl}${TELEGRAM_CONFIG.botToken}/${method}`, {
            method: "POST",
            body: formData
        });

        const resData = await response.json();

        // 6. Javobni tekshirish
        if (resData.ok) {
            console.log("%c ✅ Telegram Notification Sent Successfully! ", "color: #10b981; font-weight: bold;");
            return true;
        } else {
            console.error("⚠️ Telegram API Error:", resData);
            // Agar fayl juda katta bo'lsa yoki xato bersa, hech bo'lmasa matnni o'zini yuborishga urinamiz
            if (imageFile) {
                console.log("🔄 Fayl yuborilmadi. Matnni o'zini yuborishga urinib ko'ramiz...");
                await fetch(`${TELEGRAM_CONFIG.apiUrl}${TELEGRAM_CONFIG.botToken}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CONFIG.adminId,
                        text: message + "\n\n⚠️ <i>Fayl hajmi katta yoki format noto'g'ri bo'lgani uchun yuklanmadi.</i>",
                        parse_mode: "HTML"
                    })
                });
            }
            return false;
        }

    } catch (error) {
        console.error("❌ Network or System Error:", error);
        return false;
    }
}

// ------------------------------------------------------------------------------------------------
// 5. EXPORT MODULES (YAGONA CHIQISH NUQTASI)
// ------------------------------------------------------------------------------------------------
// Barcha HTML fayllar (index, login, profile, admin) shu yerdan funksiyalarni oladi.

export {
    // Core Services
    app, auth, db, provider,

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

    // Database Functions (Firestore)
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

    // Custom Functions (Telegram Bridge)
    sendTelegramNotification
};