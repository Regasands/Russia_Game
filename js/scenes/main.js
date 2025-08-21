import {
    HEIGHT,
    WIDTH,
    BUTTONSIZE,
    buttons_game,
    character_passive,
    passive_income,
    wait_enimation,
    character,
    upgrades,
    DAY_NIGHT_CYCLE,
    heroes_info,
    character_open_hero,
    character_open_background,
    backgrounds_info,
    character_boost,
    time_boost,
    character_object_vote,
    passsive_vote_boost,
} from "../constants.js";

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
export function change_boost_character(){
    var boost = {
        luck: 0,
        click: 1,
        crete: 1,
        income: 1,
        energy_max: 1,
        energy_recovery: 1,
    }
    Object.keys(character_open_hero).forEach((key) => {
        if (character_open_hero[key].is_wear) {
            Object.keys(heroes_info[key].effect).forEach((key2) => {
                boost[key2] = heroes_info[key].effect[key2]
            })
            character.boost = boost
        }
    })
    Object.keys(character_open_background).forEach((key) => {
        if (character_open_background[key].is_wear) {
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

        // Применяем временные бусты
    Object.keys(character_boost).forEach((key) => {
        if (character_boost[key].count > 0) {
            if (character_boost[key].time_start >= time() - time_boost[key].time) {
                // Буст активен
                const effectKey = Object.keys(time_boost[key].effect)[0];
                const effectValue = Object.values(time_boost[key].effect)[0];
                
                if (effectKey === 'luck') {
                    boost[effectKey] += effectValue;
                } else {
                    boost[effectKey] *= effectValue;
                }
            } else if (character_boost[key].time_start < time() - time_boost[key].time) {

                character_boost[key].count -= 1;
                
                const effectKey = Object.keys(time_boost[key].effect)[0];
                const effectValue = Object.values(time_boost[key].effect)[0];
                
                if (effectKey === 'luck') {
                    boost[effectKey] += effectValue;
                } else {
                    boost[effectKey] *= effectValue;
                }
                
                character_boost[key].time_start = time();
            }
        }
    });

    Object.keys(passsive_vote_boost).forEach((key) => {
        const boostData = passsive_vote_boost[key];
        if (character.votes >= boostData.requirements_vote) {
            Object.keys(boostData.effect).forEach((boostKey) => {
                if (boostKey === 'luck') {
                    boost[boostKey] += boostData.effect[boostKey];
                } else {
                    boost[boostKey] *= boostData.effect[boostKey];
                }
            });
        }
    });


    character.boost = boost;
};

    

export function mainScene() {



    scene("main", () => {  // ← Начало callback-функции сцены

        onLoad(() => {
            add([
                sprite(`background_${character.id_background}`),
                anchor('center'),
                pos(WIDTH / 2, HEIGHT / 2),
                fixed(),
                z(-100),
                scale(0.7),
            ]);
                        // Загружаем храктеристки персонажа 
            // TODO тут же будет и отрисовка персонажа в идеале
            change_boost_character()
            var hero = add([
                pos(WIDTH / 2, HEIGHT / 2 + 20),
                sprite(`hero_${character.id_character}`),
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
            dailyPassiveIncome += getPassiveIncome(i);
        }




        onClick("hero", (hero) => {
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
            const votes = Number(character.votes || 0)
            const dailyIncome = Math.floor(Number(dailyPassiveIncome));
            const energy = Math.floor(character.energy);
            const time_game = Number(character.time_game);

            return `
            💰 ${money}        💎 ${diamonds}            📊 +${dailyIncome}/день    
            🗳️ ${votes}    🔋 ${energy}/${Math.floor(upgrades.energy_max.value(character.energy_max) * character.boost.energy_max)}
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
                } else if (buttons_game[i] == 'vote') [
                    go('vote')
                ]
             });



        }

        // рендер дня и ночи 
        const updateDayNight = setupDayNightSystem();

        loop(4, () => {
            change_boost_character()
        })

        loop(0.5, () => {

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

        let dayTimer;
        let secondTimer;

        secondTimer = loop(1, () => {
            if (character.is_rain){
                for (let i = 0; i < 10; i ++) {
                    var rain = add([
                        sprite("rain", { anim: "fall" }),
                        pos(rand(0, WIDTH), -10),
                        area(),
                        scale(0.09),
                        opacity(0.2),
                        move(DOWN, rand(100, 200)),
                        anchor("center"),
                        "rain",
                    ]);
                    rain.play('fall')
                    rain.onUpdate(() => {
                        if (rain.pos.y > HEIGHT + 10) {
                            destroy(rain);
                        }
                });
                }
            }

            updateDayNight(character.time_game); 
            character.time_game = (character.time_game + 1) % 24

        })


        wait(4, () => {

            dayTimer = loop(23, () => {
                character.days += 1
                character.time_game = 0
                character.money += dailyPassiveIncome;
                character.total_earned += dailyPassiveIncome;

            // Считаекм доходы и расзоды от голосов
            for (let key = 0; key < Object.keys(character_object_vote).length; key ++) {
                if (character_object_vote[key].character_open) {
                    character.votes += character_object_vote[key].vote
                    character.money -= character_object_vote[key].dealy_cost
                }
            }
            character.votes -=  Math.floor((character.days * 2) ** 1.3)

            character.energy += upgrades.energy_recovery.value(character.energy_recovery) * character.boost.energy_recovery;
            character.energy = Math.min(upgrades.energy_max.value(character.energy_max) * character.boost.energy_max, character.energy);



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