import {
    HEIGHT,
    WIDTH,
    backgrounds_info,
    character_open_background,
    character_open_hero,
    character_passive,
    global_style,
    heroes_info,
} from "./constants.js";

// в идеале это конечно все упростить но этим я буду заниматься очень не скоро. вначале хочу сделать основную логику.
// запустить игру в бета релиз
// Создание карточек для пасивного дохода сценаи passive 
export function create_invest_card(obj, x, y, cardlist, index, isRu, gameData) {
    const style = global_style.investment

    let card = add([
        rect(WIDTH, HEIGHT / 10, { radius: 10 }),
        area(),
        pos(x, y),
        z(100),
        anchor("center"),
        color(style.color),
        outline(2, rgb(100, 100, 100)),
        opacity(0.6),
        fixed(),
        `invest${obj.name}`,
    ]);
    let data = {
        size: 22,
        font: "sans-serif",
        align: 'left',
        lineSpacing: 8
    }

    // Используем перевод
    card.add([
        text(isRu ? obj.name : (obj.name_eng || obj.name), data),
        pos(0, -50),
        anchor('center'),
        color(style.textColor)
    ])
    card.add([
        text(isRu ? `Описание: ${obj.description}` : `Description: ${obj.description_eng || obj.description}`, data),
        pos(-10, -20),
        color(style.textColor),
        anchor('center'),
    ])
    let obj2 = gameData.character_passive.investments[index]
    card.add([
        text(isRu
            ? `Цена: ${Math.floor(obj2.current_price)} / Количество у вас ${obj2.count}`
            : `Price: ${Math.floor(obj2.current_price)} / You have ${obj2.count}`, data),
        pos(-10, 10),
        color(style.textColor),
        anchor('center'),
    ])


    const buyBtn = card.add([
        rect(120, 35, { radius: 6 }),
        pos(-150, 45),
        anchor("center"),
        area(),
        z(999),
        color(rgb(100, 200, 100)),
        outline(2, rgb(50, 150, 50)),
        `invest_${obj.name}_buy`,
        { 
            last_time: time(),
        }
        ])

    buyBtn.add([
        text(isRu ? 'Купить' : 'Buy', data),
        color(style.textColor),
        pos(-30, -10)
    ])

    const seelBtn = card.add([
        rect(120, 35, { radius: 6 }),
        pos(150, 45),
        z(999),
        anchor("center"),
        area(),
        color(rgb(200, 100, 100)),
        outline(2, rgb(150, 50, 50)),
        `invest_${obj.name}_sell`,
        { 
            last_time: time(),
        }
    ])
    seelBtn.add([
        text(isRu ? 'Продать' : 'Sell', data),
        color(style.textColor),
        pos(-40, -10)
    ])
    cardlist.push(card)
    return card

}


export function createCard(obj, level, isMaxLevel,  current_cost, x, y, cardlist, character_part, isRu) {
        const currentIncome =  Math.round(obj.income(level));
        let nextIncome = isMaxLevel ? null : Math.round(obj.income(level + 1));
        let card;


        const style = global_style[character_part] || {
            color: rgb(30, 35, 45),
            icon: "",
            textColor: rgb(0, 0, 0)
        };

    // Создаем основу карточки
        card = add([
            rect(WIDTH, HEIGHT / 10, { radius: 10 }),
            area(),
            pos(x, y),
            anchor("center"),
            color(style.color),
            outline(2, isMaxLevel ? rgb(100, 100, 100) : rgb(0, 0, 0)),
            opacity(0.6),
            fixed(),
            { 
                isMaxLevel: isMaxLevel,
                category: character_part
            },
            `passive_card_${obj.name}`,
        ]);

        // Название объекта с иконкой

        card.add([
            text(`${style.icon} ${isRu ? obj.name : (obj.name_eng || obj.name)}`, {
                size: 28,
                font: "sans-serif",
                width: WIDTH - 80,
                align: "center",
                lineSpacing: 8
            }),
            pos(0, -60),
            anchor("center"),
            color(style.textColor)
        ]);


        // Остальные элементы с тематическим цветом текста
        const elements = [
            {
                text: isRu ? `Описание: ${obj.description}` : `Description: ${obj.description_eng || obj.description}`,
                pos: [-10, -20],
                size: 18,
                align: "left"
            },
            {
                text: isRu
                    ? `Уровень: ${level}${isMaxLevel ? " (MAX)" : ""}`
                    : `Level: ${level}${isMaxLevel ? " (MAX)" : ""}`,
                pos: [244, 30],
                size: 18,
                align: "left"
            },
            {
                text: isMaxLevel
                    ? (isRu ? "Макс. уровень достигнут" : "Max level reached")
                    : (isRu ? `Цена улучшения: ${current_cost}` : `Upgrade cost: ${current_cost}`),
                pos: [240, 0],
                size: 18,
                align: "left"
            },
            {
                text: isRu
                    ? `Текущий доход: ${currentIncome}` + (isMaxLevel ? "" : `\nСледующий доход: ${nextIncome}`)
                    : `Current income: ${currentIncome}` + (isMaxLevel ? "" : `\nNext income: ${nextIncome}`),
                pos: [-5, 20],
                size: 18,
                align: "left"
            }
        ];

        elements.forEach(el => {
            card.add([
                text(el.text, {
                    size: el.size,
                    font: "sans-serif",
                    width: WIDTH - (el.align === "left" ? 40 : 30),
                    align: el.align,
                    lineSpacing: 8
                }),
                pos(...el.pos),
                anchor("center"),
                color(style.textColor)
            ]);
        });

        cardlist.push(card);
        return card

}


