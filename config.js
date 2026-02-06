/**
 * ================================================================================================
 * NIGOH PLATFORM - CORE CONFIGURATION (HYBRID EDITION V7.0)
 * ================================================================================================
 * * YANGILANISH:
 * 1. "Direct Upload" (To'g'ridan-to'g'ri fayl yuborish) funksiyasi tiklandi.
 * 2. Agar to'g'ridan-to'g'ri yuborish o'xshamasa, avtomatik "Link" orqali yuboradi.
 * 3. 150MB+ fayllar uchun "Yuklab olish" tugmasini chiqaradi.
 * ================================================================================================
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, updatePassword, sendPasswordResetEmail, deleteUser } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, setDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// 1. FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyCrn_NMDxZRjU0tToRnZCdqx9CEef_mwuk",
    authDomain: "studio-1879510232-1b0ed.firebaseapp.com",
    projectId: "studio-1879510232-1b0ed",
    storageBucket: "studio-1879510232-1b0ed.firebasestorage.app",
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
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

console.log("%c NIGOH HYBRID V7.0 ONLINE ", "background:#10b981; color:white; font-weight:bold;");

// ------------------------------------------------------------------------------------------------
// 4. TELEGRAM BRIDGE (GIBRID TIZIM)
// ------------------------------------------------------------------------------------------------

// Yordamchi: Fayl turini aniqlash
function getFileType(file) {
    if (!file) return 'unknown';
    const type = file.type.split('/')[0]; // 'image', 'video', 'audio'
    if (type === 'image') return 'sendPhoto';
    if (type === 'video') return 'sendVideo';
    if (type === 'audio') return 'sendAudio';
    return 'sendDocument';
}

/**
 * Asosiy yuborish funksiyasi
 */
async function sendTelegramNotification(data) {
    if (!TELEGRAM_CONFIG.botToken || !TELEGRAM_CONFIG.adminId) return false;

    const { type, description, address, userEmail, date, mapLink, imageFile, imageUrl } = data;

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
        // 1-USUL: FAYLNI TO'G'RIDAN-TO'G'RI YUBORISH (Direct Upload)
        // Bu usulda rasm botda darhol ko'rinadi (link bo'lib qolmaydi).
        if (imageFile) {
            console.log("📤 1-Usul: Faylni to'g'ridan-to'g'ri yuborish...");
            
            const method = getFileType(imageFile);
            const formData = new FormData();
            formData.append("chat_id", TELEGRAM_CONFIG.adminId);
            
            // "photo", "video", "document" kalit so'zi
            const fileKey = method === 'sendPhoto' ? 'photo' : (method === 'sendVideo' ? 'video' : 'document');
            formData.append(fileKey, imageFile);
            
            formData.append("caption", message);
            formData.append("parse_mode", "HTML");

            // So'rov yuborish
            const response = await fetch(`${TELEGRAM_CONFIG.apiUrl}${TELEGRAM_CONFIG.botToken}/${method}`, {
                method: "POST",
                body: formData
            });

            const resData = await response.json();

            if (resData.ok) {
                console.log("✅ 1-Usul Muvaffaqiyatli!");
                return true;
            } else {
                console.warn("⚠️ 1-Usul o'xshamadi (Katta fayl yoki CORS). 2-Usulga o'tilmoqda...", resData);
                // Agar o'xshamasa, pastdagi 2-usulga (URL) tushib ketadi (catch blok emas, if else orqali)
            }
        }

        // 2-USUL: URL ORQALI YUBORISH (Fallback)
        // Agar fayl juda katta bo'lsa yoki 1-usul ishlamasa
        if (imageUrl) {
            console.log("🔗 2-Usul: URL orqali yuborish...");
            
            // Matnni yangilaymiz (havola qo'shamiz)
            const fallbackMsg = message + `\n\n📎 <a href="${imageUrl}">Faylni Yuklab Olish</a>`;

            const response = await fetch(`${TELEGRAM_CONFIG.apiUrl}${TELEGRAM_CONFIG.botToken}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CONFIG.adminId,
                    text: fallbackMsg,
                    parse_mode: "HTML",
                    disable_web_page_preview: false
                })
            });
            
            const resData = await response.json();
            if(resData.ok) {
                console.log("✅ 2-Usul Muvaffaqiyatli!");
                return true;
            }
        }

        // 3-USUL: FAQAT MATN (Agar fayl ham, rasm ham bo'lmasa)
        if (!imageFile && !imageUrl) {
            await fetch(`${TELEGRAM_CONFIG.apiUrl}${TELEGRAM_CONFIG.botToken}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CONFIG.adminId,
                    text: message,
                    parse_mode: "HTML"
                })
            });
            return true;
        }

    } catch (error) {
        console.error("❌ Telegram Xatolik:", error);
        // Xatolik bo'lsa ham foydalanuvchiga bildirmaymiz, 
        // chunki baza (Firestore) ga yozilgan bo'lishi mumkin.
        return false;
    }
}

export {
    app, auth, db, storage, provider,
    signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, updatePassword, sendPasswordResetEmail, deleteUser, GoogleAuthProvider,
    collection, addDoc, setDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, limit, serverTimestamp,
    ref, uploadBytes, getDownloadURL,
    sendTelegramNotification
};