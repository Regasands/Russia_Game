export const HEIGHT = 800
export const WIDTH = 500
export const BUTTON_COUNT = 6
export const BUTTONSIZE = Math.floor(Math.min(WIDTH, window.innerWidth) / BUTTON_COUNT)
export const buttons_game = ['profit', 'passive', 'vote', 'update', 'shop', 'setting']
export const button_passive = ['', 'real_estate', 'village_business', 'investments', 'shadow_economy', 'smile_face']
export const button_profit = ['', 'upgrade', 'new_character', 'new_background', 'exchanger', 'new_event']
export const button_vote = ['', '', 'recive', 'emotion', 'boost', '']
export const wait_enimation = 0.05



// Характеристики самого персонажа

export const character = {
    // Базовые ресурсы
    money: 100,
    diamonds: 10,
    reputation: 0,
    energy: 200, 
    time_game: 20,
    cost_diamond: 100,


    // прокачиваемые  значения 
    chance_crete: 0,
    click_boost: 0,
    energy_max: 0,
    energy_recovery: 0,

    // временные баффы


    
    // Прогресс
    days: 0,
    total_earned: 0, // Всего заработано за всё время

    // Бусты даваемые персонажими  множетли
    boost: {
        luck: 0,
        click: 1,
        crete: 1,
        income: 1,
        energy_max: 1,
        energy_recovery: 1,
    },
    

    id_character: 0,
    id_background: 0,
    is_ru: true,
    is_rain: true,
    
    // Состояния
    votes: 100,
    key_bid: 0.1,

    // нужно для обучения
    is_first_game: true,
    
};


// пассивный доход
export const character_object_vote = {
    0: {
        name: 'Помощь нуждающимся семьям',
        cost_open: 500,
        dealy_cost: 50,
        description: "Поддержка многодетных и малоимущих семей деревни продуктами и одеждой",
        vote: 50,
        character_open: false
    },
    1: {
        name: 'Ремонт деревенской школы',
        cost_open: 1000,
        dealy_cost: 200,
        description: "Обновление учебных классов и закупка современного оборудования для школы",
        vote: 300,
        character_open: false
    },
    2: {
        name: 'Благоустройство центра деревни',
        cost_open: 7000,
        dealy_cost: 900,
        description: "Создание зоны отдыха, установка скамеек и детской площадки",
        vote: 800,
        character_open: false
    },
    3: {
        name: 'Строительство фельдшерского пункта',
        cost_open: 10000,
        dealy_cost: 1200,
        description: "Организация медицинского пункта для оказания первой помощи жителям",
        vote: 1000,
        character_open: false
    },
}


// бонусы от голосов 

export const passsive_vote_boost = {
    0: {
        name: "Поддержка общины",
        description: "Жители ценят вашу помощь и активнее поддерживают ваши инициативы",
        requirements_vote: 100,
        effect: {
            click: 1.2
        }
    },
    1: {
        name: "Удачливый фермер",
        description: "Ваша помощь сельскому хозяйству приносит неожиданные бонусы",
        requirements_vote: 350,
        effect: {
            luck: 1.5,
            income: 1.3
        }
    },
    2: {
        name: "Энергия деревни",
        description: "Общественные работы повышают выносливость и продуктивность жителей",
        requirements_vote: 800,
        effect: {
            energy_max: 1.8,
            energy_recovery: 1.6
        }
    },
    3: {
        name: "Мастер на все руки",
        description: "Развитие инфраструктуры учит жителей эффективнее использовать ресурсы",
        requirements_vote: 1500,
        effect: {
            crete: 2.0,
            click: 1.4
        }
    },
    // 4: {
    //     name: "Процветающая деревня",
    //     description: "Комплексное развитие приносит синергетический эффект всем сферам жизни",
    //     requirements_vote: 2500,
    //     effect: {
    //         luck: 2.0,
    //         income: 1.7,
    //         crete: 1.5,
    //         energy_recovery: 1.4
    //     }
    // }
}


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
            delay: 0,
            current_price: 100,
        },
        1: {
            count: 0,
            delay: 0,
            current_price: 20,
        },
        2: {
            count: 0,
            delay: 0,
            current_price: 400,
        },
        3: {
            count: 0,
            delay: 0,
            current_price: 20,
        },
        4: {
            count: 0,
            delay: 0,
            current_price: 10000,
        },
    },

    shadow_economy: {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
    },

}