// создание карт для улучшения персонажа profit

export function  create_card_upgrade(obj, x, y, cardlist, isMaxLevel, level, type, isRu){
    let current_boost
    let next_boost
        if (obj.name == 'Золотая пшеница') {

            current_boost =  Math.floor(obj.value(level));
            next_boost = isMaxLevel ? null : Math.floor(obj.value(level + 1));
        }
        else {
            current_boost =  Math.round(obj.value(level));
            next_boost = isMaxLevel ? null : Math.round(obj.value(level + 1));
        }

        const current_cost = Math.round(obj.cost(level))
        let card;

        const style = global_style[type]

    // Создаем основу карточки
        card = add([
            rect(WIDTH, HEIGHT / 10, { radius: 10 }),
            area(),
            pos(x, y),
            anchor("center"),
            color(style.color),
            outline(2, isMaxLevel ? rgb(100, 100, 100) : rgb(0, 0, 0)),
            opacity(0.6),
            fixed(),
            `profit_card_${obj.name}`,
        ]);

        // Название объекта с иконкой

        card.add([
            text(`${style.icon} ${isRu ? obj.name : (obj.name_eng || obj.name)}`, {
                size: 28,
                font: "sans-serif",
                width: WIDTH - 80,
                align: "center",
                lineSpacing: 8
            }),
            pos(0, -60),
            anchor("center"),
            color(style.textColor)
        ]);


        // Остальные элементы с тематическим цветом текста
        const elements = [
            {
                text: isRu ? `Описание: ${obj.description}` : `Description: ${obj.description_eng || obj.description}`,
                pos: [-10, -20],
                size: 18,
                align: "left"
            },
            {
                text: isRu
                    ? `Уровень: ${level}${isMaxLevel ? " (MAX)" : ""}`
                    : `Level: ${level}${isMaxLevel ? " (MAX)" : ""}`,
                pos: [244, 30],
                size: 18,
                align: "left"
            },
            {
                text: isMaxLevel
                    ? (isRu ? "Макс. уровень достигнут" : "Max level reached")
                    : (isRu ? `Цена улучшения: ${current_cost}` : `Upgrade cost: ${current_cost}`),
                pos: [240, 0],
                size: 18,
                align: "left"
            },
            {
                text: isRu
                    ? `Текущий буст: ${current_boost}` + (isMaxLevel ? "" : `\nСледующий буст: ${next_boost}`)
                    : `Current boost: ${current_boost}` + (isMaxLevel ? "" : `\nNext boost: ${next_boost}`),
                pos: [-5, 20],
                size: 18,
                align: "left"
            }
        ];

        elements.forEach(el => {
            card.add([
                text(el.text, {
                    size: el.size,
                    font: "sans-serif",
                    width: WIDTH - (el.align === "left" ? 40 : 30),
                    align: el.align,
                    lineSpacing: 8
                }),
                pos(...el.pos),
                anchor("center"),
                color(style.textColor)
            ]);
        });

        cardlist.push(card);
        return card

}



