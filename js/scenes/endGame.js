import { WIDTH, HEIGHT, BUTTONSIZE } from "../constants.js";
import { resetGameData, loadGameData, } from "../gameStorge.js";
import { animation_scale_obj, spawnRain} from "./main.js";
import { create_end_window } from "../card.js";
import { delcard  } from "./passive.js";

export function endGame() {
    scene("endgame", () => {
        add([
            rect(width(), height()),
            color(0, 0, 0),
            opacity(0.3), // Лёгкое затемнение
            fixed(),
            z(98),
            "dark_overlay"
        ]);

        let gameData = loadGameData()
        onLoad(() => {
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




        let card_list = []
        onClick('restart_button', (btn) => {
            animation_scale_obj(btn, 0.7, 1)
            wait(0.1, () => {
                gameData = resetGameData()
                delcard(card_list)
                go('train')

                })
            })


        create_end_window(gameData.character.is_ru, card_list)


    loop(1, () => {
            spawnRain(gameData.character.is_rain, WIDTH, HEIGHT);
        });



    })
}''