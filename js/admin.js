class AdminModule {
    constructor() {
        this.riggedOutcome = 'random';
        this.clickCount = 0;
        this.setupStealthTrigger();
    }

    setupStealthTrigger() {
        const trigger = document.getElementById('secretTrigger');
        const panel = document.getElementById('stealthPanel');

        trigger.addEventListener('click', () => {
            this.clickCount++;
            if (this.clickCount === 5) {
                panel.classList.toggle('hidden');
                this.clickCount = 0; // Сброс счетчика
                this.updateStealthDropdown();
            }
        });

        // Сброс кликов через 3 секунды бездействия, чтобы обычный юзер случайно не открыл панель медленными кликами
        setInterval(() => {
            if (this.clickCount > 0) this.clickCount = 0;
        }, 3000);

        document.getElementById('cheatSelect').addEventListener('change', (e) => {
            this.riggedOutcome = e.target.value;
        });
    }

    updateStealthDropdown() {
        const select = document.getElementById('cheatSelect');
        const currentSelection = select.value;
        
        select.innerHTML = '<option value="random">Абсолютный рандом (Честно)</option>';
        
        const items = app.db.getItems();
        items.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.id;
            opt.textContent = `${item.name}`;
            select.appendChild(opt);
        });

        // Сохраняем выбранную подкрутку при обновлении пула элементов
        if ([...select.options].some(o => o.value === currentSelection)) {
            select.value = currentSelection;
        } else {
            this.riggedOutcome = 'random';
        }
    }
}