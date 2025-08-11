import {
    HEIGHT,
    WIDTH,
    BUTTONSIZE,
    buttons_game,
    BUTTON_COUNT,
    character_passive,
    passive_income,
    wait_enimation,
    button_passive,
} from "../constants.js";


import { character } from "../constants.js";
import { makeOrnateFrame, getPassiveIncome, animation_scale_obj } from "./main.js";


function create_invest_card(obj, x, y, cardlist, index) {
    const style = {
        color: rgb(255, 255, 150),   // Светло-желтый (инвестиции)
        icon: "📈",
        textColor: rgb(139, 69, 19)  // Коричневый
    },
    card = add([
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


function createCard(obj, level, isMaxLevel,  current_cost, x, y, cardlist, character_part) {
        const currentIncome =  Math.round(obj.income(level));
        let nextIncome
        nextIncome = isMaxLevel ? null : Math.round(obj.income(level + 1));
        let card;

        // Определяем стиль в зависимости от категории


        const categoryStyles = {
            real_estate: {
                color: rgb(173, 216, 230),  // Голубой (недвижимость)
                icon: "🏠",
                textColor: rgb(0, 0, 139)    // Темно-синий
            },
            village_business: {
                color: rgb(144, 238, 144),   // Светло-зеленый (сельский бизнес)
                icon: "🌾",
                textColor: rgb(0, 100, 0)    // Темно-зеленый
            },
            shadow_economy: {
                color: rgb(169, 169, 169),   // Серый (теневая экономика)
                icon: "🕶️",
                textColor: rgb(47, 79, 79)   // Темно-серый
            }
        };

        const style = categoryStyles[character_part] || {
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



export function delcard(cardlist) {
    if (!cardlist || !Array.isArray(cardlist)) return;
    
    cardlist.forEach(card => {
        if (!card) return;

        if (card.children) {
            card.children.forEach(child => destroy(child));
        }
        destroy(card);
    });
}

//САМА СЦЕНА
export function passiveincomeScene () {
    scene("passive", () => {

        loadSound("ahyou", "sounds/fack_you.mp3");
        loadSound('upgrade_button', 'sounds/upgrade_button.mp3')

        // считае пассивный доход

        function passive_insome_last() {
        let dailyPassiveIncome = 0
        for (let i = 0; i < 5; i ++){
            dailyPassiveIncome += getPassiveIncome(i)
        }

        return dailyPassiveIncome
        }


        let dailyPassiveIncome = passive_insome_last()


        // создаем базовые значкии
        makeOrnateFrame(WIDTH, HEIGHT/ 10)

        const stateText = () => {
            // Приводим все числовые значения к Number
            const money = Math.floor(Number(character.money));
            const diamonds = Number(character.diamonds);
            const key_bid = Number(character.key_bid);
            const dailyIncome = Math.floor(Number(dailyPassiveIncome));

            return `
            💰 ${money}         💎 ${diamonds}           🏦 ${(key_bid * 100).toFixed(1)}%           📊${dailyIncome}
            `.replace(/\n\s+/g, '\n').trim();
        };

        const stateLabel = add([
            text(stateText(), { 
                size: 22,
                font: "sans-serif",
                styles: {
                    "💰": { color: rgb(255, 215, 0) },
                    "💎": { color: rgb(0, 191, 255) },
                    "🏦": { color: rgb(50, 215, 75) },
                    "📊": { color: rgb(175, 82, 222) },
                },
                width: width() - 40, // Перенос по ширине
                lineSpacing: 20      // Отступ между строками
            }),
            pos(20, 50),
            anchor("left"),
            color(255, 255, 255),
            fixed(),
            z(101)
        ]);


        // рендер кнопок



        loadSprite("home", "../sprites/button/home.png");
        loadSprite('block_button', '../sprites/button/block_button.png')

        const btn = add([
            pos(BUTTONSIZE, HEIGHT),
            sprite("home"),
            scale(BUTTONSIZE / 64),
            area(),
            anchor("botright"),
            "home",
        ])

        onClick('home', () => {
            animation_scale_obj(btn, 0.9, BUTTONSIZE / 64)
            go("main");
        });


        // глобальный реесор карточек, лучшее мне не пришло в голову
        var global_card = []


        // глобальная регистрация покупки карт
        let fast_block_button = []
        let click = 1
        let sell_click = 1
        function render_cards(obj, character_part) {

            delcard(fast_block_button)
            fast_block_button = []

            for (let i2 = 0; i2 < Object.keys(obj).length; i2++) {
                let level; 
                let isMaxLevel;
                let cost;
                let y = 180 + i2  * 120;


                if (character_part != 'investments') {
                    level = character_passive[character_part][i2];
                    isMaxLevel = level === 10;
                    cost = isMaxLevel ? "MAX" : Math.round(obj[i2].cost(level + 1));
                }
                if (character_part == 'investments' ){
                    const card = create_invest_card(obj[i2], WIDTH / 2, y - 20, global_card, i2)

                } else if (i2 == 0 || character_passive[character_part][i2 - 1] > 0){
                    const card = createCard(obj[i2],
                        level,
                        isMaxLevel,
                        cost,
                        WIDTH / 2 , 
                        y, global_card, character_part)
                } else {
                    const card = add([
                        sprite('block_button'),
                        pos(WIDTH / 2, 180 + i2 * 120),
                        anchor('center'),
                        'block_button'
                    ])
                    fast_block_button.push(card)
                }


                onClick(`invest_${obj[i2].name}_sell`, (btn) => {
                    animation_scale_obj(btn, 0.9, 1)
                    if (
                        (sell_click > 1 && character_passive.investments[i2].count - (sell_click * 2) >= 0) ||
                        (sell_click === 1 && character_passive.investments[i2].count - sell_click >= 0)
                    ) {
                        if ((time() - btn.last_time < 1) && 
                            (character_passive.investments[i2].count - (sell_click * 2) >= 0)
                        )
                            {
                            sell_click  *= 2
                        } else {
                            sell_click = 1
                        }

                        btn.last_time = time()
                        character_passive.investments[i2].count -= sell_click;
                        character.money += character_passive.investments[i2].current_price * sell_click
                        delcard(global_card)
                        wait(wait_enimation - 0.04, () => {
                            render_cards(obj, character_part);
                        })
                    } else {
                        sell_click = 1
                    }
                })

                onClick(`invest_${obj[i2].name}_buy`, (btn) => {
                    animation_scale_obj(btn, 0.9, 1)
                    if (
                        (character.money >=  (click * 2) * character_passive.investments[i2].current_price) ||
                        (click == 1 && character.money >= character_passive.investments[i2].current_price)
                    )
                     {
                        if  (
                            (time() - btn.last_time < 1) &&
                            (character.money >=  (click * 2) * character_passive.investments[i2].current_price)
                        ){
                            click  *= 2
                        } else {
                            click = 1
                        }
                        btn.last_time = time()

                        character_passive.investments[i2].count += click;
                        character.money -= character_passive.investments[i2].current_price * click;
                        delcard(global_card)
                        wait(wait_enimation - 0.04, () => {
                            render_cards(obj, character_part);
                        })
                    } else {
                        click = 1
                    }
                })


                onClick(`passive_card_${obj[i2].name}`, (btn) => {
                    level = character_passive[character_part][i2];
                    cost = btn.isMaxLevel ? "MAX" : Math.round(obj[i2].cost(level + 1));
                    animation_scale_obj(btn, 0.8,   1)

                    
                    if (btn.isMaxLevel) {
                        return;

                    };

                

                    if (character.money >= cost) {
                        play('upgrade_button', {valume: 1})
                        character.money -= cost;
                        character_passive[character_part][i2] += 1;
                        dailyPassiveIncome = passive_insome_last();
                        delcard(global_card);
                        wait(wait_enimation, () => {
                            render_cards(obj, character_part);
                        })

                    }

                })

            }   
        };



        render_cards(passive_income.real_estate, 'real_estate')


        
        // рисууем кнопки перехода 
        for (let i = 1; i < button_passive.length; i++) {
            loadSprite(button_passive[i], `../sprites/button/passive/${button_passive[i]}.png`);
            
            const btn = add([
                pos((i + 0.5) * BUTTONSIZE, HEIGHT - BUTTONSIZE * 0.5),
                sprite(button_passive[i]),
                scale(BUTTONSIZE / 64),
                area({ scale: true }), 
                anchor("center"),
                `button_${button_passive[i]}` 
            ]);

            onClick(`button_${button_passive[i]}`, () => {
                    animation_scale_obj(btn, 0.9, BUTTONSIZE / 64)
                    if (button_passive[i] == 'smile_face') {
                        play('ahyou', {
                            volume: 10,
                            speed: 1,
                            loop: false,
                        })
                    }  else {
                        delcard(global_card);
                        global_card = [];
                        if (button_passive[i] == 'real_estate') {
                            render_cards(passive_income.real_estate, 'real_estate');
                        }
                        if (button_passive[i] == 'village_business') {
                            render_cards(passive_income.village_business, 'village_business');
                        }
                        if (button_passive[i] == 'shadow_economy') {
                            render_cards(passive_income.shadow_economy, 'shadow_economy');
                        }

                        if (button_passive[i] == 'investments'){
                            render_cards(passive_income.investments, 'investments');
                        }
                    }

                });

        }


        
        // циклы игровый loop
        loop(0.5, () => {
            stateLabel.text = stateText();
        });

    })};
