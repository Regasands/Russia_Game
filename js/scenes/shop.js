import { create_boost_card, createDiamondsAdCard } from "../card.js";
import { WIDTH,  HEIGHT, BUTTONSIZE, time_boost } from "../constants.js";
import { loadGameData, saveGameData } from "../gameStorge.js";
import { makeOrnateFrame, animation_scale_obj, spawnRain, addDarkOverlay} from "./main.js";
import { delcard } from "./passive.js";



export function shopScene() {
    scene('shop', () => {
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


    // Универсальная функция для рекламы с наградой
    function showRewardedAd(onRewarded) {
        if (typeof ysdk !== 'undefined' && ysdk.adv) {
            ysdk.adv.showRewardedVideo({
                callbacks: {
                    onOpen: () => {
                        console.log("Реклама открыта");
                        volume(0); // мьютим музыку и звуки kaboom
                    },
                    onRewarded: () => {
                        console.log("Игрок получил награду");
                        onRewarded && onRewarded();
                    },
                    onClose: () => {
                        console.log("Реклама закрыта");
                        volume(1); // возвращаем звук
                    },
                    onError: (err) => {
                        console.error("Ошибка рекламы:", err);
                        volume(1); // обязательно возвращаем звук даже при ошибке
                    },
                }
            });
        }
    }

    function getRandomDiamonds() {
        const roll = Math.random() * 100;

        if (roll < 60) {
            // 60%
            return Math.floor(Math.random() * 100) + 1; // 1–100
        } else if (roll < 90) {
            // 30%
            return Math.floor(Math.random() * 101) + 100; // 100–200
        } else {
            // 10%
            return Math.floor(Math.random() * 50 + 200);
        }
    }

    Object.keys(time_boost).forEach((key) => {
        create_boost_card(
            time_boost[key],
            key,
            gameData.character_boost[key].count,
            WIDTH / 2,
            key * 150 + 150,
            cardlist,
            true,
            gameData.character.is_ru
        );

        onClick(`boost_button_${time_boost[key].name}`, (btn) => {
            animation_scale_obj(btn, 0.9, 1);
            wait(0.1, () => {
                showRewardedAd(() => onAdSuccess(btn, key));
            });
        });
    });

    function onAdSuccess(btn, boostKey) {
        gameData.character_boost[boostKey].count += 1;
        gameData.character_boost[boostKey].time_start = time();
        delcard([btn]);
        create_boost_card(
            time_boost[boostKey],
            boostKey,
            gameData.character_boost[boostKey].count,
            WIDTH / 2,
            boostKey * 150 + 150,
            cardlist,
            false,
            gameData.character.is_ru
        );
        saveGameData(gameData);
    }

    // карточки с алмазами
    createDiamondsAdCard(WIDTH / 2, 570, cardlist, true, gameData.character.is_ru);
    createDiamondsAdCard(WIDTH / 2, 690, cardlist, false, gameData.character.is_ru);

    // случайные алмазы
    onClick('get_random_diamonds_rwd', (btn) => {
        animation_scale_obj(btn, 0.9, 1);
        wait(0.1, () => {
            showRewardedAd(() => {
                const reward = getRandomDiamonds();
                gameData.character.diamonds += reward;
                saveGameData(gameData);
                stateLabel.text = stateText();
            });
        });
    });

    // фиксированные алмазы (+100)
    onClick('get_diamonds_rwd', (btn) => {
        animation_scale_obj(btn, 0.9, 1);
        wait(0.1, () => {
            showRewardedAd(() => {
                gameData.character.diamonds += 100;
                saveGameData(gameData);
                stateLabel.text = stateText();
            });
        });
    });
    })}