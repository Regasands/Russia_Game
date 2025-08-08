import {
    HEIGHT,
    WIDTH,
    BUTTONSIZE,
    buttons_game,
    BUTTON_COUNT,
    character_passive,
    passive_income,
    wait_enimation
} from "../constants.js";
import { character } from "../constants.js"; // ← Add this import
import { stateLabel, stateText} from "../script_r.js"


export function mainScene() {
    scene("main", () => {  // ← Начало callback-функции сцены
        // Загрузка фона

        loadSprite("background", `../sprites/background/${character.background}.png`, {
            width: WIDTH,
            height: HEIGHT });

        
        onLoad(() => {
            add([
                sprite("background"),
                pos(0, 0),
                fixed(),
                z(-100),
                scale(0.9)
            ]);
        });

        // Очень костылльная штука, в дальнейшем надо передлать,чтобы для каждыой локации
        // Не писать if , TODO подумать как реализовать
        function getPassiveIncome(index) {
            let passiveIncome = 0;
            let level = 0;
            level = character_passive.real_estate[index];
            if (level > 0) {
                passiveIncome += passive_income.real_estate[index].income(level);
            }
            level = character_passive.village_business[index];
            if (level > 0) {
                passiveIncome += passive_income.village_business[index].income(level);
            }
            level = character_passive.shadow_economy[index];
            if (level > 0) {
                passiveIncome += passive_income.shadow_economy[index].income(level);
            }
            console.log(`Passive income for index ${index}: ${passiveIncome}`);
            return passiveIncome;

        }
        let dailyPassiveIncome = 0;
        for (let i = 0; i < 5; i ++) {
            dailyPassiveIncome += getPassiveIncome(i);
        }


         // Настройка персонажа 
        loadSprite("hero", `../sprites/character/${character.id_character}.png`);

        const hero = add([
            pos(WIDTH / 2, HEIGHT / 2 - 10),
            sprite("hero"),
            scale(0.35),
            area({ scale: true }),
            anchor("center"),
            `hero`
            ])

        onClick("hero", () => {
            console.log("Персонаж нажат");
            if (character.energy <= 0) {
                console.log("Недостаточно энергии для заработка");
                return;
            }

            character.money += 1;
            character.total_earned += 1;
            character.energy -= 1;
            hero.scale = vec2(0.37);
            wait(wait_enimation, () => {
                hero.scale = vec2(0.4); 
            });
        });

        // Создаем текстовые данные



        // Отриовка кнопок
        for (let i = 0; i < buttons_game.length; i++) {
            loadSprite(buttons_game[i], `../sprites/button/main/${buttons_game[i]}.png`);
            
            const btn = add([
                pos((i + 0.5) * BUTTONSIZE, HEIGHT - BUTTONSIZE * 0.5),
                sprite(buttons_game[i]),
                scale(BUTTONSIZE / 64),
                area({ scale: true }), 
                anchor("center"), // Меняем с "topleft" на "center"
                `button_${buttons_game[i]}` // Тег для идентификации
            ]);
            console.log(`Кнопка button_${buttons_game[i]}`);
            onClick(`button_${buttons_game[i]}`, () => {
                    btn.scale = vec2(0.9); 
                    wait(wait_enimation, () => {
                        btn.scale = vec2(BUTTONSIZE / 64); 
                    });
                    if (buttons_game[i] == 'passive') {
                        go('passive')
                    }
             });

        }



        loop(0.5, () => {
            stateLabel.text = stateText();

        });

        loop(20, () => {
            character.days += 1
            character.hungry -= character.hungry_gap
            character.money += dailyPassiveIncome;
            character.total_earned += character.energy_recovery;
            if (character.hungry <= 0) {
                character.hp -= character.hp_gap;
            }

            character.energy += character.energy_recovery;
            character.energy = Math.min(character.max_energy, character.energy);
        });

        loop(300, () => {
            const randomChange = rand(-0.3, 0.3);
            character.key_bid = Math.max(0, character.key_bid + randomChange);
            character.key_bid = Math.min(1.5, character.key_bid);

        });


        
        


    });  // ← Конец callback-функции сцены
}