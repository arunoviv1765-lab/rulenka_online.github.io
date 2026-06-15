class RouletteModule {
    constructor() {
        this.tape = document.getElementById('rouletteTape');
        this.spinBtn = document.getElementById('spinBtn');
        this.pointer = document.getElementById('roulettePointer');
        this.isSpinning = false;
        this.cellWidth = 140; // Изменено под новые размеры CSS
        this.visibleWrapperWidth = 800;
        this.repetitions = 25; 
        this.tapeItems = [];
        
        this.loadWheel();
    }

    loadWheel() {
        if (this.isSpinning) return;
        this.tape.innerHTML = '';
        this.tapeItems = [];

        const pool = app.db.getItems();
        if (pool.length === 0) {
            document.getElementById('itemsList').innerHTML = '<div style="color:#475569; padding:5px; font-size:13px;">Список пуст</div>';
            return;
        }

        this.renderPublicList(pool);

        for (let i = 0; i < this.repetitions; i++) {
            this.tapeItems = this.tapeItems.concat(pool);
        }

        this.tapeItems.forEach(item => {
            const cell = document.createElement('div');
            cell.className = `cell ${item.color}`;
            cell.innerHTML = `<span>${item.name}</span>`;
            this.tape.appendChild(cell);
        });

        if (app.admin) app.admin.updateStealthDropdown();
    }

    renderPublicList(pool) {
        const listContainer = document.getElementById('itemsList');
        listContainer.innerHTML = '';
        pool.forEach(item => {
            const row = document.createElement('div');
            row.className = 'list-item-row';
            row.innerHTML = `<span>${item.name}</span> <span style="font-size:10px; opacity:0.3;">●</span>`;
            listContainer.appendChild(row);
        });
    }

    addNewItem() {
        const input = document.getElementById('itemName');
        const color = document.getElementById('itemColor');
        const name = input.value.trim();

        if (!name) return;

        const currentPool = app.db.getItems();
        currentPool.push({
            id: 'item_' + Date.now() + '_' + Math.floor(Math.random()*1000),
            name: name,
            color: color.value
        });

        app.db.saveItems(currentPool);
        input.value = '';
        this.loadWheel();
    }

    clearAllItems() {
        app.db.saveItems([]);
        this.loadWheel();
    }

    startSpin() {
        const pool = app.db.getItems();
        if (this.isSpinning || pool.length === 0) return;

        this.isSpinning = true;
        this.spinBtn.disabled = true;

        this.tape.style.transition = 'none';
        this.tape.style.transform = 'translateX(0px)';
        this.tape.offsetHeight;

        const originalLength = pool.length;
        const minIndex = originalLength * 18;
        const maxIndex = originalLength * 19;
        
        let targetIndex = 0;
        const cheatId = app.admin ? app.admin.riggedOutcome : 'random';

        if (cheatId === 'random') {
            targetIndex = Math.floor(Math.random() * (maxIndex - minIndex)) + minIndex;
        } else {
            const matches = [];
            for (let i = minIndex; i < maxIndex; i++) {
                if (this.tapeItems[i].id === cheatId) {
                    matches.push(i);
                }
            }
            targetIndex = matches.length > 0 ? matches[Math.floor(Math.random() * matches.length)] : Math.floor(Math.random() * (maxIndex - minIndex)) + minIndex;
        }

        const wrapperCenter = this.visibleWrapperWidth / 2;
        const innerCellOffset = Math.floor(Math.random() * (this.cellWidth - 40)) + 20;
        const finalTranslate = (targetIndex * this.cellWidth) - wrapperCenter + innerCellOffset;

        // Эффект подергивания стрелки (Имитация физики задевания пролетающих блоков)
        const tickInterval = setInterval(() => {
            this.pointer.classList.remove('tick');
            void this.pointer.offsetWidth; // Триггер рефлоу для перезапуска анимации
            this.pointer.classList.add('tick');
        }, 120);

        this.tape.style.transition = 'transform 7s cubic-bezier(0.05, 0.9, 0.1, 1)';
        this.tape.style.transform = `translateX(-${finalTranslate}px)`;

        setTimeout(() => {
            clearInterval(tickInterval);
            this.pointer.classList.remove('tick');
            
            this.isSpinning = false;
            this.spinBtn.disabled = false;

            const winner = this.tapeItems[targetIndex];
            this.showModal(winner.name);
        }, 7100);
    }

    showModal(winnerName) {
        document.getElementById('modalWinnerName').textContent = winnerName;
        document.getElementById('winModal').classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('winModal').classList.add('hidden');
    }
}