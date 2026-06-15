class DatabaseModule {
    constructor() {
        this.dbKey = 'stealth_roulette_pool';
        this.initDatabase();
    }

    initDatabase() {
        // Задаем нейтральный дефолтный список, имитирующий обычный сайт выбора решений
        if (!localStorage.getItem(this.dbKey)) {
            const defaultPool = [
                { id: "p1", name: "Вариант А", color: "color-blue" },
                { id: "p2", name: "Вариант Б", color: "color-purple" },
                { id: "p3", name: "Вариант В", color: "color-gold" },
                { id: "p4", name: "Вариант Г", color: "color-gray" }
            ];
            this.saveItems(defaultPool);
        }
    }

    getItems() {
        return JSON.parse(localStorage.getItem(this.dbKey)) || [];
    }

    saveItems(items) {
        localStorage.setItem(this.dbKey, JSON.stringify(items));
    }
}