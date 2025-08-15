
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


// Создание карточек для пасивного дохода сценаи passive 
export function create_invest_card(obj, x, y, cardlist, index) {
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

    card.add([
        text(obj.name, data),
        pos(0, -50),
        anchor('center'),
        color(style.textColor)
    ])
    card.add([
        text(`Описание: ${obj.description}`, data),
        pos(-10, -20),
        color(style.textColor),
        anchor('center'),
    ])
    let obj2 = character_passive.investments[index]
    card.add([
        text(`Цена: ${Math.floor(obj2.current_price)} / Количество у вас ${obj2.count}`, data),
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
        text('Купить', data),
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
        text('Продать', data),
        color(style.textColor),
        pos(-40, -10)
    ])
    cardlist.push(card)
    return card

}


export function createCard(obj, level, isMaxLevel,  current_cost, x, y, cardlist, character_part) {
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
            text(`${style.icon} ${obj.name}`, {
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
                text: `Описание: ${obj.description}`,
                pos: [-10, -20],
                size: 18,
                align: "left"
            },
            {
                text: `Уровень: ${level}${isMaxLevel ? " (MAX)" : ""}`,
                pos: [244, 30],
                size: 18,
                align: "left"
            },
            {
                text: isMaxLevel ? "Макс. уровень достигнут" : `Цена улучшения: ${current_cost}`,
                pos: [240, 0],
                size: 18,
                align: "left"
            },
            {
                text: `Текущий доход: ${currentIncome}` + 
                    (isMaxLevel ? "" : `\nСледующий доход: ${nextIncome}`),
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

export function  create_card_upgrade(obj, x, y, cardlist, isMaxLevel, level, type){
    let current_boost
    let next_boost
        if (obj.name == 'chance_crete') {
            current_boost =  obj.value(level);
            next_boost = isMaxLevel ? null : obj.value(level + 1);
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
            text(`${style.icon} ${obj.name}`, {
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
                text: `Описание: ${obj.description}`,
                pos: [-10, -20],
                size: 18,
                align: "left"
            },
            {
                text: `Уровень: ${level}${isMaxLevel ? " (MAX)" : ""}`,
                pos: [244, 30],
                size: 18,
                align: "left"
            },
            {
                text: isMaxLevel ? "Макс. уровень достигнут" : `Цена улучшения: ${current_cost}`,
                pos: [240, 0],
                size: 18,
                align: "left"
            },
            {
                text: `Текущий буст: ${current_boost}` + 
                    (isMaxLevel ? "" : `\nСледующий буст: ${next_boost}`),
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



export function create_card_hero_background(index, type, cardlist) {
    let obj
    let is_open
    let is_wear

    if (type == 'hero') {
        obj = heroes_info[index]; 
        is_open = character_open_hero[index].is_open;
        is_wear = character_open_hero[index].is_wear;
    } else {
        obj = backgrounds_info[index]; 
        is_open = character_open_background[index].is_open;
        is_wear = character_open_background[index].is_wear
    };


    const text_1 = !is_open ? `Купить за ${obj.price} кристаллов` : !is_wear ? 'Надеть': 'Уже используется';

    

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
        text(obj.description, {
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
        console.log('r')
    }


    cardlist.push(mainBtn, card, object_vision, nextBtn, prevBtn)
}