export function create_card_hero_background(index, type, cardlist, isRu, gameData) {
    let obj
    let is_open
    let is_wear
    if (type == 'hero') {
        obj = heroes_info[index]; 
        is_open = gameData.character_open_hero[index].is_open;
        is_wear = gameData.character_open_hero[index].is_wear;
    } else {
        obj = backgrounds_info[index]; 
        is_open = gameData.character_open_background[index].is_open;
        is_wear = gameData.character_open_background[index].is_wear
    };


    const text_1 = !is_open
        ? (isRu ? `Купить за ${obj.price} кристаллов` : `Buy for ${obj.price} crystals`)
        : !is_wear
            ? (isRu ? 'Надеть' : 'Wear')
            : (isRu ? 'Уже используется' : 'Already equipped');

    

    // Создаем карточку персонажа
    const card = add([
        rect(WIDTH, HEIGHT - 200, { radius: 20 }),
        pos(WIDTH / 2, HEIGHT / 2),
        anchor("center"),
        color(rgb(30, 30, 50)), // Основной цвет карточки
        opacity(0),
        z(100),
        fixed(),
        state("hidden", ["hidden", "visible"]),
    ]);

    // Рамка для текстового блока (название + описание + эффекты)
    const textFrame = card.add([
        rect(WIDTH - 40, 150, { radius: 12 }), // Размеры рамки
        pos(0, -210),
        anchor("center"),
        color(rgb(50, 50, 80)), // Темно-синий фон рамки
        outline(4, rgb(255, 160, 122)), // Оранжевая обводка (#FFA07A)
        z(99),
        fixed()
    ]);

    // Имя персонажа в рамке
    textFrame.add([
        text(`${obj.name} ${global_style.character_selection.icon}`, {
            size: 24,
            font: "bold",
            styles: {
                color: rgb(255, 160, 122), // Оранжевый (#FFA07A)
                outlineColor: rgb(128, 0, 0), // Темно-красный (#800000)
                outlineWidth: 4,
            }
        }),
        pos(0, -50),
        anchor("center"),
        z(101)
    ]);

    // Описание персонажа
    textFrame.add([
        text(isRu ? obj.description : (obj.description_eng || obj.description), {
            size: 20,
            font: "regular",
            width: WIDTH - 80,
            styles: {
                color: rgb(255, 255, 255),
                outlineColor: rgb(0, 0, 0),
                outlineWidth: 2,
            }
        }),
        pos(0, -10),
        anchor("center"),
        z(101)
    ]);

    // Эффекты персонажа
    const effectsText = Object.entries(obj.effect)
        .map(([key, value]) => {
            const effectName = {
                luck: "🍀 Удача",
                click: "👆 Сила клика",
                energy_max: "⚡ Макс. энергия",
                energy_recovery: "🔄 Восстановление",
                crete: "💥 Крит. шанс",
                income: "💰 Доход"
            }[key] || key;
            
            const unit = key === 'luck' ? '%' : 'x';
            return `${effectName}: +${value}${unit}`;
        }).join('   '); // Разделитель между эффектами

    textFrame.add([
        text(effectsText, {
            size: 20,
            font: "bold",
            styles: {
                color: rgb(200, 255, 200), // Светло-зеленый
                outlineColor: rgb(0, 80, 0), // Темно-зеленый
                outlineWidth: 2,
            }
        }),
        pos(0, 40),
        anchor("center"),
        z(101)
    ]);

    const prevBtn = add([
        sprite("prev_button"),
        pos(30, HEIGHT / 2),
        anchor("center"),
        scale(1.3),
        area(),
        z(101),
        "nav_button",
        { type: -1, target: type }
    ]);

    // Кнопка "Вперед"
    const nextBtn = add([
        sprite("next_button"),
        pos(WIDTH - 30, HEIGHT / 2),
        anchor("center"),
        scale(1.3),
        area(),
        z(101),
        "nav_button",
        { type: 1, target: type }
    ]);

    // Основная кнопка (Купить/Надеть)
    const mainBtn = add([
        rect(400, 60, { radius: 15 }),
        pos(WIDTH / 2, HEIGHT - 140),
        anchor("center"),
        color(rgb(160, 65, 65,)),
        outline(4, rgb(255, 160, 122)),
        area(),
        z(101),
        fixed(),
        opacity(1),
        {
            index: index,
            type: type
        },
        is_open ? "wear_button" : "buy_button",
    ]);


    mainBtn.add([
        text(text_1, {
            size: 28,
            font: "bold",
            styles: {
                color: rgb(255, 255, 255),
                outlineColor: rgb(0, 0, 0),
                outlineWidth: 4,
                shadowColor: rgb(0, 0, 0, 0.3),
                shadowOffset: vec2(2, 2)
            }
        }),
        anchor("center"),
        pos(0, 0) 
    ]);
    let object_vision;
    if (type == 'hero') {
        object_vision = add([
            sprite(`hero_${index}`),
            pos(WIDTH / 2, HEIGHT / 2 + 40),
            anchor('center'),
            scale(obj.scale),
        ]) 
    } else {
        object_vision = add([
            sprite(`background_${index}`),
            pos(WIDTH / 2, HEIGHT / 2 + 40),
            anchor('center'),
            scale(obj.scale),
        ]) 
    }


    cardlist.push(mainBtn, card, object_vision, nextBtn, prevBtn)
}

