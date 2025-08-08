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


export function passiveincomeScene () {
    scene("passive", () => {
        
        // считае пассивный доход
        let dailyPassiveIncome = 0
        for (let i = 0; i < 5; i ++){
            dailyPassiveIncome += getPassiveIncome(i)
        }
        // создаем базовые значкии
        makeOrnateFrame()

        const stateText = () => {
            // Приводим все числовые значения к Number
            const money = Number(character.money);
            const diamonds = Number(character.diamonds);
            const key_bid = Number(character.key_bid);
            const dailyIncome = Number(dailyPassiveIncome);

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
            pos(WIDTH - BUTTONSIZE * 0.5, HEIGHT - BUTTONSIZE * 0.5),
            sprite("home"),
            scale(BUTTONSIZE / 64),
            area(),
            anchor("botright"),
            "home",
        ])

        onClick('home', () => {
            btn.scale = vec2(0.9);
            console.log('Нажата')
            wait(wait_enimation, () => {
                btn.scale = vec2(BUTTONSIZE / 64); 
                    });
            go("main");
        });


        // for (let i = 1; i < button_passive.length - 1; i++) {
        //     loadSprite(button_passive[i], `../sprites/button/passive/${button_passive[i].png}`)
        //     const btn = add([
        //         pos((i + 0.5) * BUTTONSIZE, HEIGHT - BUTTONSIZE * 0.5),
        //         sprite(button_passive[i]),
        //         scale(BUTTONSIZE / 64),
        //         area({ scale: true }),
        //         anchor("center"),
        //         `button_${button_passive[i]}`
        //     ])

        //     onClick(btn, () => {
        //         btn.scale = vec2(0.9); 
        //         wait(wait_enimation, () => {
        //             btn.scale = vec2(BUTTONSIZE / 64); 
        //         });
        //     }); }






    })
}
