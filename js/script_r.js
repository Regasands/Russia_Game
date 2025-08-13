import { mainScene } from './scenes/main.js';
import { passiveincomeScene } from './scenes/passive.js';
import { WIDTH, HEIGHT } from './constants.js';
import { profitupgradeScene } from './scenes/profit.js';


const k = kaboom({
    width: WIDTH,
    height: HEIGHT,
    background: [0, 0, 0, 0], // Прозрачный фон (важно!)
    root: document.querySelector(".game-container"),
});


// Загрузка аудиофайлов
loadSound("bg2", "sounds/background_sounds/6.mp3");

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