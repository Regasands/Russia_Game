import {
    HEIGHT,
    WIDTH,
    BUTTONSIZE,
    upgrades,
    passsive_vote_boost,
    button_vote,
} from "../constants.js";
import { loadGameData, saveGameData } from "../gameStorge.js";
import { create_vote_boost_card, create_vote_project_card } from "../card.js";
import { makeOrnateFrame, animation_scale_obj } from "./main.js";
import { delcard } from "./passive.js";





export function voteScene() {
    scene("vote", () => {
        let gameData = loadGameData();

        onLoad(() => {
            add([
                sprite("background_vote"),
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
            // Приводим все числовые значения к Number
            const money = Math.floor(Number(gameData.character.money));
            const diamonds = Number(gameData.character.diamonds);
            const energy = Number(gameData.character.energy);
            const votes = Number(gameData.character.votes || 0)

            return `
            💰 ${money}         💎 ${diamonds}
            🗳️ ${votes}         🔋 ${Math.floor(energy)}/${Math.floor(upgrades.energy_max.value(gameData.character.energy_max) * gameData.character.boost.energy_max)}
            `.replace(/\n\s+/g, '\n').trim();
        };

        const stateLabel = add([
            text(stateText(), { 
                size: 22,
                font: "sans-serif",
                styles: {
                    "💰": { color: rgb(255, 215, 0) },
                    "💎": { color: rgb(0, 191, 255) },
                    "🔋": { color: rgb(52, 199, 89) },      // Салатовый
                    "🗳️": { color: rgb(255, 105, 180) },    // Розовый для голосов
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
        let cardlist = []


        function render_card(obj) {
            for (let key = 0; key < Object.keys(obj).length; key ++) {
                create_vote_project_card(obj[key], WIDTH / 2, key * 150 + 170, cardlist)
                onClick(`vote_project_${obj[key].name}`, (btn) => {
                    animation_scale_obj(btn, 0.9, 1)
                    if (gameData.character.money >= obj[key].cost_open && !obj[key].character_open) {
                        gameData.character.money -= obj[key].cost_open
                        obj[key].character_open = true
                        stateLabel.text = stateText()
                        delcard([btn])
                        create_vote_project_card(obj[key], WIDTH / 2, key * 150 + 170, cardlist)
                        saveGameData(gameData);
                    }
                })
            }
        }


        render_card(gameData.character_object_vote)
        // рисууем кнопки перехода 
        for (let i = 2; i < button_vote.length - 1; i++) {
            loadSprite(button_vote[i], `../sprites/button/vote/${button_vote[i]}.png`);
            
            const btn = add([
                pos((i + 0.5) * BUTTONSIZE, HEIGHT - BUTTONSIZE * 0.5),
                sprite(button_vote[i]),
                scale(BUTTONSIZE / 64),
                area({ scale: true }), 
                anchor("center"),
                `button_${button_vote[i]}` 
            ]);

            onClick(`button_${button_vote[i]}`, () => {
                    animation_scale_obj(btn, 0.9, BUTTONSIZE / 64)
                    delcard(cardlist)
                    if (button_vote[i] == 'recive') {
                        render_card(gameData.character_object_vote)
                    } else if (button_vote[i] == 'emotion') {

                        var people = add([
                            pos(WIDTH / 2, HEIGHT / 2 + 20),
                            sprite('people'),
                            scale(0.4),
                            area({ scale: true }),
                            anchor("center"),
                            'people',
                            ]);
                        cardlist.push(people)
                        onClick("people", (people) => {
                            play('hero_click', {volume: 0.09, speed: 1.3})
                            animation_scale_obj(people, 0.35, 0.4)
                            if (gameData.character.energy == 0) {
                                return;
                            }
                            if (Math.random() > 0.6 ){
                
                                let x_random = rand(10, WIDTH - 10)
                                let y_random = rand(100, HEIGHT * 7 / 8)
                
                
                                var vote = add([
                                    sprite("vote_am"), // Автозапуск анимации
                                    pos(x_random, y_random),
                                    area(),
                                    scale(0.08),
                                    move(UP, 400),
                                    "vote",
                                ]);
                                vote.play('spin')
                                vote.onUpdate(() => {
                                    if (vote.pos.y < 20) destroy(vote);
                                });
                            }
                            
                            let chance = upgrades.chance_crete.value(gameData.character.chance_crete) * gameData.character.boost.crete >= Math.random()
                            let click = upgrades.click_boost.value(gameData.character.click_boost) * gameData.character.boost.click
                            if (click - gameData.character.energy >= 0) {
                                gameData.character.votes += gameData.character.energy;
                                gameData.character.energy = 0          
                            }  else if (click < gameData.character.energy) {   
                                gameData.character.energy -= click; 
                                click = chance ? click * 5: click
                                gameData.character.votes += click;
                            } 
                            saveGameData(gameData);
                        });
                
                    } else if (button_vote[i] == 'boost') {
                        for (let key = 0; key < Object.keys(passsive_vote_boost).length; key ++) {
                            create_vote_boost_card(passsive_vote_boost[key], WIDTH / 2, key * 150 + 170, cardlist, gameData.character.votes)
                        }
                    }
                });

        }




    loop(0.5, () => {
        stateLabel.text = stateText()
    })
    })
}