export function create_card_boost_list(boosts, listcard, isRu) {
    // Конфигурация дисплея бустов
    var boostsDisplay = {
        frame: {
            width: WIDTH - 20,
            height: 400,
            radius: 14,
            color: rgb(50, 50, 80),
            outline: { width: 4, color: rgb(255, 160, 122) }
        },
        title: {
            size: 23,
            color: rgb(255, 215, 0),
        },
        boostsList: [
            { icon: "🍀",  name: isRu ? "Удача" : "Luck",         key: "luck",             suffix: "%",   transform: (v) => v * 100 },
            { icon: "🖱️",  name: isRu ? "Сила клика" : "Click",   key: "click",            suffix: "x" },
            { icon: "💥",  name: isRu ? "Крит. удар" : "Crit",    key: "crete",            suffix: "x" },
            { icon: "🏭",  name: isRu ? "Пассив. доход" : "Passive", key: "income",        suffix: "x" },
            { icon: "🔋",  name: isRu ? "Макс. энергия" : "Max Energy", key: "energy_max", suffix: "x" },
            { icon: "🔄",  name: isRu ? "Регенерация" : "Regen",  key: "energy_recovery",  suffix: "x" }
        ],
        // Стиль текста
        textStyle: {
            size: 20,
            color: rgb(240, 240, 240),
            font: "sans-serif"
        }

        }
    // 1. Создаем рамку
    const boostFrame = add([
        rect(boostsDisplay.frame.width, boostsDisplay.frame.height, { 
            radius: boostsDisplay.frame.radius 
        }),
        pos(WIDTH / 2 , HEIGHT / 2),
        anchor("center"),
        color(boostsDisplay.frame.color),
        outline(boostsDisplay.frame.outline.width, boostsDisplay.frame.outline.color),
        z(100),
        opacity(0.3),
        fixed()
    ]);

    // 2. Добавляем заголовок
    boostFrame.add([
        text(isRu ? "🚀 Активные бусты" : "🚀 Active Boosts", {
            size: boostsDisplay.title.size,
            color: boostsDisplay.textStyle.color,
            font: boostsDisplay.textStyle.font
        }),
        pos(0, -215),
        anchor("center")
    ]);


    boostsDisplay.boostsList.forEach((boost, i) => {
        var yPos = -120 + i * 50;
        const value = boost.transform ? boost.transform(boosts[boost.key]) : boosts[boost.key];
        boostFrame.add([
            text(`${boost.icon} ${boost.name}: ${Math.floor(value)}${boost.suffix}`, {
                size: boostsDisplay.textStyle.size,
                color: boostsDisplay.textStyle.color,
                font: boostsDisplay.textStyle.font
            }),
            pos(0, yPos),
            anchor("center"),
            { boostKey: boost.key }
        ]);
    });

    listcard.push(boostFrame)

}


