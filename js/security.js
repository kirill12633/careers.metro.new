// ============================================================
// ===== БЕЗОПАСНОСТЬ =====
// ============================================================

// ===== CSRF ТОКЕН =====
function generateCSRFToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

function getCSRFToken() {
    let token = sessionStorage.getItem('csrf_token');
    if (!token) {
        token = generateCSRFToken();
        sessionStorage.setItem('csrf_token', token);
    }
    return token;
}

function validateCSRFToken(token) {
    const stored = sessionStorage.getItem('csrf_token');
    return token === stored;
}

// ===== ОГРАНИЧЕНИЕ ПОПЫТОК =====
const ATTEMPT_LIMIT = 5;
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 минут

function getAttempts() {
    const data = localStorage.getItem('confirm_attempts');
    if (!data) return { count: 0, timestamp: Date.now() };
    try {
        return JSON.parse(data);
    } catch {
        return { count: 0, timestamp: Date.now() };
    }
}

function saveAttempts(attempts) {
    localStorage.setItem('confirm_attempts', JSON.stringify(attempts));
}

function checkAttempts() {
    const attempts = getAttempts();
    const now = Date.now();
    
    // Сброс если прошло больше 15 минут
    if (now - attempts.timestamp > ATTEMPT_WINDOW) {
        attempts.count = 0;
        attempts.timestamp = now;
        saveAttempts(attempts);
        return { allowed: true, remaining: ATTEMPT_LIMIT };
    }
    
    const remaining = ATTEMPT_LIMIT - attempts.count;
    return { 
        allowed: remaining > 0, 
        remaining: remaining,
        resetTime: attempts.timestamp + ATTEMPT_WINDOW
    };
}

function incrementAttempts() {
    const attempts = getAttempts();
    const now = Date.now();
    
    if (now - attempts.timestamp > ATTEMPT_WINDOW) {
        attempts.count = 1;
        attempts.timestamp = now;
    } else {
        attempts.count += 1;
    }
    saveAttempts(attempts);
    return attempts.count;
}

function resetAttempts() {
    localStorage.removeItem('confirm_attempts');
}

// ===== ВРЕМЯ ЖИЗНИ КОДА (24 часа) =====
const CODE_LIFETIME = 24 * 60 * 60 * 1000; // 24 часа

function isCodeExpired(createdAt) {
    if (!createdAt) return true;
    const created = createdAt.toMillis ? createdAt.toMillis() : new Date(createdAt).getTime();
    const now = Date.now();
    return (now - created) > CODE_LIFETIME;
}

function getCodeTimeLeft(createdAt) {
    if (!createdAt) return 0;
    const created = createdAt.toMillis ? createdAt.toMillis() : new Date(createdAt).getTime();
    const now = Date.now();
    const left = CODE_LIFETIME - (now - created);
    return Math.max(0, left);
}

function formatTimeLeft(ms) {
    if (ms <= 0) return 'истёк';
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    if (hours > 0) {
        return `${hours} ч ${minutes} мин`;
    }
    return `${minutes} мин`;
}

// ============================================================
// ===== ЭКСПОРТ =====
// ============================================================
window.Security = {
    getCSRFToken,
    validateCSRFToken,
    checkAttempts,
    incrementAttempts,
    resetAttempts,
    isCodeExpired,
    getCodeTimeLeft,
    formatTimeLeft
};