export const character_open_hero = {
    0: {
        is_open: true,
        is_wear: true,
    },
    1: {
        is_open: false,
        is_wear: false,
    },
    2: {
        is_open: false,
        is_wear: false,
    },
    3: {
        is_open: false,
        is_wear: false,
    },
    4: {
        is_open: false,
        is_wear: false,
    }
};

export const character_open_background = {
    0: {
        is_open: true,
        is_wear: true,
    },
    1: {
        is_open: false,
        is_wear: false,
    },
    2: {
        is_open: false,
        is_wear: false,
    },
    3: {
        is_open: false,
        is_wear: false,
    },
    4: {
        is_open: false,
        is_wear: false,
    },
    5: {
        is_open: false,
        is_wear: false,
    }
}

export const character_boost = {
    0 : {
        time_start: 0,
        count: 0
     },
    1 : {
        time_start: 0,
        count: 0
     },
    2 : {
        time_start: 0,
        count: 0
     },
}


// система инвестицый для пассивного дохода

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
            name: "Банк Монеточка",
            description: "Банковские проценты",
            cost: 100,
            chance: bid => 0.55 / (bid + 1),
            delay: 60
        },
        1: {
            name: "Скот",
            description: "Покупка/продажа животных",
            cost: 200,
            chance: bid => 0.5 / (bid + 1),
            delay: 23
        },
        2: {
            name: "Зерно",
            description: "Спекуляция урожаем",
            chance: bid => 0.45 / (bid + 1),
            cost: 400,
            delay: 15
        },
        3: {
            name: "Инструменты",
            description: "Аренда соседям",
            chance: bid => 0.43 / (bid + 1),
            cost: 20,
            delay: 8
        },
        4: {
            name: "Ломбард",
            cost: 1000,
            description: "Под залог вещей",
            chance: bid => 0.4 / (bid + 1),
            delay: 5
        }
    },

    // 4. Теневой бизнес (ID 15-19)
    'shadow_economy': {
        0: {
            name: "Самогон",
            description: "Наливайка в гараже",
            risk: 0.3,
            income: l => 80* Math.pow(1.5, l),
            cost: l => 250 * Math.pow(1.4, l),
            raid: l => 0.02 * l
        },
        1: {
            name: "Браконьерство",
            description: "Лесная охота",
            risk: 0.4,
            income: l => 100 * Math.pow(1.6, l),
            cost: l => 400 * Math.pow(1.5, l),
            raid: l => 0.03 * l
        },
        2: {
            name: "Солярка",
            description: "Топливо со склада",
            risk: 0.5,
            income: l => 120 * Math.pow(1.7, l),
            cost: l => 500 * Math.pow(1.6, l),
            raid: l => 0.05 * l
        },
        3: {
            name: "Карты",
            description: "Подпольный покер",
            risk: 0.6,
            income: l => 150 * Math.pow(1.8, l),
            cost: l => 800 * Math.pow(1.7, l),
            raid: l => 0.07 * l
        },
        4: {
            name: "Куры",
            description: "Подпольные бои",
            risk: 0.7,
            income: l => 200 * Math.pow(2.0, l),
            cost: l => 1000 * Math.pow(1.8, l),
            raid: l => 0.1 * l
        }
    }
}

