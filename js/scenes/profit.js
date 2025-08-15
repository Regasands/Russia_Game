import {
    HEIGHT,
    WIDTH,
    BUTTONSIZE,
    character,
    button_profit,
    upgrades,
    wait_enimation,
    heroes_info,
    character_open_hero,
} from "../constants.js"
import { delcard  } from "./passive.js";
import { makeOrnateFrame, animation_scale_obj } from "./main.js"
import { create_card_hero_background, create_card_upgrade } from "../card.js";





export function profitupgradeScene() {
    scene('profit', () => {

        // Храним все карты  и запоминаем какоого персонажа показывать сейчас)
        let cardlist = []
        let currentIndex_hero = 0
        let currentIndex_background = 0

        onLoad(() => {
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

            const money = Math.floor(Number(character.money));
            const diamonds = Number(character.diamonds);
            const hp = Number(character.hp);
            const hungry = Number(character.hungry);
            const energy = Math.min(Number(character.energy), upgrades.energy_max.value(character.energy_max));

            return `
            💰 ${money}                💎 ${diamonds}             🔋 ${energy}/${upgrades.energy_max.value(character.energy_max)}
            `.replace(/\n\s+/g, '\n').trim();
        };

        const stateLabel = add([
            text(stateText(), { 
                size: 22,
                font: "sans-serif",
                styles: {
                    "💰": { color: rgb(255, 215, 0) },
                    "💎": { color: rgb(0, 191, 255) },
                    "❤️": { color: rgb(255, 69, 58) },
                    "🍗": { color: rgb(255, 149, 0) },
                    "🔋": { color: rgb(52, 199, 89) }
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
                    level = character[key];
                    isMaxLevel = level === obj[key].maxLevel;
                    cost = obj[key].cost(level); 
                      create_card_upgrade(
                        obj[key], 
                        WIDTH / 2,
                        y,  
                        cardlist,  
                        isMaxLevel,
                        level,
                        key
                    ); 
                }

                onClick(`profit_card_${obj[key].name}`, (btn) => {
                    level = character[key]
                    cost = obj[key].cost(level);

                    animation_scale_obj(btn, 0.9,  1)
                    if (character.money >= cost) {
                        play('buy_button', {volume: 0.4})
                        character.money -= cost
                        character[key] += 1;
                        if (key == 'energy_max') {
                            character.energy = upgrades.energy_max.value(character.energy_max)
                        }
                        delcard(cardlist)
                        wait(wait_enimation, () =>{
                        render_card(obj, type)
                        })
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
            let type
            let target
            type = btn.type
            target = btn.target
            delcard(cardlist)
            if (target == 'hero'){
                currentIndex_hero = currentIndex_hero + type
                if (currentIndex_hero >= Object.keys(heroes_info).length) {
                    currentIndex_hero = 0
                } else if (currentIndex_hero < 0){
                    currentIndex_hero =  Object.keys(heroes_info).length - 1
                }
                create_card_hero_background(currentIndex_hero, 'hero', cardlist)

            } else {
                currentIndex_background = currentIndex_background + type
                if (currentIndex_background > Object.keys(heroes_info).length) {
                    currentIndex_background = 0
                } else if (currentIndex_background < 0){
                    currentIndex_background =  Object.keys(heroes_info).length - 1
                }
                create_card_hero_background(currentIndex_background, 'background', cardlist)
            }

            })

        })

        onClick('buy_button', (btn) => {
            animation_scale_obj(btn, 0.9,  1)
            if (character.diamonds < heroes_info[btn.index].price) {
                return
            }
            wait(0.1, () => {
                delcard(cardlist)
                if (btn.type == 'hero'){
                    character.diamonds -= heroes_info[btn.index].price
                    character_open_hero[btn.index].is_open = true;
                    create_card_hero_background(btn.index, 'hero', cardlist)
                }

            })
        })
        onClick('wear_button', (btn) => {
            animation_scale_obj(btn, 0.9, 1)
            wait(0.1, () => {
                if (btn.type == 'hero'){
                    var index = btn.index
                    if (character_open_hero[index].is_open && !character_open_hero[index].is_wear) {
                        for (const [key, value] of Object.entries(character_open_hero)) {
                            character_open_hero[key].is_wear = false
                        }
                        character_open_hero[index].is_wear = true
                        character.id_character = index
                        delcard(cardlist)
                        create_card_hero_background(btn.index, 'hero', cardlist)
                    }
                }
            })

        })


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
                    create_card_hero_background(currentIndex_hero, 'hero', cardlist)


                }

            });
        };
        
        // ренедрим карты



        loop(0.5, () => {
            stateLabel.text = stateText();
        });


    })};