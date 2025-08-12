import {
    HEIGHT,
    WIDTH,
    BUTTONSIZE,
    character,
    button_profit,
} from "../constants.js"
import { makeOrnateFrame, animation_scale_obj } from "./main.js"



export function profitupgradeScene() {
    scene('profit', () => {
        // рендер основных полей
        makeOrnateFrame(WIDTH, HEIGHT / 8)
        const stateText = () => {

            const money = Math.floor(Number(character.money));
            const diamonds = Number(character.diamonds);
            const hp = Number(character.hp);
            const hungry = Number(character.hungry);
            const energy = Math.min(Number(character.energy), 100);

            return `
            💰 ${money}        💎 ${diamonds}
            ❤️ ${hp}/100     🍗 ${hungry}%    🔋 ${energy}/100
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
        }
        


        




        // циклы игровый loop
        loop(0.5, () => {
            stateLabel.text = stateText();
        });








        

    })};