/**
 * ================================================================================================
 * NIGOH PLATFORM - CORE CONFIGURATION ENGINE (ULTIMATE EDITION V6.0)
 * ================================================================================================
 * * AUTHOR:      Nigoh Development Team
 * * DATE:        2026-05-20
 * * DESCRIPTION: Tizimning markaziy boshqaruv moduli.
 * * FEATURES:
 * - Firebase ekotizimi bilan to'liq integratsiya.
 * - Telegram Bot API orqali har qanday formatdagi fayllarni (150MB+) uzatish.
 * - Tarmoq xatolarini avtomatik tuzatish (Auto-Retry Strategy).
 * - Fayl turlarini avtomatik aniqlash (MIME Type Detection).
 * - Xavfsizlik protokollari va Error Logging.
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

// Cloud Firestore Database
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

// Cloud Storage (File Management)
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
    // BotFather'dan olingan yangi token
    botToken: "8589526911:AAEPYGVtWU8oq5DgOQlAw2LXhmYdcOe7D3Q",
    
    // Adminning shaxsiy ID raqami
    adminId: "5883103021",
    
    // Telegram API Endpoint
    apiUrl: "https://api.telegram.org/bot"
};

// ------------------------------------------------------------------------------------------------
// 3. INITIALIZATION (ISHGA TUSHIRISH)
// ------------------------------------------------------------------------------------------------
let app, auth, db, storage, provider;

try {
    // 1. Ilovani ishga tushirish
    app = initializeApp(firebaseConfig);
    
    // 2. Xizmatlarni ulash
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    provider = new GoogleAuthProvider();

    // 3. Status Log
    console.log(
        "%c NIGOH SYSTEM v6.0 %c ONLINE ",
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
// 4. TELEGRAM BRIDGE (UNIVERSAL XABAR YUBORISH TIZIMI)
// ------------------------------------------------------------------------------------------------

/**
 * Yordamchi Funksiya: Kutish (Delay)
 * Tarmoq xatolarida qayta urinishdan oldin biroz kutish uchun.
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Yordamchi Funksiya: Fayl turini aniqlash
 * URL yoki Fayl nomiga qarab qaysi metodni ishlatishni hal qiladi.
 */
function getFileType(fileName) {
    if (!fileName) return 'unknown';
    const ext = fileName.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) return 'photo';
    if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'video';
    if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) return 'audio';
    return 'document'; // Boshqa barcha fayllar (PDF, DOCX, ZIP, etc.)
}

/**
 * Murojaat ma'lumotlarini Telegram Botga yuboradi.
 * Bu funksiya fayl hajmi va turini avtomatik aniqlab, eng optimal yo'lni tanlaydi.
 * * @param {Object} data - Murojaat ma'lumotlari
 * @param {number} retryCount - Qayta urinishlar soni (System use only)
 */
