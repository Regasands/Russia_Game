import { mainScene } from './scenes/main.js';
import { passiveincomeScene } from './scenes/passive.js';
import { WIDTH, HEIGHT } from './constants.js';
import { profitupgradeScene } from './scenes/profit.js';
import { buttons_game, button_profit, button_passive } from './constants.js';
import { updatestateScene } from './scenes/update.js';
import { voteScene } from './scenes/vote.js';
import { settingScene } from './scenes/setting.js'; // добавить импорт
import { loadGameData, saveGameData } from './gameStorge.js';
import { trainScenee } from './scenes/train_scene.js';
import { endGame } from './scenes/endGame.js';

const k = kaboom({
    width: WIDTH,
    height: HEIGHT,
    background: [0, 0, 0, 0], // Прозрачный фон (важно!)
    root: document.querySelector(".game-container"),
});





// загрузка фоновых персонажей
loadSprite("hero_train", `../sprites/character_back/train.png`)

// загрузка для обучения 
loadSprite('arrow', '../sprites/icon/arrow.png')


// loadSound('train_music', 'sounds/background_sounds/train_music.mp3')



//  Загрузка для главнойц страрницы
loadSound('talk_hero', 'sounds/game_sounds/talk_hero.mp3')

loadSprite("background_profit", `../sprites/background/profit.png`, {
        width: WIDTH,
        height: HEIGHT });

loadSprite("background_passive", `../sprites/background/passive.png`, {
        width: WIDTH,
        height: HEIGHT });
loadSprite("background_vote", `../sprites/background/vote_background.png`, {
        width: WIDTH,
        height: HEIGHT });



// загруцжаем игровых персонажкей
for (let i = 0; i < 5; i ++) {
    loadSprite(`hero_${i}`, `../sprites/character/${i}.png`);

}
// Загрузка   фонов 
for (let i = 0; i < 6; i++) {
    loadSprite(`background_${i}`, `../sprites/background/${i}.png`, {
            width: WIDTH,
            height: HEIGHT });
}


        
//  Загрузка для главнойц страрницы
for (let i = 0; i < button_passive.length; i++) {
    loadSprite(buttons_game[i], `../sprites/button/main/${buttons_game[i]}.png`);
}


// симуляция дождя 
loadSprite("rain", "../sprites/icon/rain.png", {
    sliceX: 4, 
    sliceY: 1, 
    anims: {
        "fall": {
            from: 0,
            to: 3,
            speed: 5,
            loop: true
        }
    }
});

loadSprite('simple_rain', '../sprites/icon/rain_simple.png')

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


loadSound("ahyou", "sounds/game_sounds/fack_you.mp3")
loadSound('upgrade_button', 'sounds/game_sounds/buy_1.mp3')
loadSound('no_money', 'sounds/game_sounds/where_money.mp3')


// загрузка для сцены vote

loadSprite('people', "../sprites/icon/people.png")
loadSprite("vote_am", "sprites/icon/vote_am.png", {
    sliceY: 1,
    sliceX: 3,  
    anims: {
        "spin": {
            from: 0,
            to: 2,
            speed: 12,
            loop: true
        }
    }
});



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
loadSound("bg2", "sounds/background_sounds/train_music.mp3");

// Запуск всех треков с loop
export const track1 = play("bg2", {
    volume: 0.2,
    speed: 0.8,
    loop: true
});





// Определяем язык пользователя (ru/en)
function getUserLang() {
    const lang = (navigator.language || navigator.userLanguage || "ru").toLowerCase();
    console.log(navigator.language, navigator.userLanguage, lang,  ';i')   
    if (lang.startsWith("ru")) return "ru";
    if (lang.startsWith("en")) return "en";
    return "ru";
}

// Загружаем все сюжетное и только после этого запускаем сцены
loadJSON("messages", "../message/convers/main.json")
    .then(data => {
        console.log("messages loaded", data);

        let gameData = loadGameData();
        console.log(getUserLang());
        if (getUserLang() == 'en'){
            gameData.character.is_ru = false;
        }
        else {
            gameData.character.is_ru = true;
        }
        saveGameData(gameData);
        

        passiveincomeScene();
        endGame();
        profitupgradeScene();
        updatestateScene();
        voteScene();
        settingScene();
        mainScene();
        if (gameData.character.is_first_game) {
            trainScenee(data);
            go("train");
        } else {
            go("main");
        }
    })
    .catch(e => console.error("messages error", e));


// Удалите или закомментируйте этот блок, чтобы не было двойного запуска сцен:
// passiveincomeScene();
// profitupgradeScene();
// updatestateScene();
// voteScene();
// settingScene(); // добавить инициализацию
// mainScene();
// if (loadGameData().character.is_first_game) {
//     trainScenee();
//     go("train");
// } else {
//     go("main");
// }

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