import {
    HEIGHT,
    WIDTH,
    BUTTONSIZE,
    buttons_game,
    BUTTON_COUNT,
    character_passive,
    passive_income,
    wait_enimation,
    character,
    upgrades,
    DAY_NIGHT_CYCLE,
} from "../constants.js";
import { change_boost_character } from "./profit.js";

//  Экспорт,
export function animation_scale_obj(object, animations_scale, return_animation) {
    object.scale = vec2(animations_scale)
    wait(wait_enimation, () => {
        object.scale = vec2(return_animation)
    })
}

export const makeOrnateFrame = (width, height) => {
    // Основная панель
    add([
        rect(width, height, { radius: 4 }),
        color(20, 20, 10),
        opacity(0.4),
        outline(3, rgb(0, 0, 0)),
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
    return passiveIncome * character.boost.income;

}

// Жесть какая тошг но вроде работает 
function setupDayNightSystem() {
    let currentOverlay = null;
    let activeCycle = null;
    let targetOpacity = 0;

    // Создаём базовый оверлей один раз
    function initOverlay() {
        currentOverlay = add([
            rect(width(), height()),
            color(0),
            opacity(0),
            fixed(),
            z(99),
            "day_night_overlay"
        ]);
    }

    // Плавное изменение параметров
    function transitionToCycle(cycle) {
        if (!currentOverlay) return;
        
        currentOverlay.color = cycle.color;
        targetOpacity = cycle.opacity;
        activeCycle = cycle.name;
    }

    // Определение текущего цикла
    function getCurrentCycle(hour) {
        for (const cycle of Object.values(DAY_NIGHT_CYCLE)) {
            if (cycle.start > cycle.end) { // Для ночи (переход через полночь)
                if (hour >= cycle.start || hour < cycle.end) return cycle;
            } else if (hour >= cycle.start && hour < cycle.end) {
                return cycle;
            }
        }
        return DAY_NIGHT_CYCLE.DAY; 
    }

    // Инициализация
    initOverlay();
    transitionToCycle(DAY_NIGHT_CYCLE.DAY);

    // Система плавных переходов
    loop(0.1, () => {
        if (currentOverlay && Math.abs(currentOverlay.opacity - targetOpacity) > 0.01) {
            currentOverlay.opacity = lerp(
                currentOverlay.opacity,
                targetOpacity,
                0.1
            );
        }
    });

    // Публичный метод обновления
    return function updateTime(hour) {
        const normalizedHour = hour % 24;
        const newCycle = getCurrentCycle(normalizedHour);
        
        if (newCycle.name !== activeCycle) {
            transitionToCycle(newCycle);
        }
    };
}

export function mainScene() {
    scene("main", () => {  // ← Начало callback-функции сцены

        // Самое важное музыка
        loadSound('hero_click', 'sounds/game_sounds/Click_mouse_snd.wav')


        // теперь фон
        loadSprite("background", `../sprites/background/${character.background}.png`, {
            width: WIDTH,
            height: HEIGHT });

        loadSprite("coin", "sprites/icon/coin_am.png", {
            sliceX: 3,  // 3 колонки
            sliceY: 3,   // 3 строки (даже если 9-й кадр пуст)
            anims: {
                "spin": {
                    // Явно перечисляем нужные 8 кадров:
                    from: 0,
                    to: 8,
                    speed: 12,
                    loop: true
                }
            }
        });

             
        onLoad(() => {
            add([
                sprite("background"),
                pos(0, 0),
                fixed(),
                z(-100),
                scale(0.9)
            ]);
        });

        // Загружаем храктеристки персонажа
        change_boost_character()

        // Считаем пасивный доход
        let dailyPassiveIncome = 0;
        for (let i = 0; i < 5; i ++) {
            dailyPassiveIncome += getPassiveIncome(i);
        }

        


         // Настройка персонажа 
        loadSprite("hero", `../sprites/character/${character.id_character}.png`);

        const hero = add([
            pos(WIDTH / 2, HEIGHT / 2 + 20),
            sprite("hero"),
            scale(0.4),
            area({ scale: true }),
            anchor("center"),
            `hero`,
            {
                nooficialname: 'Hero',
            }
            ])

        onClick("hero", () => {
            play('hero_click', {volume: 0.09, speed: 1.3})
            animation_scale_obj(hero, 0.35, 0.4)
            if (character.energy == 0) {
                return;
            }
            if (Math.random() > 0.6 ){

                let x_random = rand(10, WIDTH - 10)
                let y_random = rand(100, HEIGHT * 7 / 8)


                var coin = add([
                    sprite("coin"), // Автозапуск анимации
                    pos(x_random, y_random),
                    area(),
                    scale(1),
                    move(UP, 400),
                    "coin",
                ]);

                // Удаление при выходе за границы (альтернатива)
                coin.play('spin')
                coin.onUpdate(() => {
                    if (coin.pos.y < 100) destroy(coin);
                });
            }
            
            let chance = upgrades.chance_crete.value(character.chance_crete) * character.boost.crete >= Math.random()
            let click = upgrades.click_boost.value(character.click_boost) * character.boost.click
            if (click - character.energy >= 0) {
                character.money += character.energy;
                character.total_earned += character.energy;
                character.energy = 0          
            }  else if (click < character.energy) {   
                character.energy -= click; 
                click = chance ? click * 5: click
                character.money += click;
                character.total_earned += click;
                if (chance){
                    addKaboom(hero.pos)
                }
            }



        });


        // Инициализация
        makeOrnateFrame( WIDTH, HEIGHT / 6.7);

        const stateText = () => {
            const money = Math.floor(Number(character.money));
            const diamonds = Number(character.diamonds);
            const days = Number(character.days);
            const hp = Number(character.hp);
            const hungry = Number(character.hungry);
            const key_bid = Number(character.key_bid);
            const dailyIncome = Math.floor(Number(dailyPassiveIncome));
            const energy = Number(character.energy);
            const time_game = Number(character.time_game);

            return `
            💰 ${money}        💎 ${diamonds}            📊 +${dailyIncome}/день    
            ❤️ ${hp}/100     🍗 ${hungry}%    🔋 ${energy}/${upgrades.energy_max.value(character.energy_max)}
              📅 ${days}                                   ⏳ ${time_game}:00
            `.replace(/\n\s+/g, '\n').trim();
        };

        const stateLabel = add([
            text(stateText(), { 
                size: 22,
                font: "sans-serif",
                styles: {
                    "💰": { color: rgb(255, 215, 0) },      // Золотой
                    "💎": { color: rgb(0, 191, 255) },      // Голубой
                    "❤️": { color: rgb(255, 69, 58) },      // Красный
                    "🍗": { color: rgb(255, 149, 0) },      // Оранжевый
                    "📊": { color: rgb(175, 82, 222) },     // Фиолетовый
                    "🔋": { color: rgb(52, 199, 89) },      // Салатовый
                    "⏳": { color: rgb(88, 86, 214) }       // Индиго (для времени)
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

            onClick(`button_${buttons_game[i]}`, () => {
                animation_scale_obj(btn, 0.9, BUTTONSIZE / 64)
                if (buttons_game[i] == 'passive') {
                    go('passive')
                } else if (buttons_game[i] == 'profit') {
                    go('profit')
                }
             });



        }
// Функция обновления масштаба
        // function updateGlobalScale(object) {
        //     for (let i = 0; i < object.length; i ++){
        //         let obj;
        //         obj = object[i]
        //         if (obj.nooficialname == 'Hero'){
        //             obj.scale = 0.2
        //         }
        //     }
        // }

        // onResize(() => {
        //     const windowWidth = window.innerWidth;
        //     const windowHeight = window.innerHeight;
        //     if (windowWidth < 400 || windowHeight < 600) {
        //         updateGlobalScale(scaleObject)
        //     }
        // })
        // рендер дня и ночи 

        const updateDayNight = setupDayNightSystem();

        loop(0.5, () => {

            if ( Math.random() >= 0.7 ) {
                animation_scale_obj(hero, 0.35, 0.4);
            }

            stateLabel.text = stateText();

            for (let i = 0; i < 5; i ++) {
                let obj = passive_income.investments[i]
                let obj_ch = character_passive.investments[i]
                let cost = obj_ch.current_price
                if (obj_ch.delay == 0){
                    obj_ch.delay = obj.delay
                    const baseProbability = obj.chance(character.key_bid) + character.boost.luck;
                    const randomValue = Math.random();
                    const isPositiveChange = randomValue < baseProbability;
                    const changeIntensity = 0.05 + Math.random() * 0.1;
                    if (isPositiveChange) {
                        obj_ch.current_price *= (1 + changeIntensity);
                    } else {
                        obj_ch.current_price *= (1 - changeIntensity * 0.8); 
                    }

                        }
                else {
                    obj_ch.delay -= 1;
                }
            }
        });
        // попрбую изменить маштаб если мобильное устройство 





        let dayTimer;
        let secondTimer;

        secondTimer = loop(1, () => {
            updateDayNight(character.time_game); 
            character.time_game = (character.time_game + 1) % 24

        })
        wait(4, () => {

            dayTimer = loop(23, () => {
                character.days += 1
                character.time_game = 0
                character.hungry -= character.hungry_gap
                character.money += dailyPassiveIncome;
                character.total_earned += dailyPassiveIncome;


            if (character.hungry <= 0) {
                character.hp -= character.hp_gap;
            }

            character.energy += upgrades.energy_recovery.value(character.energy_recovery);
            character.energy = Math.min(upgrades.energy_max.value(character.energy_max), character.energy);



            if (character.days % 20 == 0) {
                const randomChange = rand(-0.3, 0.3);
                character.key_bid = Math.max(0, Math.min(1.5, character.key_bid + randomChange));
                }
                });
            });

        onSceneLeave(() => {

            dayTimer?.cancel(); // Безопасная отмена
            secondTimer?.cancel();
        });



                


    });  // ← Конец callback-функции сцены
}