import { WIDTH, HEIGHT, BUTTONSIZE } from "../constants.js";
import { resetGameData, loadGameData, saveGameData } from "../gameStorge.js";
import { makeOrnateFrame, animation_scale_obj, spawnRain} from "./main.js";
import { create_settings_window } from "../card.js";
import { delcard } from "./passive.js";


export function settingScene() {
    scene("setting", () => {
        add([
            rect(width(), height()),
            color(0, 0, 0),
            opacity(0.3), // Лёгкое затемнение
            fixed(),
            z(98),
            "dark_overlay"
        ]);


        let card_list = []
        let gameData = loadGameData()
        onLoad(() => {
            
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
            
            add([
                sprite(`background_${gameData.character.id_background}`),
                pos(WIDTH / 2, HEIGHT / 2),
                opacity(1),
                anchor('center'),
                fixed(),
                z(-100),
                scale(0.7)
            ]);
        });


        // регистрация кнопок перехода и выбора 
        onClick('language_button', (btn) => {
            animation_scale_obj(btn, 0.7, 1)
            wait(0.1, () => {
                gameData.character.is_ru = !gameData.character.is_ru
                saveGameData(gameData)
                delcard(card_list)
                create_settings_window(gameData, card_list, gameData.character.is_ru, 0)
                
            })

        })



        onClick('delete_button', (btn) => {
            animation_scale_obj(btn, 0.7, 1)
            wait(0.1, () => {
                if (btn.end_warning == 0) {
                    delcard(card_list)
                    create_settings_window(gameData, card_list, gameData.character.is_ru, 1)
                } else {
                    gameData = resetGameData()
                    delcard(card_list)
                    create_settings_window(gameData, card_list, gameData.character.is_ru, 0)
                }
            })

        })

        onClick('rain_toggle', (btn) => {
            animation_scale_obj(btn, 0.7, 1)
            wait(0.1, () => {
                gameData.character.is_rain = !gameData.character.is_rain
                saveGameData(gameData)
                delcard(card_list)
                create_settings_window(gameData, card_list, gameData.character.is_ru, 0)
            })

        })

        
        create_settings_window(gameData, card_list, gameData.character.is_ru, 0)



    loop(1, () => {
            spawnRain(gameData.character.is_rain, WIDTH, HEIGHT);
        });

})}