export function create_exchanger_card(cardlist, cost) {
    const style = {
        card: {
            color: rgb(94, 75, 50),             // Основной цвет - тёмное дерево
            outline: rgb(60, 45, 30),            // Края как старая доска
            opacity: 0.98,
            texture: "wood_rough",               // (опционально) имя текстуры
            noise: 0.1                           // Лёгкий "грязный" эффект
        },
        text: {
            color: rgb(240, 230, 210),           // Цвет пожелтевшей бумаги
            size: 22,
            font: "Georgia",                      // Классический шрифт
            titleSize: 26,
            titleColor: rgb(220, 180, 100)        // Цвет старого золота
        },
        buttons: {
            buy: {
                color: rgb(110, 85, 50),         // Коричневый как мешковина
                outline: rgb(80, 60, 35),
                hoverColor: rgb(130, 100, 60),
                texture: "fabric"                // Текстура мешковины
            },
            sell: {
                color: rgb(120, 70, 40),         // Ржаво-коричневый
                outline: rgb(90, 50, 30),
                hoverColor: rgb(140, 80, 50),
                texture: "metal_rust"             // Текстура ржавого металла
            },
            textColor: rgb(240, 230, 210),        // Как основной текст
            radius: 6                             // Лёгкое скругление
        },
        // Эффекты старины
        effects: {
            paperStains: true,                    // Пятна на "бумаге"
            nailHoles: 3                          // Количество "гвоздей" в углах
        }
    };

    let card = add([
        rect(WIDTH, HEIGHT / 10, { radius: 12 }),
        area(),
        pos(WIDTH / 2, HEIGHT / 2),
        z(100),
        anchor("center"),
        color(style.card.color),
        outline(2, style.card.outline),
        opacity(style.card.opacity),
        fixed(),
    ]);

    let data = {
        size: style.text.size,
        font: style.text.font,
        align: 'left',
        lineSpacing: 8
    }

    // Заголовок с неоновым акцентом
    card.add([
        text("💎 Обменник алмазов", { ...data, size: style.text.titleSize }),
        pos(0, -50),
        anchor('center'),
        color(style.text.titleColor)
    ])

    // Описание
    card.add([
        text("Покупайте и продавайте алмазы по курсу", data),
        pos(0, -20),
        color(style.text.color),
        anchor('center'),
    ])

    // Цена с иконкой
    card.add([
        text(`💰 Текущая цена: ${cost} продать, купить за ${cost * 20}`, data),
        pos(0, 10),
        color(style.text.titleColor),
        anchor('center'),
    ])

    const buyBtn = card.add([
        rect(120, 35, { radius: 6 }),
        pos(-150, 45),
        anchor("center"),
        area(),
        z(999),
        color(rgb(110, 85, 60)),    
        outline(2, rgb(80, 60, 40)), 
        `buy_diamond`,
        { 
            last_time: time(),
        }
        ])

    buyBtn.add([
        text('Купить', data),
        color(style.textColor),
        pos(-30, -10)
    ])

    const sellBtn = card.add([
        rect(120, 35, { radius: 6 }),
        pos(150, 45),
        z(999),
        anchor("center"),
        area(),
        color(rgb(120, 70, 50)),    
        outline(2, rgb(90, 50, 40)),
        `sell_diamond`,
        { 
            last_time: time(),
        }
    ])
    sellBtn.add([
        text('Продать', data),
        color(style.textColor),
        pos(-40, -10)
    ])
    cardlist.push(card)

}


export function create_boost_card(boostData, index, count, posX, posY, card_list, rew = false, is_ru = false) {
    const style = global_style.energy_recovery
    const card = add([
        rect(WIDTH - 10, 80, { radius: 12 }),
        area(),
        pos(posX, posY),
        anchor("center"),
        color(style.color),
        outline(2, rgb(0, 0, 0)),
        opacity(0.6),
        z(100),
        fixed(),
        {
                index: index
        },
        `boost_button_${boostData.name}`
    ]);


    // Заголовок с иконкой
    card.add([
        text(`${boostData.name}`, {
            size: 24,
            font: "sans-serif",
            width: WIDTH - 80,
            align: "center",
            lineSpacing: 8
        }),
        color(style.textColor),
        pos(0, -60),
        anchor("center"),
        z(2)
    ]);

    // Описание
    card.add([
        text(boostData.description, {
                size: 20,
                font: "sans-serif",
                width: WIDTH - 80,
                align: "center",
                lineSpacing: 8
            }),
        color(style.textColor),
        pos(0, -15),
        anchor("center"),
        z(2)
    ]);
    // Время действия и цена
    const texts = {
        ru: {
            time: 'сек',
            cost: rew ? '📺 За рекламу' : `💎 ${boostData.cost}`,
            available: `У вас есть: ${count}`
        },
        en: {
            time: 'sec', 
            cost: rew ? '📺 For ad' : `💎 ${boostData.cost}`,
            available: `You have: ${count}`
        }
    };

    const langTexts = is_ru ? texts.ru : texts.en;

    card.add([
        text(`⏱️ ${boostData.time}${langTexts.time} / ${langTexts.cost}`, {
                size: 20,
                font: "sans-serif", 
                width: WIDTH - 80,
                align: "center",
                lineSpacing: 8
            }),

        pos(100, 25),
        anchor("center"),
        z(2)
    ]);

    card.add([
        text(langTexts.available, {
                size: 20,
                font: "sans-serif",
                width: WIDTH - 80,
                align: "center", 
                lineSpacing: 8
            }),
        color(style.textColor),
        pos(-150, 25),
        anchor("center"),
        z(2)
    ]);

    card_list.push(card)
}