async function sendTelegramNotification(data, retryCount = 0) {
    // 1. Konfiguratsiya tekshiruvi
    if (!TELEGRAM_CONFIG.botToken || !TELEGRAM_CONFIG.adminId) {
        console.warn("⚠️ Telegram konfiguratsiyasi to'liq emas!");
        return false;
    }

    const MAX_RETRIES = 3;
    const { type, description, address, userEmail, date, mapLink, imageUrl, fileName } = data;
    
    // 2. Ikonkalarni aniqlash
    let typeIcon = "📝";
    if (type.includes("Yo'l")) typeIcon = "🚧";
    if (type.includes("Kommunal")) typeIcon = "💡";
    if (type.includes("Korrupsiya")) typeIcon = "💸";
    if (type.includes("Ekologiya")) typeIcon = "🌳";

    // 3. Xabar matnini tayyorlash (HTML)
    // Telegram caption limiti 1024 belgi. Agar oshib ketsa, qisqartiramiz.
    let cleanDesc = description.replace(/<[^>]*>?/gm, ''); // HTML teglarni olib tashlash
    if (cleanDesc.length > 800) cleanDesc = cleanDesc.substring(0, 800) + "... (davomi bor)";

    const message = `
<b>🔔 YANGI MUROJAAT (#${Date.now().toString().slice(-4)})</b>

👤 <b>Foydalanuvchi:</b> ${userEmail}
📅 <b>Vaqt:</b> ${date}

${typeIcon} <b>Muammo Turi:</b> ${type}
📍 <b>Manzil:</b> ${address}

📝 <b>Tavsif:</b>
<i>${cleanDesc}</i>

🌍 <a href="${mapLink}">Xaritada Ko'rish (Google Maps)</a>
    `.trim();

    try {
        let endpoint = "sendMessage";
        let body = {
            chat_id: TELEGRAM_CONFIG.adminId,
            parse_mode: "HTML",
            disable_web_page_preview: true
        };

        // 4. Fayl logikasi (Universal Handler)
        if (imageUrl) {
            const fileType = getFileType(fileName || imageUrl);
            
            // Telegram Methodni tanlash
            if (fileType === 'photo') endpoint = "sendPhoto";
            else if (fileType === 'video') endpoint = "sendVideo";
            else if (fileType === 'audio') endpoint = "sendAudio";
            else endpoint = "sendDocument";

            // Body parametrlarini o'zgartirish
            body[fileType] = imageUrl; // URL orqali yuborish (Eng ishonchli usul)
            body.caption = message;
            
            console.log(`📤 Telegramga ${fileType.toUpperCase()} yuborilmoqda... (URL Method)`);
        } else {
            // Fayl yo'q bo'lsa faqat matn
            body.text = message;
            console.log(`📤 Telegramga MATN yuborilmoqda...`);
        }

        // 5. So'rov yuborish
        const response = await fetch(`${TELEGRAM_CONFIG.apiUrl}${TELEGRAM_CONFIG.botToken}/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const resData = await response.json();

        // 6. Xatoliklarni tahlil qilish va Fallback
        if (!resData.ok) {
            console.warn(`⚠️ Telegram API Error: ${resData.description}`);

            // Agar fayl juda katta bo'lsa yoki Telegram URLni o'qiy olmasa
            // Biz matnli xabar yuborib, unga fayl linkini qo'shib qo'yamiz.
            if (imageUrl && (resData.error_code === 400 || resData.description.includes("Wrong file"))) {
                console.log("🔄 Fayl yuborishda xatolik. Fallback rejimiga o'tilmoqda...");
                
                const fallbackMessage = message + `\n\n📎 <b>Biriktirilgan Fayl:</b> <a href="${imageUrl}">Yuklab Olish</a>`;
                
                await fetch(`${TELEGRAM_CONFIG.apiUrl}${TELEGRAM_CONFIG.botToken}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CONFIG.adminId,
                        text: fallbackMessage,
                        parse_mode: "HTML"
                    })
                });
                return true; // Fallback muvaffaqiyatli
            }

            throw new Error(resData.description);
        }

        console.log("%c ✅ Telegram Notification Sent Successfully! ", "color: #10b981; font-weight: bold;");
        return true;

    } catch (error) {
        console.error(`❌ Xatolik (Urinish ${retryCount + 1}/${MAX_RETRIES}):`, error.message);

        // 7. Auto-Retry Logic (Avtomatik qayta urinish)
        if (retryCount < MAX_RETRIES) {
            const waitTime = 2000 * (retryCount + 1); // 2s, 4s, 6s kutadi
            console.log(`⏳ ${waitTime}ms dan keyin qayta urinib ko'ramiz...`);
            await delay(waitTime);
            return sendTelegramNotification(data, retryCount + 1);
        } else {
            console.error("⛔ Barcha urinishlar muvaffaqiyatsiz tugadi. Administratorga xabar bering.");
            return false;
        }
    }
}

// ------------------------------------------------------------------------------------------------
// 5. EXPORT MODULES (YAGONA CHIQISH NUQTASI)
// ------------------------------------------------------------------------------------------------
// Ushbu eksportlar orqali boshqa fayllar (index.html, admin.html) bu funksiyalardan foydalanadi.

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

    // Custom Functions (Telegram Bridge)
    sendTelegramNotification
};