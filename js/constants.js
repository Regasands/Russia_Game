export const HEIGHT = 800
export const WIDTH = 500
export const BUTTON_COUNT = 6
export const BUTTONSIZE = Math.floor(Math.min(WIDTH, window.innerWidth) / BUTTON_COUNT)
export const buttons_game = ['profit', 'passive', 'vote', 'update', 'shop', 'setting']
export const button_passive = ['home', 'real_estate', 'village_business', 'investments', 'shadow_economy', 'smile_face']
export const wait_enimation = 0.05


export const character = {
    // Базовые ресурсы
    money: 10000,
    diamonds: 0,
    reputation: 0, // Репутация в деревне
    energy: 100, // Дневной запас энергии
    max_energy: 100, // Максимальная энергия


    //кд состояний
    energy_recovery: 20,
    hungry_gap: 10,
    hp_gap: 10,

    
    // Прогресс
    days: 0,
    total_earned: 0, // Всего заработано за всё время
    
    // Характеристики
    hp: 100,

    // Идентификация
    // как сделаем, будет на каждой локайии по 10 персонажей
    // Думаю персонажи должны иметь свои бонусы их сджелаю в отдельном файле,
    // Который при надевании персонража будет улучшать эти статы 
    id_character: 0,
    id_user: 0,
    name: "Новичок", // Имя персонажа
    
    // Состояния
    hungry: 100,
    vote: 0,
    background: 0,
    key_bid: 0.1,
    

    buffs: {
        harvest_boost: 0, // Бонус к урожаю (%)
        price_discount: 0 // Скидка на покупки (%)
    }
};




export const character_passive = {
    real_estate: {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
    },
    village_business: {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
    },

    investments: {
        0: {
            count: 0,
            current_price: 0,
        },
        1: {
            count: 0,
            current_price: 0,
        },
        2: {
            count: 0,
            current_price: 0,
        },
        3: {
            count: 0,
            current_price: 0,
        },
        4: {
            count: 0,
            current_price: 0,
        },
    },

    shadow_economy: {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
    }

}



export const passive_income = {
    'real_estate': {
        0: {
            name: "Курятник",
            description: "Продажа яиц соседям",
            level: 0,
            income: l => 20 * Math.pow(1.2, l),
            cost: l => 50 * Math.pow(1.15, l)
        },
        1: {
            name: "Огород",
            description: "Выращивание овощей",
            level: 0,
            income: l => 30 * Math.pow(1.25, l),
            cost: l => 80 * Math.pow(1.2, l)
        },
        2: {
            name: "Сарай",
            description: "Хранение и перепродажа",
            level: 0,
            income: l => 40 * Math.pow(1.3, l),
            cost: l => 120 * Math.pow(1.25, l)
        },
        3: {
            name: "Дом сдаётся",
            description: "Аренда комнат",
            level: 0,
            income: l => 50 * Math.pow(1.35, l),
            cost: l => 200 * Math.pow(1.3, l)
        },
        4: {
            name: "Магазин",
            description: "Деревенский ларек",
            level: 0,
            income: l => 60 * Math.pow(1.4, l),
            cost: l => 300 * Math.pow(1.35, l)
        }
    },

    // 2. Сельский бизнес (ID 5-9)
    'village_business': {
        0: {
            name: "Пасека",
            description: "Мёд на продажу",
            level: 0,
            income: l => 40 * Math.pow(1.25, l),
            cost: l => 150 * Math.pow(1.2, l)
        },
        1: {
            name: "Корова",
            description: "Молоко и творог",
            level: 0,
            income: l => 50 * Math.pow(1.3, l),
            cost: l => 180 * Math.pow(1.25, l)
        },
        2: {
            name: "Трактор",
            description: "Аренда техники",
            level: 0,
            income: l => 70 * Math.pow(1.35, l),
            cost: l => 250 * Math.pow(1.3, l)
        },
        3: {
            name: "Баня",
            description: "Платная баня для всех",
            level: 0,
            income: l => 60 * Math.pow(1.3, l),
            cost: l => 220 * Math.pow(1.25, l)
        },
        4: {
            name: "Извоз",
            description: "Перевозка людей",
            level: 0,
            income: l => 5 * Math.pow(1.4, l),
            cost: l => 200 * Math.pow(1.35, l)
        }
    },

    // 3. Инвестиции (ID 10-14)
    'investments': {
        0: {
            name: "Сберкнижка",
            description: "Банковские проценты",
            cost: 100,
            chance: bid => 0.25 / (bid + 1),
            delay: 90
        },
        1: {
            name: "Скот",
            description: "Покупка/продажа животных",
            cost: 200,
            chance: bid => 0.35 / (bid + 1),
            delay: 60
        },
        2: {
            name: "Зерно",
            description: "Спекуляция урожаем",
            chance: bid => 0.5 / (bid + 1),
            cost: 400,
            delay: 30
        },
        3: {
            name: "Инструменты",
            description: "Аренда соседям",
            chance: bid => 0.2 / (bid + 1),
            cost: 20,
            delay: 15
        },
        4: {
            name: "Ломбард",
            cost: 1000,
            description: "Под залог вещей",
            chance: bid => 0.6 / (bid + 1),
            delay: 7
        }
    },

    // 4. Теневой бизнес (ID 15-19)
    'shadow_economy': {
        0: {
            name: "Самогон",
            description: "Наливайка в гараже",
            risk: 0.3,
            income: l => 80* Math.pow(1.5, l),
            cost: l => 150 * Math.pow(1.4, l),
            raid: l => 0.02 * l
        },
        1: {
            name: "Браконьерство",
            description: "Лесная охота",
            risk: 0.4,
            income: l => 100 * Math.pow(1.6, l),
            cost: l => 200 * Math.pow(1.5, l),
            raid: l => 0.03 * l
        },
        2: {
            name: "Солярка",
            description: "Топливо со склада",
            risk: 0.5,
            income: l => 120 * Math.pow(1.7, l),
            cost: l => 300 * Math.pow(1.6, l),
            raid: l => 0.05 * l
        },
        3: {
            name: "Карты",
            description: "Подпольный покер",
            risk: 0.6,
            income: l => 150 * Math.pow(1.8, l),
            cost: l => 400 * Math.pow(1.7, l),
            raid: l => 0.07 * l
        },
        4: {
            name: "Куры",
            description: "Подпольные бои",
            risk: 0.7,
            income: l => 200 * Math.pow(2.0, l),
            cost: l => 500 * Math.pow(1.8, l),
            raid: l => 0.1 * l
        }
    }
}