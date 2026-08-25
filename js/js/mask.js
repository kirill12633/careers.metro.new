// ============================================================
// ===== МАСКИРОВАНИЕ ДАННЫХ (БЕЗ ШИФРОВАНИЯ) =====
// ============================================================

// Маскировка имени: Иван → И***н
function maskName(name) {
    if (!name || name.length < 2) return '***';
    if (name.length === 2) return name.charAt(0) + '*';
    return name.charAt(0) + '*'.repeat(Math.min(name.length - 2, 4)) + name.charAt(name.length - 1);
}

// Маскировка email: ivan@mail.ru → iv**@mail.ru
function maskEmail(email) {
    if (!email || !email.includes('@')) return '***@***';
    const parts = email.split('@');
    const name = parts[0];
    const domain = parts[1];
    if (name.length <= 2) return '*'.repeat(name.length) + '@' + domain;
    return name.substring(0, 2) + '*'.repeat(Math.min(name.length - 2, 4)) + '@' + domain;
}

// Универсальная функция
function maskData(data) {
    if (!data) return '***';
    if (typeof data === 'string') {
        if (data.includes('@')) return maskEmail(data);
        return maskName(data);
    }
    return data;
}

// ===== ЭКСПОРТ =====
window.Mask = {
    maskName,
    maskEmail,
    maskData
};

console.log('✅ Маскирование загружено!');
