import {
    HEIGHT,
    WIDTH,
    BUTTONSIZE,
    button_profit,
    upgrades,
    wait_enimation,
    heroes_info,
    backgrounds_info,
} from "../constants.js"
import { loadGameData, saveGameData } from "../gameStorge.js";
import { delcard  } from "./passive.js";
import { makeOrnateFrame, animation_scale_obj, change_boost_character, spawnRain } from "./main.js"
import { create_card_boost_list, create_card_hero_background, create_card_upgrade, create_exchanger_card } from "../card.js";

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

export function profitupgradeScene() {
    scene('profit', () => {
        addDarkOverlay();
        let gameData = loadGameData();
        let cardlist = []
        let currentIndex_hero = 0
        let currentIndex_background = 0

        onLoad(() => {

                    // рисууем кнопки перехода 
            for (let i = 1; i < button_profit.length; i++) {
                const btn = add([
                    pos((i + 0.5) * BUTTONSIZE, HEIGHT - BUTTONSIZE * 0.5),
                    sprite(button_profit[i]),
                    scale(BUTTONSIZE / 64),
                    area({ scale: true }), 
                    anchor("center"),
                    `button_${button_profit[i]}` 
                ]);

                onClick(`button_${button_profit[i]}`, (btn) => {
                    animation_scale_obj(btn, 0.9, BUTTONSIZE / 64)
                    delcard(cardlist)
                    if (button_profit[i] == 'upgrade') {
                        render_card(upgrades, button_profit[i])
                    } else if (button_profit[i] == 'new_character') {
                            create_card_hero_background(currentIndex_hero, 'hero', cardlist, gameData.character.is_ru, gameData)
                    } else if (button_profit[i] == 'new_background') {
                            create_card_hero_background(currentIndex_background, 'background', cardlist, gameData.character.is_ru, gameData)
                    } else if (button_profit[i] == 'new_event') {
                        change_boost_character(gameData)
                        console.log(gameData.character.boost)
                        create_card_boost_list(gameData.character.boost, cardlist, gameData.character.is_ru)
                    } else if (button_profit[i] == 'exchanger') {
                        create_exchanger_card(cardlist, gameData.character.cost_diamond)
                    }

                });
            };

            add([
                sprite("background_profit"),
                pos(WIDTH / 2, HEIGHT / 2),
                opacity(1),
                anchor('center'),
                fixed(),
                z(-100),
                scale(0.55)
            ]);
        });


        // рендер основных полей
        makeOrnateFrame(WIDTH, HEIGHT / 8)
        const stateText = () => {

            const money = Math.floor(Number(gameData.character.money));
            const diamonds = Number(gameData.character.diamonds);

            return `
            💰 ${money}                         💎 ${diamonds}
            `.replace(/\n\s+/g, '\n').trim();
        };

        const stateLabel = add([
            text(stateText(), { 
                size: 22,
                font: "sans-serif",
                styles: {
                    "💰": { color: rgb(255, 215, 0) },
                    "💎": { color: rgb(0, 191, 255) },
                },
                width: width() - 40, 
                lineSpacing: 20  
            }),
            pos(20, 68),
            anchor("left"),
            color(255, 255, 255),
            fixed(),
            z(101)
        ]);


        // Чуть друг8а логика, чыем в passive чтобы не усложнять  код)
        function render_card(obj, type) {
            Object.keys(obj).forEach((key, i) => {
                let level;
                let isMaxLevel;
                let cost;
                let y = 180 + i * 120;

                if (type === 'upgrade') {
                    y = 200 + i * 150;
                    level = gameData.character[key];
                    isMaxLevel = level === obj[key].maxLevel;
                    cost = obj[key].cost(level); 
                      create_card_upgrade(
                        obj[key], 
                        WIDTH / 2,
                        y,  
                        cardlist,  
                        isMaxLevel,
                        level,
                        key,
                        gameData.character.is_ru
                    ); 
                }

                onClick(`profit_card_${obj[key].name}`, (btn) => {
                    level = gameData.character[key]
                    cost = obj[key].cost(level);

                    animation_scale_obj(btn, 0.9,  1)
                    if (gameData.character.money >= cost) {
                        play('buy_button', {volume: 0.4})
                        gameData.character.money -= cost
                        gameData.character[key] += 1;
                        if (key == 'energy_max') {
                            gameData.character.energy = upgrades.energy_max.value(gameData.character.energy_max)
                        }
                        delcard(cardlist)
                        wait(wait_enimation, () =>{
                        render_card(obj, type)
                        })
                        saveGameData(gameData);
                    } else {
                        play('no_money', {volume: 0.2, speed: 1.5})
                    }



                })

            });
        }

        render_card(upgrades, 'upgrade')

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

        // регистрация кнопок перехода)
        onClick('nav_button', (btn) => {
            animation_scale_obj(btn, 0.7, 1.3)
            wait(0.1, () => {
            let type = btn.type
            let target = btn.target
            delcard(cardlist)
            if (target == 'hero'){
                currentIndex_hero = currentIndex_hero + type
                if (currentIndex_hero >= Object.keys(heroes_info).length) {
                    currentIndex_hero = 0
                } else if (currentIndex_hero < 0){
                    currentIndex_hero =  Object.keys(heroes_info).length - 1
                }
                create_card_hero_background(currentIndex_hero, 'hero', cardlist, gameData.character.is_ru, gameData)

            } else {
                currentIndex_background = currentIndex_background + type
                if (currentIndex_background >= Object.keys(heroes_info).length) {
                    currentIndex_background = 0
                } else if (currentIndex_background < 0){
                    currentIndex_background =  Object.keys(heroes_info).length - 1
                }
                create_card_hero_background(currentIndex_background, 'background', cardlist, gameData.character.is_ru, gameData)
            }

            })

        })

        onClick('buy_button', (btn) => {
            animation_scale_obj(btn, 0.9,  1)
            if (btn.type == 'hero' && gameData.character.diamonds < heroes_info[btn.index].price) {
                return
            }
            if (btn.type == 'background' && gameData.character.diamonds < backgrounds_info[btn.index].price) {
                return
            }
            wait(0.1, () => {
                delcard(cardlist)
                if (btn.type == 'hero'){
                    gameData.character.diamonds -= heroes_info[btn.index].price
                    gameData.character_open_hero[btn.index].is_open = true;
                    create_card_hero_background(btn.index, 'hero', cardlist, gameData.character.is_ru, gameData)
                } else {
                    gameData.character.diamonds -= backgrounds_info[btn.index].price
                    gameData.character_open_background[btn.index].is_open = true;
                    create_card_hero_background(btn.index, 'background', cardlist, gameData.character.is_ru, gameData)
                }
                saveGameData(gameData);
            })
        })
        onClick('wear_button', (btn) => {
            animation_scale_obj(btn, 0.9, 1)
            wait(0.1, () => {
                if (btn.type == 'background'){
                    var index = btn.index
                    if (gameData.character_open_background[index].is_open && !gameData.character_open_background[index].is_wear) {
                        for (const key of Object.keys(gameData.character_open_background)) {
                            gameData.character_open_background[key].is_wear = false
                        }
                        gameData.character_open_background[index].is_wear = true
                        gameData.character.id_background = index
                        delcard(cardlist)
                        create_card_hero_background(btn.index, 'background', cardlist, gameData.character.is_ru, gameData)
                    }
                } else {
                    var index = btn.index
                    if (gameData.character_open_hero[index].is_open && !gameData.character_open_hero[index].is_wear) {
                        for (const key of Object.keys(gameData.character_open_hero)) {
                            gameData.character_open_hero[key].is_wear = false
                        }
                        gameData.character_open_hero[index].is_wear = true
                        gameData.character.id_character = index
                        delcard(cardlist)
                        create_card_hero_background(btn.index, 'hero', cardlist, gameData.character.is_ru, gameData)
                    }
                }
                saveGameData(gameData);
            })
        })

    let click = 1
    let sell_click = 1

    onClick(`sell_diamond`, (btn) => {
        animation_scale_obj(btn, 0.9, 1)
        if (
            (sell_click > 1 && gameData.character.diamonds - (sell_click * 2) >= 0) ||
            (sell_click === 1 && gameData.character.diamonds - sell_click >= 0)
        ) {
            if ((time() - btn.last_time < 1) && 
                (gameData.character.diamonds - (sell_click * 2) >= 0)
            )
                {
                sell_click  *= 2
            } else {
                sell_click = 1
            }

            btn.last_time = time()
            gameData.character.diamonds -= sell_click;
            gameData.character.money += gameData.character.cost_diamond * sell_click
            delcard(cardlist)
            wait(wait_enimation - 0.04, () => {
                create_exchanger_card(cardlist, gameData.character.cost_diamond);
            })
            saveGameData(gameData);
        } else {
            sell_click = 1
        }
    })

    onClick(`buy_diamond`, (btn) => {
        animation_scale_obj(btn, 0.9, 1)
        if (
            (gameData.character.money >=  (click * 2) * gameData.character.cost_diamond * 20) ||
            (click == 1 && gameData.character.money >= gameData.character.cost_diamond * 20)
        )
            {
            if  (
                (time() - btn.last_time < 1) &&
                (gameData.character.money >=  (click * 2) * gameData.character.cost_diamond * 20)
            ){
                click  *= 2
            } else {
                click = 1
            }
            btn.last_time = time()

            gameData.character.diamonds += click;
            gameData.character.money -= gameData.character.cost_diamond * 20 * click;
            delcard(cardlist)
            wait(wait_enimation - 0.04, () => {
                create_exchanger_card(cardlist, gameData.character.cost_diamond);
            })
            saveGameData(gameData);
        } else {
            click = 1
        }
    })



        
        // ренедрим карты



        loop(0.5, () => {
            stateLabel.text = stateText();
        });

    })};