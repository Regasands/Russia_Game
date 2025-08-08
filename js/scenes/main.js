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


//  Экспорт


export const makeOrnateFrame = () => {
    // Основная панель
    add([
        rect(WIDTH, HEIGHT / 8, { radius: 4 }),
        color(20, 20, 10),
        opacity(0.7),
        outline(2, rgb(150, 120, 80)),
        pos(0, 0),
        fixed(),
        z(100)
    ]);
    
    // Угловые завитушки (псевдографика)
    const corners = [
        { pos: vec2(0, 0), char: "╔" },
        { pos: vec2(WIDTH - 12, 0), char: "╗" },
        { pos: vec2(0,  HEIGHT / 12), char: "╚" },
        { pos: vec2(WIDTH - 12, HEIGHT / 12), char: "╝" }
    ];         
};


// Очень костылльная штука, в дальнейшем надо передлать,чтобы для каждыой локации
// Не писать if , TODO подумать как реализовать
export function getPassiveIncome(index) {
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


        // Инициализация
        makeOrnateFrame();

        const stateText = () => {
            // Приводим все числовые значения к Number
            const money = Number(character.money);
            const diamonds = Number(character.diamonds);
            const days = Number(character.days);
            const hp = Number(character.hp);
            const hungry = Number(character.hungry);
            const key_bid = Number(character.key_bid);
            const dailyIncome = Number(dailyPassiveIncome);
            const energy = Math.min(Number(character.energy), 100);

            return `
            💰 ${money}        💎 ${diamonds}      📅 ${days}     ❤️ ${hp}/100  
            🍗 ${hungry}%    🏦 ${(key_bid * 100).toFixed(1)}% 📊 +${dailyIncome}/день 🔋 ${energy}/100
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
                    "🏦": { color: rgb(50, 215, 75) },
                    "📊": { color: rgb(175, 82, 222) },
                    "🔋": { color: rgb(52, 199, 89) }
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


        //Циклы бесконечные
        
        loop(0.5, () => {
            stateLabel.text = stateText();

        });


        let dayTimer;

        wait(20, () => {
            dayTimer = loop(20, () => {
                character.days += 1
                character.hungry -= character.hungry_gap
                character.money += dailyPassiveIncome;
                character.total_earned += character.energy_recovery;


            if (character.hungry <= 0) {
                character.hp -= character.hp_gap;
            }

            character.energy += character.energy_recovery;
            character.energy = Math.min(character.max_energy, character.energy);


            if (character.days % 20 == 0) {
                const randomChange = rand(-0.3, 0.3);
                character.key_bid = Math.max(0, Math.min(1.5, character.key_bid + randomChange));
                }
                });
            });

        onSceneLeave(() => {
            dayTimer?.cancel(); // Безопасная отмена
        });
                


    });  // ← Конец callback-функции сцены
}