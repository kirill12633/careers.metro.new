// ============================================================
// ===== AES-256 ШИФРОВАНИЕ =====
// ============================================================

// Генерация ключа (сохраняйте его в безопасности!)
const ENCRYPTION_KEY = 'MetroNew2024SecureKeyForAES256Encryption!!'; // 32 байта

// Функция для преобразования строки в ключ
async function getKey(keyString) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(keyString);
    const hash = await crypto.subtle.digest('SHA-256', keyData);
    return crypto.subtle.importKey(
        'raw',
        hash,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
    );
}

// ШИФРОВАНИЕ
async function encryptData(data) {
    try {
        const key = await getKey(ENCRYPTION_KEY);
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(JSON.stringify(data));
        
        // Генерируем IV (вектор инициализации)
        const iv = crypto.getRandomValues(new Uint8Array(12));
        
        // Шифруем
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            dataBuffer
        );
        
        // Объединяем IV и зашифрованные данные в один массив
        const result = new Uint8Array(iv.length + encrypted.byteLength);
        result.set(iv, 0);
        result.set(new Uint8Array(encrypted), iv.length);
        
        // Преобразуем в Base64 для хранения
        return btoa(String.fromCharCode(...result));
    } catch (error) {
        console.error('Ошибка шифрования:', error);
        return null;
    }
}

// РАСШИФРОВКА
async function decryptData(encryptedBase64) {
    try {
        const key = await getKey(ENCRYPTION_KEY);
        
        // Преобразуем Base64 обратно в массив байтов
        const encryptedData = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
        
        // Извлекаем IV (первые 12 байт)
        const iv = encryptedData.slice(0, 12);
        const data = encryptedData.slice(12);
        
        // Расшифровываем
        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            data
        );
        
        // Преобразуем обратно в строку
        const decoder = new TextDecoder();
        return JSON.parse(decoder.decode(decrypted));
    } catch (error) {
        console.error('Ошибка расшифровки:', error);
        return null;
    }
}

// Функция для скрытия данных (для отображения)
function maskData(data) {
    if (!data) return '***';
    if (typeof data === 'string') {
        if (data.includes('@')) {
            // Email: первые 2 символа + **** + @ + домен
            const parts = data.split('@');
            const name = parts[0];
            const domain = parts[1];
            if (name.length <= 2) return '*'.repeat(name.length) + '@' + domain;
            return name.substring(0, 2) + '*'.repeat(Math.min(name.length - 2, 4)) + '@' + domain;
        }
        if (data.length > 2) {
            // Имя: первая буква + **** + последняя буква
            return data.charAt(0) + '*'.repeat(Math.min(data.length - 2, 4)) + data.charAt(data.length - 1);
        }
        return '*'.repeat(data.length);
    }
    return data;
}
