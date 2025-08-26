// Импорты должны быть в начале, оставляем их здесь
import { mainScene } from './scenes/main.js';
import { passiveincomeScene } from './scenes/passive.js';
import { WIDTH, HEIGHT } from './constants.js';
import { profitupgradeScene } from './scenes/profit.js';
import { buttons_game, button_profit, button_passive } from './constants.js';
import { updatestateScene } from './scenes/update.js';
import { voteScene } from './scenes/vote.js';
import { settingScene } from './scenes/setting.js';
import { loadGameData, saveGameData } from './gameStorge.js';
import { trainScenee } from './scenes/train_scene.js';
import { endGame } from './scenes/endGame.js';

// Функция загрузки всех ресурсов игры
function loadAllGameResources() {
    // загрузка фоновых персонажей
    loadSprite("hero_train", "sprites/character_back/train.png");

    // загрузка для обучения 
    loadSprite('arrow', 'sprites/icon/arrow.png');

    // loadSound('train_music', '/sounds/background_sounds/train_music.mp3');

    // Загрузка для главной страницы
    loadSound('talk_hero', 'sounds/game_sounds/talk_hero.mp3');

    loadSprite("background_profit", "sprites/background/profit.png", {
        width: WIDTH,
        height: HEIGHT
    });

    loadSprite("background_passive", "sprites/background/passive.png", {
        width: WIDTH,
        height: HEIGHT
    });
    
    loadSprite("background_vote", "sprites/background/vote_background.png", {
        width: WIDTH,
        height: HEIGHT
    });

    // загружаем игровых персонажей
    for (let i = 0; i < 5; i++) {
        loadSprite(`hero_${i}`, `sprites/character/${i}.png`);
    }
    
    // Загрузка фонов 
    for (let i = 0; i < 6; i++) {
        loadSprite(`background_${i}`, `sprites/background/${i}.png`, {
            width: WIDTH,
            height: HEIGHT
        });
    }

    // Загрузка для главной страницы
    for (let i = 0; i < button_passive.length; i++) {
        loadSprite(buttons_game[i], `sprites/button/main/${buttons_game[i]}.png`);
    }

    // симуляция дождя 
    loadSprite("rain", "sprites/icon/rain.png", {
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

    loadSprite('simple_rain', 'sprites/icon/rain_simple.png');

    loadSprite("coin", "sprites/icon/coin_am.png", {
        sliceX: 3,
        sliceY: 3,
        anims: {
            "spin": {
                from: 0,
                to: 8,
                speed: 12,
                loop: true
            }
        }
    });

    loadSound('hero_click', 'sounds/game_sounds/Click_mouse_snd.wav');

    // загрузка для profit сцены
    loadSound('no_money', 'sounds/game_sounds/where_money.mp3');
    loadSound('buy_button', 'sounds/game_sounds/applepay.mp3');

    // загрузка для сцены passive
    loadSound("ahyou", "sounds/game_sounds/fack_you.mp3");
    loadSound('upgrade_button', 'sounds/game_sounds/buy_1.mp3');

    // загрузка для сцены vote
    loadSprite('people', "sprites/icon/people.png");
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
    loadSprite("home", "sprites/button/home.png");
    loadSprite('block_button', 'sprites/button/block_button.png');
    loadSprite('prev_button', 'sprites/button/profit/prev.png');
    loadSprite('next_button', 'sprites/button/profit/next.png');

    for (let i = 1; i < button_passive.length; i++) {
        loadSprite(button_passive[i], `sprites/button/passive/${button_passive[i]}.png`);
        loadSprite(button_profit[i], `sprites/button/profit/${button_profit[i]}.png`);
    }

    // Загрузка аудиофайлов
    loadSound("bg2", "sounds/background_sounds/train_music.mp3");
}

// Обертка для Яндекс Игр
window.addEventListener('load', () => {
    // Пробуем инициализировать Яндекс SDK
    if (typeof YaGames !== 'undefined') {
        YaGames.init()
            .then(ysdk => {
                window.ysdk = ysdk;
                console.log('Yandex SDK initialized');
                
                // Убираем прелоадер если есть
                const loader = document.getElementById('loader');
                if (loader) loader.style.display = 'none';
                
                // Запускаем игру
                startGame(ysdk);
            })
            .catch(error => {
                console.warn('Yandex SDK init failed, running in standalone mode:', error);
                startGame(null);
            });
    } else {
        console.log('Running in standalone mode (no Yandex SDK)');
        startGame(null);
    }
});

function startGame(ysdk) {
    // Инициализация Kaboom
    kaboom({
        width: WIDTH,
        height: HEIGHT,
        background: [0, 0, 0, 0],
        // Для Яндекс Игр лучше не указывать root, они сами управляют DOM
    });

    // Загрузка всех ресурсов игры
    loadAllGameResources();

    // Запуск фоновой музыки
    const track1 = play("bg2", {
        volume: 0.2,
        speed: 0.8,
        loop: true
    });

    // Модифицированная функция определения языка
    function getUserLang(ysdk) {
        // Пробуем получить язык из Яндекс SDK
        if (ysdk && ysdk.environment && ysdk.environment.i18n) {
            return ysdk.environment.i18n.lang;
        }
        
        // Fallback на оригинальную логику
        const lang = (navigator.language || navigator.userLanguage || "ru").toLowerCase();
        if (lang.startsWith("ru")) return "ru";
        if (lang.startsWith("en")) return "en";
        return "ru";
    }

    // Загружаем все сюжетное и только после этого запускаем сцены
    loadJSON("messages", "message/convers/main.json")
        .then(data => {
            console.log("messages loaded", data);

            let gameData = loadGameData();
            const userLang = getUserLang(ysdk);
            
            console.log('Detected language:', userLang);
            gameData.character.is_ru = userLang.startsWith("ru");
            saveGameData(gameData);

            // Инициализация сцен
            passiveincomeScene();
            endGame();
            profitupgradeScene();
            updatestateScene();
            voteScene();
            settingScene();
            mainScene();
            trainScenee(data);
            
            if (gameData.character.is_first_game) {

                go("train");
            } else {
                go("main");
            }
        })
        .catch(e => {
            console.error("messages error", e);
            // Fallback: запускаем игру без сообщений
            let gameData = loadGameData();
            const userLang = getUserLang(ysdk);
            gameData.character.is_ru = userLang.startsWith("ru");
            saveGameData(gameData);

            passiveincomeScene();
            endGame();
            profitupgradeScene();
            updatestateScene();
            voteScene();
            settingScene();
            mainScene();
            trainScenee({});

            
            if (gameData.character.is_first_game) {
                // Нужно передать какие-то данные для обучения

                go("train");
            } else {
                go("main");
            }
        });
}