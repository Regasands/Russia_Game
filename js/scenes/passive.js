import {
    HEIGHT,
    WIDTH,
    BUTTONSIZE,
    passive_income,
    wait_enimation,
    button_passive,
} from "../constants.js";
import { loadGameData, saveGameData } from "../gameStorge.js";
import { createCard, create_invest_card } from "../card.js";
import { makeOrnateFrame, getPassiveIncome, animation_scale_obj, spawnRain } from "./main.js";


function addDarkOverlay() {
    add([
        rect(width(), height()),
        color(0, 0, 0),
        opacity(0.18),
        fixed(),
        z(98),
        "dark_overlay"
    ]);
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
        addDarkOverlay();

        let gameData = loadGameData();

        onLoad(() => {
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

        
            add([
                sprite("background_passive"),
                pos(WIDTH / 2, HEIGHT / 2),
                opacity(1),
                anchor('center'),
                fixed(),
                z(-100),
                scale(0.5)
            ]);
        });

        // считае пассивный доход

        function passive_insome_last() {
            let dailyPassiveIncome = 0
            for (let i = 0; i < 5; i ++){
                dailyPassiveIncome += getPassiveIncome(i, gameData)
            }
            return dailyPassiveIncome
        }


        let dailyPassiveIncome = passive_insome_last()


        // создаем базовые значкии
        makeOrnateFrame(WIDTH, HEIGHT/ 10)

        const stateText = () => {
            const money = Math.floor(Number(gameData.character.money));
            const diamonds = Number(gameData.character.diamonds);
            const key_bid = Number(gameData.character.key_bid);
            const dailyIncome = Math.floor(Number(dailyPassiveIncome));

            return `
            💰 ${money}    🏦 ${(key_bid * 100).toFixed(1)}%    📊 +${dailyIncome}
            💎 ${diamonds}
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


        // глобальный рендор  карточек, лучшее мне не пришло в голову
        var global_card = []


        // глобальная регистрация покупки карт
        let click = 1
        let sell_click = 1

        function render_cards(obj, character_part) {
            for (let i2 = 0; i2 < Object.keys(obj).length; i2++) {
                let level; 
                let isMaxLevel;
                let cost;
                let y = 180 + i2  * 120;


                if (character_part != 'investments') {
                    level = gameData.character_passive[character_part][i2];
                    isMaxLevel = level === 10;
                    cost = isMaxLevel ? "MAX" : Math.round(obj[i2].cost(level + 1));
                }
                if (character_part == 'investments' ){
                    create_invest_card(obj[i2], WIDTH / 2, y - 20, global_card, i2, gameData.character.is_ru, gameData)

                } else if (i2 == 0 || gameData.character_passive[character_part][i2 - 1] > 0){
                    createCard(obj[i2],
                        level,
                        isMaxLevel,
                        cost,
                        WIDTH / 2 , 
                        y, global_card, character_part, gameData.character.is_ru)
                } else {
                    const card = add([
                        sprite('block_button'),
                        pos(WIDTH / 2, 180 + i2 * 120),
                        anchor('center'),
                        'block_button'
                    ])
                    global_card.push(card)
                }


                onClick(`invest_${obj[i2].name}_sell`, (btn) => {
                    animation_scale_obj(btn, 0.9, 1)
                    if (
                        (sell_click > 1 && gameData.character_passive.investments[i2].count - (sell_click * 2) >= 0) ||
                        (sell_click === 1 && gameData.character_passive.investments[i2].count - sell_click >= 0)
                    ) {
                        if ((time() - btn.last_time < 1) && 
                            (gameData.character_passive.investments[i2].count - (sell_click * 2) >= 0)
                        )
                            {
                            sell_click  *= 2
                        } else {
                            sell_click = 1
                        }

                        btn.last_time = time()
                        gameData.character_passive.investments[i2].count -= sell_click;
                        gameData.character.money += gameData.character_passive.investments[i2].current_price * sell_click
                        delcard(global_card)
                        wait(wait_enimation - 0.04, () => {
                            render_cards(obj, character_part);
                        })
                        saveGameData(gameData);
                    } else {
                        sell_click = 1
                    }
                })

                onClick(`invest_${obj[i2].name}_buy`, (btn) => {
                    animation_scale_obj(btn, 0.9, 1)
                    if (
                        (gameData.character.money >=  (click * 2) * gameData.character_passive.investments[i2].current_price) ||
                        (click == 1 && gameData.character.money >= gameData.character_passive.investments[i2].current_price)
                    )
                     {
                        if  (
                            (time() - btn.last_time < 1) &&
                            (gameData.character.money >=  (click * 2) * gameData.character_passive.investments[i2].current_price)
                        ){
                            click  *= 2
                        } else {
                            click = 1
                        }
                        btn.last_time = time()

                        gameData.character_passive.investments[i2].count += click;
                        gameData.character.money -= gameData.character_passive.investments[i2].current_price * click;
                        delcard(global_card)
                        wait(wait_enimation - 0.04, () => {
                            render_cards(obj, character_part);
                        })
                        saveGameData(gameData);
                    } else {
                        click = 1
                    }
                })


                onClick(`passive_card_${obj[i2].name}`, (btn) => {
                    level = gameData.character_passive[character_part][i2];
                    cost = btn.isMaxLevel ? "MAX" : Math.round(obj[i2].cost(level + 1));
                    animation_scale_obj(btn, 0.8,   1)

                    
                    if (btn.isMaxLevel) {
                        return;

                    };

                    if (gameData.character.money >= cost) {
                        play('upgrade_button', {valume: 1})
                        gameData.character.money -= cost;
                        gameData.character_passive[character_part][i2] += 1;
                        dailyPassiveIncome = passive_insome_last();
                        delcard(global_card);
                        wait(wait_enimation, () => {
                            render_cards(obj, character_part);
                        })
                        saveGameData(gameData);
                    } else  {
                        play('no_money', {volume: 0.2, speed: 1.5})
                    }

                })

            }   
        };



        render_cards(passive_income.real_estate, 'real_estate')


        



        
        // циклы игровый loop
        loop(1, () => {
            spawnRain(gameData.character.is_rain, WIDTH, HEIGHT);
        });

        loop(0.5, () => {
            stateLabel.text = stateText();
        });

    })};
