import {
    HEIGHT,
    WIDTH,
    BUTTONSIZE,
    buttons_game,
    passive_income,
    wait_enimation,
    upgrades,
    DAY_NIGHT_CYCLE,
    heroes_info,
    backgrounds_info,
    time_boost,
    character_object_vote,
    passsive_vote_boost,
} from "../constants.js";
import { loadGameData, saveGameData } from "../gameStorge.js";

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
    

};


// Очень костылльная штука, в дальнейшем надо передлать,чтобы для каждыой локации
// Не писать if , TODO подумать как реализовать
export function getPassiveIncome(index, gameData) {
    let passiveIncome = 0;
    let level = 0;
    level = gameData.character_passive.real_estate[index];
    if (level > 0) {
        passiveIncome += passive_income.real_estate[index].income(level);
    }
    level = gameData.character_passive.village_business[index];
    if (level > 0) {
        passiveIncome += passive_income.village_business[index].income(level);
    }
    level = gameData.character_passive.shadow_economy[index];
    if (level > 0) {
        passiveIncome += passive_income.shadow_economy[index].income(level);
    }
    return passiveIncome * gameData.character.boost.income;

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


    function transitionToCycle(cycle) {
        if (!currentOverlay) return;
        
        currentOverlay.color = cycle.color;
        targetOpacity = cycle.opacity;
        activeCycle = cycle.name;
    }
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

    initOverlay();
    transitionToCycle(DAY_NIGHT_CYCLE.DAY);
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


// Так надо сделать функцию которая считает бусты
export function change_boost_character(gameData){
    var boost = {
        luck: 0,
        click: 1,
        crete: 1,
        income: 1,
        energy_max: 1,
        energy_recovery: 1,
    }
    Object.keys(gameData.character_open_hero).forEach((key) => {
        if (gameData.character_open_hero[key].is_wear) {
            Object.keys(heroes_info[key].effect).forEach((key2) => {
                boost[key2] = heroes_info[key].effect[key2]
            })
            gameData.character.boost = boost
        }
    })
    Object.keys(gameData.character_open_background).forEach((key) => {
        if (gameData.character_open_background[key].is_wear) {
            Object.keys(backgrounds_info[key].effect).forEach((key2) => {
                if (key == 'all_effects'){
                    Object.keys(boost).forEach((key3) => {
                        if (key3 == 'luck') {
                            boost[key3] += backgrounds_info[key].effect[key2]
                        } else {
                            boost[key3] *= backgrounds_info[key].effect[key2]
                        }
                    });
                } else {

                    if (key2 == 'luck') {
                        boost[key2] += backgrounds_info[key].effect[key2]
                    } else {
                        boost[key2] *= backgrounds_info[key].effect[key2]
                    }
                }
            })

        }
    })

    Object.keys(gameData.character_boost).forEach((key) => {
        if (gameData.character_boost[key].count > 0) {
            if (gameData.character_boost[key].time_start >= time() - time_boost[key].time) {
                const effectKey = Object.keys(time_boost[key].effect)[0];
                const effectValue = Object.values(time_boost[key].effect)[0];
                if (effectKey === 'luck') {
                    boost[effectKey] += effectValue;
                } else {
                    boost[effectKey] *= effectValue;
                }
            } else if (gameData.character_boost[key].time_start < time() - time_boost[key].time) {
                gameData.character_boost[key].count -= 1;
                const effectKey = Object.keys(time_boost[key].effect)[0];
                const effectValue = Object.values(time_boost[key].effect)[0];
                if (effectKey === 'luck') {
                    boost[effectKey] += effectValue;
                } else {
                    boost[effectKey] *= effectValue;
                }
                gameData.character_boost[key].time_start = time();
            }
        }
    });

    Object.keys(passsive_vote_boost).forEach((key) => {
        const boostData = passsive_vote_boost[key];
        if (gameData.character.votes >= boostData.requirements_vote) {
            Object.keys(boostData.effect).forEach((boostKey) => {
                if (boostKey === 'luck') {
                    boost[boostKey] += boostData.effect[boostKey];
                } else {
                    boost[boostKey] *= boostData.effect[boostKey];
                }
            });
        }
    });

    gameData.character.boost = boost;
};

// Добавляем функцию для затемняющего слоя
export function addDarkOverlay() {
    add([
        rect(width(), height()),
        color(0, 0, 0),
        opacity(0.18), // Лёгкое затемнение
        fixed(),
        z(98),
        "dark_overlay"
    ]);
}
    

export function mainScene() {
    scene("main", () => {
        addDarkOverlay();
        let gameData = loadGameData();

        onLoad(() => {
            add([
                sprite(`background_${gameData.character.id_background}`),
                anchor('center'),
                pos(WIDTH / 2, HEIGHT / 2),
                fixed(),
                z(-100),
                scale(0.7),
            ]);
            change_boost_character(gameData)
            var hero = add([
                pos(WIDTH / 2, HEIGHT / 2 + 20),
                sprite(`hero_${gameData.character.id_character}`),
                scale(0.4),
                area({ scale: true }),
                anchor("center"),
                `hero`,
                {
                    nooficialname: 'Hero',
                }
            ])
        });


        // Считаем пасивный доход
        let dailyPassiveIncome = 0;
        for (let i = 0; i < 5; i ++) {
            dailyPassiveIncome += getPassiveIncome(i, gameData);
        }

        onClick("hero", (hero) => {
            play('hero_click', {volume: 0.09, speed: 1})
            animation_scale_obj(hero, 0.35, 0.4)
            if (gameData.character.energy == 0) {
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
            
            let chance = upgrades.chance_crete.value(gameData.character.chance_crete) * gameData.character.boost.crete >= Math.random()
            let click = upgrades.click_boost.value(gameData.character.click_boost) * gameData.character.boost.click
            if (click - gameData.character.energy >= 0) {
                gameData.character.money += gameData.character.energy;
                gameData.character.total_earned += gameData.character.energy;
                gameData.character.energy = 0          
            }  else if (click < gameData.character.energy) {   
                gameData.character.energy -= click; 
                click = chance ? click * 5: click
                gameData.character.money += click;
                gameData.character.total_earned += click;
                if (chance){
                    addKaboom(hero.pos)
                }
            }
            saveGameData(gameData);
        });

        // Инициализация
        makeOrnateFrame( WIDTH, HEIGHT / 6.7);

        const stateText = () => {
            const money = Math.floor(Number(gameData.character.money));
            const diamonds = Number(gameData.character.diamonds);
            const days = Number(gameData.character.days);
            const votes = Number(gameData.character.votes || 0)
            const dailyIncome = Math.floor(Number(dailyPassiveIncome));
            const energy = Math.floor(gameData.character.energy);
            const time_game = Number(gameData.character.time_game);

            return `
            💰 ${money}        💎 ${diamonds}            📊 +${dailyIncome}/день    
            🗳️ ${Math.floor(votes)}    🔋 ${energy}/${Math.floor(upgrades.energy_max.value(gameData.character.energy_max) * gameData.character.boost.energy_max)}
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
                    "🗳️": { color: rgb(255, 105, 180) },    // Розовый для голосов
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
                } else if (buttons_game[i] == 'update') {
                    go('update_state')
                } else if (buttons_game[i] == 'vote') {
                    go('vote')
                } else if (buttons_game[i] == 'setting') {
                    go('setting')
                } else if (buttons_game[i] == 'shop') {
                    go('shop')
                }
             });



        }

        // рендер дня и ночи 
        const updateDayNight = setupDayNightSystem();

        loop(4, () => {
            change_boost_character(gameData)
            saveGameData(gameData);
        })

        loop(0.5, () => {

            stateLabel.text = stateText();
            gameData.character.energy += upgrades.energy_recovery.value(gameData.character.energy_recovery) * gameData.character.boost.energy_recovery / 48;
            gameData.character.energy = Math.min(upgrades.energy_max.value(gameData.character.energy_max) * gameData.character.boost.energy_max, gameData.character.energy);
            for (let i = 0; i < 5; i ++) {
                let obj = passive_income.investments[i]
                let obj_ch = gameData.character_passive.investments[i]
                let cost = obj_ch.current_price
                if (obj_ch.delay == 0){
                    obj_ch.delay = obj.delay
                    const baseProbability = obj.chance(gameData.character.key_bid) + gameData.character.boost.luck;
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

            if (gameData.character.votes < 30 ) {
                go('endgame')
            }

            saveGameData(gameData);
        });

        let dayTimer;
        let secondTimer;

        secondTimer = loop(1, () => {
            spawnRain(gameData.character.is_rain, WIDTH, HEIGHT);

            updateDayNight(gameData.character.time_game);
            gameData.character.time_game = (gameData.character.time_game + 1) % 24
            saveGameData(gameData);
        })



        wait(4, () => {

            dayTimer = loop(23, () => {

                gameData.character.days += 1
                gameData.character.time_game = 0
                gameData.character.money += dailyPassiveIncome;
                gameData.character.total_earned += dailyPassiveIncome;

            // Считаекм доходы и расзоды от голосов
            for (let key = 0; key < Object.keys(character_object_vote).length; key ++) {
                if (gameData.character_object_vote[key].character_open) {
                    gameData.character.votes += gameData.character_object_vote[key].vote
                    gameData.character.money -= gameData.character_object_vote[key].dealy_cost
                }
            }
            gameData.character.votes -=  Math.floor((gameData.character.days * 2) ** 1.3)




            if (gameData.character.days % 20 == 0) {
                const randomChange = rand(-0.3, 0.3);
                gameData.character.key_bid = Math.max(0, Math.min(1.5, gameData.character.key_bid + randomChange));
                }
                saveGameData(gameData);
            });
            });

        onSceneLeave(() => {

            dayTimer?.cancel(); // Безопасная отмена
            secondTimer?.cancel();
        });


    });  // ← Конец callback-функции сцены
}

export function spawnRain(isRain, WIDTH, HEIGHT) {
    if (!isRain) return;
    
    for (let i = 0; i < 10; i++) {
        var rain = add([
            sprite("simple_rain"),
            pos(rand(0, WIDTH), -50),
            scale(0.09),
            opacity(0.2),
            anchor("center"),
            offscreen({ destroy: true }),
            move(DOWN, rand(50, 200)),
            "rain",
            {
                speedX: 5,
            }
        ]);
    }
}