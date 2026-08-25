// ===== МЕТРО NEW — СКРИПТ ЗАМОРОЗКИ САЙТА (МЕЙНТЕНАНС) =====
(function() {
    function initMaintenance() {
        // 1. Находим элементы формы
        const submitBtn = document.getElementById('submitBtn') || document.querySelector('button[type="submit"]');
        const form = document.getElementById('vacancyForm') || document.querySelector('form');

        // 2. Блокируем кнопку отправки
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.5";
            submitBtn.style.cursor = "not-allowed";
            submitBtn.style.pointerEvents = "none"; // Чтобы точно нельзя было кликнуть
            submitBtn.innerHTML = `<i class="fas fa-ban"></i> Прием анкет приостановлен`;
        }

        // 3. Запрещаем отправку формы намертво (даже через Enter)
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }, true);
        }

        // 4. Создаем и стилизуем баннер техработ
        const alertBanner = document.createElement('div');
        alertBanner.id = "maintenance-top-banner";
        
        // Стили выносим отдельно для красоты
        const styles = `
            #maintenance-top-banner {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #182444, #1d2b4f);
                border: 2px solid #FFD700;
                color: #f2f4fa;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.6);
                z-index: 999999;
                max-width: 90%;
                width: 450px;
                font-family: 'Montserrat', sans-serif;
                text-align: center;
                box-sizing: border-box;
            }
            .js-spin-icon {
                color: #FFD700; 
                font-size: 24px; 
                margin-bottom: 8px; 
                animation: js-maintenance-spin 4s infinite linear;
            }
            @keyframes js-maintenance-spin { 
                100% { transform: rotate(360deg); } 
            }
        `;

        // Внедряем стили в документ
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        // Наполняем баннер контентом
        alertBanner.innerHTML = `
            <i class="fas fa-tools js-spin-icon"></i>
            <div style="font-weight: 800; font-size: 16px; margin-bottom: 4px; color: #FFD700;">Технические работы</div>
            <div style="font-size: 13px; color: #a6b0cc; line-height: 1.4;">
                Мы обновляем систему отправки писем. Прямо сейчас заполнить и отправить анкету нельзя. Скоро всё заработает!
            </div>
        `;
        
        document.body.appendChild(alertBanner);
    }

    // Запускаем как только дерево HTML готово
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initMaintenance);
    } else {
        initMaintenance();
    }
})();
