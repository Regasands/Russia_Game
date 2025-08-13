import {
    HEIGHT,
    WIDTH,
    BUTTONSIZE,
    character,
    button_profit,
    upgrades,
    global_style,
    wait_enimation,
} from "../constants.js"
import { delcard  } from "./passive.js";
import { makeOrnateFrame, animation_scale_obj } from "./main.js"



function  create_card_upgrade(obj, x, y, cardlist, isMaxLevel, level, type){
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

export function profitupgradeScene() {
    scene('profit', () => {
        //загружаем музыку
         loadSound('no_money', 'sounds/game_sounds/where_money.mp3')
        loadSound('buy_button', 'sounds/game_sounds/applepay.mp3')
        // Храним все карты 
        let cardlist = []
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
        // рендер кнопок + начального поля
        render_card(upgrades, 'upgrade')
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


        // рисууем кнопки перехода 
        for (let i = 1; i < button_profit.length; i++) {
            loadSprite(button_profit[i], `../sprites/button/profit/${button_profit[i]}.png`);
            
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
                }
            
            });
        };
        


        // ренедрим карты

        




        // циклы игровый loop
        loop(0.5, () => {
            stateLabel.text = stateText();
        });








        

    })};