import { create_boost_card } from "../card.js";
import { WIDTH,  HEIGHT, BUTTONSIZE, time_boost } from "../constants.js";
import { loadGameData, saveGameData } from "../gameStorge.js";
import { makeOrnateFrame, animation_scale_obj, spawnRain } from "./main.js";
import { delcard } from "./passive.js";

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


export function updatestateScene() {
    scene('update_state', () => {
        addDarkOverlay();
        let gameData = loadGameData();
        let cardlist = []
        onLoad(() => {
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

        // создаем базовые значкии
        makeOrnateFrame(WIDTH, HEIGHT/ 10)
        const stateText = () => {
            const money = Math.floor(Number(gameData.character.money));
            const diamonds = Number(gameData.character.diamonds);

            return `
            💰 ${money}         💎 ${diamonds} 
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
    
        loop(1, () => {
            spawnRain(gameData.character.is_rain, WIDTH, HEIGHT);
        });

        Object.keys(time_boost).forEach((key) => {
           create_boost_card(time_boost[key], key, gameData.character_boost[key].count, WIDTH / 2, key *  150 + 150, cardlist)
            onClick(`boost_button_${time_boost[key].name}`, (btn) => {
                animation_scale_obj(btn, 0.9, 1)
                wait(0.1, () => {
                    if (gameData.character.diamonds >=  time_boost[key].cost) {
                        gameData.character.diamonds -= time_boost[key].cost;
                        gameData.character_boost[key].count += 1;
                        gameData.character_boost[key].time_start = time();
                        stateLabel.text = stateText();
                        delcard([btn]);
                        create_boost_card(time_boost[key], key, gameData.character_boost[key].count, WIDTH / 2, key * 150 + 150, cardlist);
                        saveGameData(gameData);
                    }
            })
        })
    })
    })}