export function createDiamondsAdCard(x, y, cardlist,  is_interval, is_ru) {
    let name =   is_interval ? 'get_random_diamonds_rwd' : 'get_diamonds_rwd'
    const style = global_style.energy_recovery
    const card = add([
        rect(WIDTH - 10, 80, { radius: 12 }),
        pos(x, y),
        anchor("center"),
        color(style.color),
        outline(2, rgb(0, 0, 0)),
        opacity(0.6),
        z(100),
        area(),
        name,
    ]);

    // Текст описания
    card.add([
        text(is_ru ? "💎 Получить алмазы за рекламу" : "💎 Get diamonds for ad", {
            size: 24,
            font: "sans-serif",
            width: WIDTH - 80,
            align: "center",
            lineSpacing: 8
        }),
        color(style.textColor),
        pos(0, -60),
        anchor("center"),
        z(2)
    ]);

    // Количество алмазов
    let textt = is_ru 
        ? (is_interval ? 'Получить случайное количество 💎 от 1 до 250!' : 'Получить 100 💎')
        : (is_interval ? 'Get a random amount of 💎 from 1 to 250!' : 'Get 100 💎');
    card.add([
        text(textt,  {
            size: 20,
            font: "sans-serif",
            align: "center"
        }),
        pos(0, 10),
        anchor("center"),
        z(2)
    ]);
    cardlist.push(card)
}


export function create_vote_project_card(obj, x, y, cardlist, isRu) {
    const style = global_style.vote_project || {
        color: rgb(60, 80, 100),
        textColor: rgb(255, 255, 255)
    };

    // Создаем основу карточки
    const card = add([
        rect(WIDTH - 20, 120, { radius: 12 }),
        area(),
        pos(x, y),
        anchor("center"),
        color(style.color),
        outline(2, obj.character_open ? rgb(100, 200, 100) : rgb(100, 100, 100)),
        opacity(0.8),
        fixed(),
        `vote_project_${obj.name}`,
    ]);

    // Заголовок проекта
    card.add([
        text(isRu ? obj.name : (obj.name_eng || obj.name), {
            size: 24,
            font: "sans-serif",
            width: WIDTH - 60,
            align: "center",
            lineSpacing: 8
        }),
        pos(0, -40),
        anchor("center"),
        color(style.textColor)
    ]);

    // Описание проекта
    card.add([
        text(isRu ? obj.description : (obj.description_eng || obj.description), {
            size: 18,
            font: "sans-serif",
            width: WIDTH - 60,
            align: "center",
            lineSpacing: 6
        }),
        pos(0, -5),
        anchor("center"),
        color(style.textColor)
    ]);

    // Информация о стоимости и голосах
    const infoText = obj.character_open
        ? (isRu
            ? `💰 Стоимость: ${obj.dealy_cost}  в день|🗳️ Голоса: ${obj.vote} в день`
            : `💰 Cost: ${obj.dealy_cost} per day | 🗳️ Votes: ${obj.vote} per day`)
        : (isRu
            ? `🔒 Открытие: ${obj.cost_open}`
            : `🔒 Unlock: ${obj.cost_open}`);

    card.add([
        text(infoText, {
            size: 18,
            font: "sans-serif",
            width: WIDTH - 60,
            align: "center",
            lineSpacing: 6
        }),
        pos(0, 40),
        anchor("center"),
        color(style.textColor)
    ]);


    cardlist.push(card);
    return card;
}

