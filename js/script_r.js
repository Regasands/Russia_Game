import { mainScene } from './scenes/main.js';
import { passiveincomeScene } from './scenes/passive.js';
import { WIDTH, HEIGHT } from './constants.js';


const k = kaboom({
    width: WIDTH,
    height: HEIGHT,
    background: [0, 0, 0, 0], // Прозрачный фон (важно!)
    root: document.querySelector(".game-container"),
});

const makeOrnateFrame = () => {
    // Основная панель
    add([
        rect(WIDTH, HEIGHT / 8, { radius: 4 }),
        color(30, 20, 10),
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
    💰 ${money}   💎 ${diamonds}   📅 ${days} ❤️ ${hp}/100  🍗 ${hungry}%   
    🏦 ${(key_bid * 100).toFixed(1)}% 📊 +${dailyIncome}/день   🔋 ${energy}/100
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


        

// Загрузка аудиофайлов
loadSound("bg2", "sounds/1.mp3");

// Запуск всех треков с loop
const track1 = play("bg2", {
    volume: 0.2,
    loop: true
});


// Регистрация сцен
passiveincomeScene();
mainScene();
go("main");