// глобальные стили для всех кнопок и карт
export const global_style = {
    investment: {
        color: "#FFFF96",   // Светло-желтый
        icon: "📈",
        textColor: "#8B4513" // Коричневый
    },
    real_estate: {
        color: "#ADD8E6",   // Голубой
        icon: "🏠",
        textColor: "#00008B" // Темно-синий
    },
    village_business: {
        color: "#90EE90",   // Светло-зеленый
        icon: "🌾",
        textColor: "#006400" // Темно-зеленый
    },
    shadow_economy: {
        color: "#A9A9A9",   // Серый
        icon: "🕶️",
        textColor: "#2F4F4F" // Темно-серый
    },

    click_boost: {
        color: "#FFD700",   // Золотой
        icon: "💎",        // Алмаз (символ эффективности)
        textColor: "#8B0000", // Тёмно-красный
        bgGradient: "linear-gradient(135deg, #FFFACD, #FFD700)" // Лимонный → золотой
    },

    // Критический урожай
    chance_crete: {
        color: "#FFA500",   // Оранжевый
        icon: "🌟",        // Звезда (удача)
        textColor: "#4B0082", // Индиго
        bgGradient: "linear-gradient(135deg, #FFDAB9, #FFA500)" // Персиковый → оранжевый
    },

    // Энергия фермера
    energy_recovery: {
        color: "#00BFFF",   // Голубой
        icon: "⚡",         // Молния
        textColor: "#000080", // Темно-синий
        bgGradient: "linear-gradient(135deg, #E0FFFF, #00BFFF)" // Светло-голубой → ярко-голубой
    },

    // Амбар
    energy_max: {
        color: "#D2B48C",   // Песочный
        icon: "🏚️",        // Амбар
        textColor: "#654321", // Коричневый
        bgGradient: "linear-gradient(135deg, #F5DEB3, #D2B48C)" // Пшеничный → песочный

    },
    character_selection: {
        color: "#FFA07A",   // Светло-коралловый (теплый и дружелюбный)
        icon: "👨‍🌾",        // Фермер
        textColor: "#800000", // Тёмно-бордовый
        bgGradient: "linear-gradient(135deg, #FFE4E1, #FFA07A)" // Розовый → коралловый
    },

    // **Выбор фона (Деревенский пейзаж)**
    background_selection: {
        color: "#98FB98",   // Светло-зелёный (природа, поля)
        icon: "🌄",        // Горы и солнце
        textColor: "#2E8B57", // Морская зелень
        bgGradient: "linear-gradient(135deg, #F0FFF0, #98FB98)" // Медовый → светло-зелёный
    }
};

// система upgrade для profit
export const upgrades = {
    // Основной клик (мощный рост до 1000+)
    click_boost: {
        name: "Количество кликов",
        description: "Резко увеличивает количество кликов!",
        level: 0,
        maxLevel: 15,
        cost: (level) => Math.round(400 + 10 * Math.pow(2.4, level)), 
        value: (level) => Math.round(Math.pow(1.6, level)), 
    },

    // Критический урожай (3x)
    chance_crete: {
        name: "Золотая пшеница",
        description: "Сделай x5 клик, без потери энергии! ",
        level: 0,
        maxLevel: 15,
        cost: (level) => Math.round(200 + 100 * Math.pow(1.7, level)), // 80, 136, 231...
        value: (level) => 0.05 + level * 0.03, // 5%, 8%... (50% на 15 ур.)
    },

    // Энергия (тратится на клики, восстанавливается)
    energy_recovery: {
        name: "Дневной буст",
        description: "Увеличивае буст энергии",
        level: 0,
        maxLevel: 15,
        cost: (level) => Math.round(300 * Math.pow(1.9, level)), // 120, 192, 307...
        value: (level) => Math.round(50 + Math.pow(2, level))
    },
    // Вместимость амбара (x10)
    energy_max: {
        name: "Больше энергии!!!",
        description: "Увеиличивает максимальную энергию ",
        level: 0,
        maxLevel: 10,
        cost: (level) => Math.round(400 * Math.pow(2.3, level)), // 150, 225, 338...
        value: (level) => Math.round(199 + Math.pow(1.5, level * 3.3)), // +1000, +1500... (+8500 на 15 ур.)
    }
};
// Смена дня и ночи 

