import { mainScene } from './scenes/main.js';
import { passiveincomeScene } from './scenes/passive.js';
import { WIDTH, HEIGHT } from './constants.js';
import { profitupgradeScene } from './scenes/profit.js';
import { character, buttons_game, button_profit, button_passive } from './constants.js';

const k = kaboom({
    width: WIDTH,
    height: HEIGHT,
    background: [0, 0, 0, 0], // Прозрачный фон (важно!)
    root: document.querySelector(".game-container"),
});


// Загрузка   фонов 
loadSprite("background", `../sprites/background/${character.background}.png`, {
        width: WIDTH,
        height: HEIGHT });


loadSprite("background_profit", `../sprites/background/profit.png`, {
        width: WIDTH,
        height: HEIGHT });

loadSprite("background_passive", `../sprites/background/passive.png`, {
        width: WIDTH,
        height: HEIGHT });



// загруцжаем игровых персонажкей
for (let i = 0; i < 5; i ++) {
    loadSprite(`hero_${i}`, `../sprites/character/${i}.png`);

}

        
//  Загрузка для главнойц страрницы
for (let i = 0; i < button_passive.length; i++) {
    loadSprite(buttons_game[i], `../sprites/button/main/${buttons_game[i]}.png`);
}


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


loadSound('hero_click', 'sounds/game_sounds/Click_mouse_snd.wav')


// загрузка для profit сцены



//загружаем музыку
loadSound('no_money', 'sounds/game_sounds/where_money.mp3')
loadSound('buy_button', 'sounds/game_sounds/applepay.mp3')




//  загрнука для сцены passive


loadSound("ahyou", "sounds/game_sounds/fack_you.mp3");
loadSound('upgrade_button', 'sounds/game_sounds/upgrade_button.mp3')
loadSound('no_money', 'sounds/game_sounds/where_money.mp3')






// рендер кнопок общий
loadSprite("home", "../sprites/button/home.png");
loadSprite('block_button', '../sprites/button/block_button.png')
loadSprite('prev_button', '../sprites/button/profit/prev.png')
loadSprite('next_button', '../sprites/button/profit/next.png')



for (let i = 1; i < button_passive.length; i++) {
    loadSprite(button_passive[i], `../sprites/button/passive/${button_passive[i]}.png`);
    loadSprite(button_profit[i], `../sprites/button/profit/${button_profit[i]}.png`);
}



// Загрузка аудиофайлов
loadSound("bg2", "sounds/background_sounds/7.mp3");

// Запуск всех треков с loop
const track1 = play("bg2", {
    volume: 0.2,
    speed: 1,
    loop: true
});


// Регистрация сцен
passiveincomeScene();
profitupgradeScene();
mainScene();
go("main");


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