export function create_vote_boost_card(obj, x, y, cardlist, currentVotes, isRu) {
    let isUnlocked = currentVotes >= obj.requirements_vote;
    const style = global_style.vote_boost || {
        color: rgb(100, 60, 120),
        textColor: rgb(255, 255, 255)
    };

    // Создаем основу карточки
    const card = add([
        rect(WIDTH - 20, 100, { radius: 12 }),
        area(),
        pos(x, y),
        anchor("center"),
        color(style.color),
        outline(2, isUnlocked ? rgb(150, 100, 200) : rgb(100, 100, 100)),
        opacity(0.8),
    ]);

    // Заголовок бонуса
    card.add([
        text(isRu ? obj.name : (obj.name_eng || obj.name), {
            size: 20,
            font: "sans-serif",
            width: WIDTH - 60,
            align: "center",
            lineSpacing: 8
        }),
        pos(0, -70),
        anchor("center"),
        color(style.textColor)
    ]);

    // Описание бонуса
    card.add([
        text(isRu ? obj.description : (obj.description_eng || obj.description), {
            size: 16,
            font: "sans-serif",
            width: WIDTH - 60,
            align: "center",
            lineSpacing: 6
        }),
        pos(0, -30),
        anchor("center"),
        color(style.textColor)
    ]);

    // Требования для разблокировки
    const statusText = isUnlocked 
        ? (isRu ? "✅ Разблокировано" : "✅ Unlocked")
        : (isRu ? `🗳️ Требуется: ${currentVotes}/${obj.requirements_vote} голосов`
                : `🗳️ Required: ${currentVotes}/${obj.requirements_vote} votes`);
    card.add([
        text(statusText, {
            size: 16,
            font: "sans-serif",
            width: WIDTH - 60,
            align: "center",
            lineSpacing: 6
        }),
        pos(0, 10),
        anchor("center"),
        color(style.textColor)
    ]);

    // Эффекты бонуса
    const effects = Object.entries(obj.effect)
        .map(([key, value]) => {
            const effectNames = {
                luck: "🍀 Удача",
                click: "👆 Сила клика",
                crete: "💥 Крит. шанс",
                income: "💰 Доход",
                energy_max: "⚡ Макс. энергия",
                energy_recovery: "🔄 Восстановление"
            };
            
            const unit = key === 'luck' ? '%' : 'x';
            return `${effectNames[key] || key}: ${value}${unit}`;
        }).join(' | ');

    card.add([
        text(effects, {
            size: 16,
            font: "sans-serif",
            width: WIDTH - 60,
            align: "center",
            lineSpacing: 6
        }),
        pos(0, 45),
        anchor("center"),
        color(style.textColor)
    ]);

    cardlist.push(card);
    return card;
}


