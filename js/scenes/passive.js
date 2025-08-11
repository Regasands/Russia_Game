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
import { makeOrnateFrame, getPassiveIncome } from "./main.js";



function createCard(obj, level, isMaxLevel,  current_cost, x, y, cardlist) {
        const currentIncome =  Math.round(obj.income(level));
        let nextIncome
        nextIncome = isMaxLevel ? null : Math.round(obj.income(level + 1));
        let card;

    // Создаем основу карточки
        card = add([
            rect(WIDTH, HEIGHT / 10, { radius: 10 }),
            area(),
            pos(x, y),
            anchor("center"),
            color(rgb(30, 35, 45)),
            outline(5, rgb(0, 0, 0)),
            opacity(0.4),
            fixed(),
            `passive_card_${obj.name}`,
        ]);

        card.add([
            text(obj.name, {
                size: 28,
                font: "sans-serif",
                width: WIDTH - 40,
                align: "center",
                lineSpacing: 8
            }),
            pos(0,  - 60),
            anchor("center"),
            color(rgb(0, 0, 0))
        ]);

        card.add([
            text(`Описание: ${obj.description}`, {
                size: 18,
                font: "sans-serif",
                width: WIDTH - 40,
                align: "left",
                lineSpacing: 8
            }),
            pos(-10, -20),
            anchor("center"),
            color(rgb(0, 0, 0))
        ]);

        card.add([
            text(`Уровень: ${level}`, {
                size: 18,
                font: "sans-serif",
                width: WIDTH - 40,
                align: "left",
                lineSpacing: 8
            }),
            pos(310, 10),
            anchor("center"),
            color(rgb(0, 0, 0))
        ]);

        card.add([
            text(`Цена покупки: ${current_cost}`, {
                size: 18,
                font: "sans-serif",
                width: WIDTH - 40,
                align: "left",
                lineSpacing: 8
            }),
            pos(310, -20),
            anchor("center"),
            color(rgb(0, 0, 0))
        ]);

        card.add([
            text(`Доход на этом уровне: ${currentIncome}\nДоход на следующий уровень: ${nextIncome}`, {
                size: 18,
                font: "sans-serif",
                width: WIDTH - 30,
                align: "left",
                lineSpacing: 8
            }),
            pos(-5, 20),
            anchor("center"),
            color(rgb(0, 0, 0))
        ]);

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


export function passiveincomeScene () {
    scene("passive", () => {
        loadSound("ahyou", "sounds/fack_you.mp3");
        loadSound('upgrade_button', 'sounds/upgrade_button.mp3')

        // глобальный реесор карточек, лучшее мне не пришло в голову
        var global_card = []


        // глобальная регистрация объектов))
        function render_cards(obj, character_part) {  
            for (let i2 = 0; i2 < Object.keys(obj).length; i2++) {
                const level = character_passive[character_part][i2];
                let isMaxLevel = level === 10;
                const cost = isMaxLevel ? "MAX" : Math.round(obj[i2].cost(level + 1));

                const card = createCard(obj[i2],
                    level,
                    isMaxLevel,
                    cost,
                    WIDTH / 2 , 
                    180 + i2 * 120, global_card)
                onClick(`passive_card_${obj[i2].name}`, (btn) => {
                    const level = character_passive[character_part][i2];
                    let isMaxLevel = level === 10;
                    const cost = isMaxLevel ? "MAX" : Math.round(obj[i2].cost(level + 1));

                    btn.scale = vec2(0.9)
                    wait(wait_enimation, () => {
                        btn.scale = vec2(1)
                    })
                    if (isMaxLevel) {
                        btn.outline = 0.9;
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
        makeOrnateFrame()

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
        const btn = add([
            pos(BUTTONSIZE, HEIGHT),
            sprite("home"),
            scale(BUTTONSIZE / 64),
            area(),
            anchor("botright"),
            "home",
        ])

        onClick('home', () => {
            btn.scale = vec2(0.9);
            wait(wait_enimation, () => {
                btn.scale = vec2(BUTTONSIZE / 64); 
                    });
            go("main");
        });


        for (let i = 0; i < button_passive.length; i++) {
            loadSprite(button_passive[i], `../sprites/button/passive/${button_passive[i]}.png`);
            
            const btn = add([
                pos((i + 0.5) * BUTTONSIZE, HEIGHT - BUTTONSIZE * 0.5),
                sprite(button_passive[i]),
                scale(BUTTONSIZE / 64),
                area({ scale: true }), 
                anchor("center"), // Меняем с "topleft" на "center"
                `button_${button_passive[i]}` // Тег для идентификации
            ]);

            onClick(`button_${button_passive[i]}`, () => {
                    btn.scale = vec2(0.9);
                    wait(wait_enimation, () => {
                        btn.scale = vec2(BUTTONSIZE / 64); 
                    });

                    if (button_passive[i] == 'smile_face') {
                        play('ahyou', {
                            volume: 10,
                            speed: 0.25,
                            loop: false,
                        })
                    }  else {
                        delcard(global_card)
                        global_card = []

                        if (button_passive[i] == 'real_estate') {
                            render_cards(passive_income.real_estate, 'real_estate')
                        }
                    }

                });

        }

        

        loop(0.5, () => {
            stateLabel.text = stateText();
        });

    })};