export const DAY_NIGHT_CYCLE = {
    NIGHT: {
        color: 0x020210,         // Почти чёрный с лёгким синим оттенком
        opacity: 0.45,           // Очень тёмная ночь
        start: 21,
        end: 5,
        name: "NIGHT"
    },
    DAWN: {
        color: 0x3a2e1b,         // Тёмный кофейный рассвет
        opacity: 0.3,
        start: 5,
        end: 11,
        name: "DAWN"
    },
    DAY: {
        color: 0x121212,         // Тёмно-серый (вместо чистого чёрного)
        opacity: 0.15,           // Лёгкое затемнение даже днём
        start: 12,
        end: 18,
        name: "DAY"
    },
    DUSK: {
        color: 0x4a251a,         // Тёмный красно-коричневый закат
        opacity: 0.35,
        start: 18,
        end: 21,
        name: "DUSK"
    }
};

export const heroes_info = {
    0: {
        type: 'hero',
        name: "🥔Работяга ",
        description: "Бустит клики на 2x",
        scale: 0.33,
        price: 150,
        effect: {
            click: 2
        }
    },
    1: { 
        type: 'hero',
        name: "Сбережливый мальчишка",
        description: "Запас и восстоновление энергии 2x",
        price: 250,
        scale: 0.3,
        effect: {
            energy_max: 2,
            energy_recovery: 2,

        }
    },
    2: {  
        type: 'hero',
        name: "🐝Инвестор от бога",
        description: "Благодаря пчелкам очень везучий парниша",
        price: 600,
        scale: 0.33,
        effect: {
            luck: 0.15
        }
    },
    3: { 
        type: 'hero',
        name: "Точный  мужик",
        scale: 0.33,
        description: "Крит шанс 2x",
        price: 300,
        effect: {
            crete: 2
        }
    },
    4: { 
        type: 'hero',
        name: "🚜 Тракторный Тиран",
        scale: 0.3,
        description: "Все его бизнесы приносят 2x дохода !",
        price: 1000,
        effect: {
            income: 2
        }
    }
};

export const backgrounds_info = {
    0: {
        type: 'background',
        name: "🌾 Деревенское поле",
        description: "Простое поле с золотистыми колосьями. +10% к пассивному доходу доходу",
        scale: 0.25,
        price: 200,
        effect: {
            income: 1.1
        }
    },
    1: {
        type: 'background',
        name: "🏡 Уютная ферма",
        description: "Маленький домик с огородом. Восстанавливает +1 энергию в минуту",
        price: 350,
            scale: 0.2,
        effect: {
            energy_recovery: 1
        }
    },
    2: {
        type: 'background',
        name: "🌻 Подсолнуховый рай",
        description: "Яркие подсолнухи тянутся к солнцу. +15% к удаче",
        scale: 0.2,
        price: 500,
        effect: {
            luck: 0.15
        }
    },
    3: {
        type: 'background',
        name: "🌧️ Дождливый пейзаж",
        description: "Теплый летний дождь поливает crops. Больше в 1.5x кликов за раз ",
        scale: 0.2,
        price: 450,
        effect: {
            click: 1.2
        }
    },
    4: {
        type: 'background',
        name: "🌄 Горная ферма",
        description: "Ферма на склоне горы с потрясающим видом. +25% к максимальной энергии",
            scale: 0.2,
        price: 600,
        effect: {
            energy_max: 1.25
        }
    },
    5: {
        type: 'background',
        name: "🏭 Индустриальная зона",
        description: "Современные фермерские технологии. Все бусты эффективнее на 10%",
        scale: 0.2,
        price: 800,
        effect: {
            all_effects: 1.1
        }
    }
};

export const time_boost = {
    0: {
        name: "⚡ Турбо-клики",
        description: "клики дают 10x монет",
        time: 30,
        cost: 10,
        effect: {
            click: 10
        }
    },
    1: {
        name: "💥 Критический разгром",
        description: "10 x сила крита",
        time: 5, 
        cost: 15,
        effect: {
            crete: 10,
        }
    },
    2: {
        name: "🔋 Энерджайзер",
        description: "восстановление энергии + ускоренная регенерация",
        time: 45,
        cost: 20,
        effect: {
            energy_recovery: 10
        }
    }
}