export function create_settings_window(character_data, cardlist, isRu, end_warning) {
    const style = {
        color: rgb(50, 50, 80),
        outline: rgb(255, 160, 122), 
        textColor: rgb(255, 255, 255), 
        highlightColor: rgb(255, 215, 0), 
        sectionColor: rgb(60, 60, 90),
        buttonColor: rgb(70, 130, 180),
        buttonHover: rgb(100, 160, 210)
    };

    // Основное окно настроек
    const window = add([
        rect(WIDTH * 0.8, HEIGHT * 0.6, { radius: 16 }),
        area(),
        pos(WIDTH / 2, HEIGHT / 2),
        anchor("center"),
        color(style.color),
        outline(4, style.outline),
        opacity(0.6),
        z(200),
        fixed(),
        "settings_window"
    ]);

    // Заголовок
    window.add([
        text(isRu ? "⚙️ Настройки" : "⚙️ Settings", {
            size: 32,
            font: "sans-serif",
        }),
        pos(0, -HEIGHT * 0.25),
        anchor("center"),
        color(style.textColor)
    ]);


    window.add([
        text(isRu ? "💰 Всего заработано за всё время:" : "💰 Total earned all time:", {
            size: 22,
            font: "sans-serif",
        }),
        pos(-200, -120),
        anchor("left"),
        color(style.textColor)
    ]);

    window.add([
        text(`${Math.floor(character_data.character.total_earned)}`, {
            size: 24,
            font: "sans-serif",
        }),
        pos(-150 , -100),
        anchor("right"),
        color(style.highlightColor)
    ]);

    // Кнопка выбора языка
    const languageBtn = window.add([
        rect(250, 50, { radius: 8 }),
        pos(0, 0),
        anchor("center"),
        area(),
        color(style.buttonColor),
        opacity(!isRu ? 0.3 : 1),
        outline(2, style.outline),
        "language_button",
        { 
            choose: isRu
        }
    ]);

    languageBtn.add([
        text("Русский", { size: 22 }),
        anchor("center"),
        color(style.textColor)
    ]);
    // Кнопка выбора языка

    const languageEnBtn = window.add([
        rect(250, 50, { radius: 8 }),
        pos(0, 50),
        anchor("center"),
        area(),
        color(style.buttonColor),
        opacity(isRu ? 0.3 : 1),
        outline(2, style.outline),
        "language_button",
        { 
            choose: !isRu
        }
    ]);

    languageEnBtn.add([
        text("English", { size: 22 }),
        anchor("center"),
        color(style.textColor)
    ]);

    // Обработчики для кнопки языка

    const deleteBtn = window.add([
        rect(300, 50, { radius: 8 }),
        pos(0, HEIGHT * 0.15),
        anchor("center"),
        area(),
        color(end_warning === 1 ? (255, 0, 0) : style.buttonColor),
        outline(2, style.outline),
        "delete_button",
        { 
            end_warning: end_warning
        }
    ]);

    deleteBtn.add([
        text(isRu ? '🗑️ Удалить игру' : '🗑️ Delete game', {
            size: 20,
            font: "sans-serif",
            width: WIDTH - 60,
            align: "center",
            lineSpacing: 6
        }),
        anchor("center"),
        color(style.textColor)
    ]);


    const rainToggle = window.add([
        rect(300, 50, { radius: 8 }),
        pos(0, HEIGHT * 0.25),
        anchor("center"),
        area(),
        color(character_data.character.is_rain ? rgb(65, 105, 225) : rgb(100, 100, 100)),
        outline(2, style.outline),
        "rain_toggle",
    ]);

    rainToggle.add([
        text(character_data.character.is_rain
            ? (isRu ? "☔ Дождь: ВКЛ" : "☔ Rain: ON")
            : (isRu ? "☔ Дождь: ВЫКЛ" : "☔ Rain: OFF"), {
            size: 20,
            font: "sans-serif",
            width: WIDTH - 60,
            align: "center",
            lineSpacing: 6
        }),
        anchor("center"),
        color(style.textColor)
    ]);


    cardlist.push(window);
}


export function create_end_window(isRu, cardlist) {
    const style = {
        color: rgb(50, 50, 80),
        outline: rgb(255, 160, 122), 
        textColor: rgb(255, 255, 255), 
        highlightColor: rgb(255, 215, 0), 
        sectionColor: rgb(60, 60, 90),
        buttonColor: rgb(70, 130, 180),
        buttonHover: rgb(100, 160, 210),
        errorColor: rgb(220, 20, 60)
    };

    // Основное окно конца игры
    const window = add([
        rect(WIDTH * 0.7, HEIGHT * 0.5, { radius: 16 }),
        area(),
        pos(WIDTH / 2, HEIGHT / 2),
        anchor("center"),
        color(style.color),
        outline(4, style.outline),
        opacity(0.8),
        z(200),
        fixed(),
        "end_window"
    ]);

    // Заголовок (сообщение о проигрыше)
    window.add([
        text(isRu ? "💀 О нет, вы проиграли!" : "💀 Oh no, you lost!", {
            size: 36,
            font: "sans-serif",
        }),
        pos(0, -HEIGHT * 0.15),
        anchor("center"),
        color(style.errorColor)
    ]);

    // Дополнительное сообщение
    window.add([
        text(isRu ? "Но вы можете попробовать снова!" : "But you can try again!", {
            size: 24,
            font: "sans-serif",
        }),
        pos(0, -HEIGHT * 0.05),
        anchor("center"),
        color(style.textColor)
    ]);

    // Кнопка начать заново
    const restartBtn = window.add([
        rect(300, 60, { radius: 8 }),
        pos(0, HEIGHT * 0.1),
        anchor("center"),
        area(),
        color(style.buttonColor),
        outline(3, style.outline),
        "restart_button"
    ]);

    restartBtn.add([
        text(isRu ? "🔄 Начать заново" : "🔄 Start Over", {
            size: 26,
            font: "sans-serif",
        }),
        anchor("center"),
        color(style.textColor)
    ]);

    // Добавляем окно в cardlist
    cardlist.push(window);

    // Возвращаем кнопку для обработки клика
    return restartBtn;
}

// Пример использования:
// const restartBtn = create_end_window(isRu, cardlist);
// restartBtn.onClick(() => {
//     // Перезапуск игры
//     go("main");
// });