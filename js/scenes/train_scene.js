import { loadGameData, saveGameData } from "../gameStorge.js";
import { WIDTH, HEIGHT, buttons_game, BUTTONSIZE } from "../constants.js";

function addWakeUpEffect() {
    // Затемняющий слой
    add([
        rect(width(), height()),
        color(0, 0, 0),
        opacity(0.4), // Более сильное затемнение
        fixed(),
        z(98),
        "wakeup_effect"
    ]);
    
    // Слой с размытием (эмулируем эффект "заспанных глаз")
    add([
        rect(width(), height()),
        color(255, 255, 255),
        opacity(0.1),
        fixed(),
        z(99),
        "wakeup_blur"
    ]);
}
let talk = null; // глобально для сцены

function typeWrite(textt, all_text = false) {
    const cardY = 100;
    const card = add([
        rect(WIDTH - 120, HEIGHT / 5, { radius: 24 }),
        area(),
        pos(WIDTH / 2, cardY),
        z(100),
        anchor("top"),
        color(30, 30, 40),
        outline(3, rgb(120, 120, 180)),
        opacity(0.92),
        fixed(),
        "train_text_card",
        fadeIn(0.25)
    ]);

    // Сместим текст чуть ниже внутри рамки (anchor "top" и положительный y)
    const label = card.add([
        text("", {
            size: 23,
            width: WIDTH - 180,
            font: "sans-serif",
            lineSpacing: 8,
            styles: {
                "": { color: rgb(255, 255, 255), shadow: { blur: 2, color: rgb(0,0,0), offset: vec2(2,2) } }
            }
        }),
        pos(0, 130), // было (0, -200), теперь чуть ниже верхнего края рамки
        anchor("bot"),
        z(101),
        "train_text_label"
    ]);

    let index = 0;
    if (talk) {
        talk.stop();
    }
    talk = play('talk_hero', {
        volume: 0.4,
        speed: 0.9,
        loop: true,
    });

    function updateLabelPos(currentLen, totalLen) {
        // Можно добавить небольшое смещение вверх по мере появления текста, если нужно
        // Например, label.pos.y = 32 - Math.floor((currentLen / totalLen) * 24);
    }

    if (all_text) {
        label.text = textt;
        updateLabelPos(textt.length, textt.length);
        if (talk) talk.stop();
        return [card, null];
    } else {
        const interval = setInterval(() => {
            label.text = textt.slice(0, index);
            updateLabelPos(index, textt.length);
            index++;
            if (index > textt.length) {
                clearInterval(interval);
                if (talk) talk.stop();
            }
        }, 40);
        return [card, interval];
    }
}

// Функция для отображения стрелки под нужной кнопкой
function showArrowIfNeeded(index, btns) {
    // Удаляем все предыдущие стрелки
    get("arrow_indicator").forEach(destroy);

    // Показываем стрелку только для определённых индексов (например, 1-6)
    if (index > 0 && index < 7) {
        const btn = btns[index - 1];
        if (btn) {
            add([
                sprite('arrow'),
                pos(btn.pos.x, btn.pos.y - BUTTONSIZE * 0.7),
                scale(0.22),
                fixed(),
                z(101),
                "arrow_indicator"
            ]);
        }
    }
}


// Новый асинхронный экспорт функции trainScenee
export function trainScenee(data, track1) {
    track1.stop();
    scene('train', () => {
        let track2 = play("train_music", {
            volume: 0.2,
        });

        track1.play();


        let index = 0;
        addWakeUpEffect();
        let gameData = loadGameData();
        console.log(data)
        add([
            sprite(`background_${gameData.character.id_background}`),
            anchor('center'),
            pos(WIDTH / 2, HEIGHT / 2),
            fixed(),
            z(-100),
            scale(0.7),
        ]);

        // Добавляем героя
        const hero = add([
            pos(WIDTH / 4, HEIGHT / 2 + 30), // было WIDTH / 2 - 80, стало WIDTH / 4
            sprite('hero_train'), // Убедитесь что спрайт загружен
            scale(0.33),
            area({ scale: 0.8 }), // Уменьшенная область для лучшего коллайдинга
            anchor("center"),
            opacity(0),
            z(10),
            'hero_train',
            {
                state: 0
            }
        ]);
        hero.use(fadeIn(0.7));

        // Отрисовка кнопок и сохранение их для стрелки
        const btns = [];
        for (let i = 0; i < buttons_game.length; i++) {
            const btn = add([
                pos((i + 0.5) * BUTTONSIZE, HEIGHT - BUTTONSIZE * 0.7),
                sprite(buttons_game[i]),
                scale(BUTTONSIZE / 64),
                area({ scale: true }), 
                anchor("center"), // Меняем с "topleft" на "center"
                `button_${buttons_game[i]}` // Тег для идентификации
            ]);
            btns.push(btn);
        }
        

        let currentCard = typeWrite(data.train_hero.message[String(index)].text.ru);
        showArrowIfNeeded(index, btns);

        let doubleclick = 0;
        let finished = false;

        onClick('hero_train', () => {
            if (finished) return;
            doubleclick++;
            // Удаляем стрелку при любом клике
            get("arrow_indicator").forEach(destroy);

            if (doubleclick === 1) {
                destroy(currentCard[0]);
                if (currentCard[1]) clearInterval(currentCard[1]);
                currentCard = typeWrite(data.train_hero.message[String(index)].text.ru, true);
                showArrowIfNeeded(index, btns);
            } else if (doubleclick === 2) {
                destroy(currentCard[0]);
                if (currentCard[1]) clearInterval(currentCard[1]);
                index++;
                if (index < Object.keys(data.train_hero.message).length) {
                    currentCard = typeWrite(data.train_hero.message[String(index)].text.ru);
                    showArrowIfNeeded(index, btns);
                    doubleclick = 0;
                } else {
                    finished = true;
                    gameData.character.is_first_game = false;
                    saveGameData(gameData);
                    wait(0.2, () => {
                        track2.stop();
                        track1.play();
                        go("main");
                    });
                }
            }
        });
    });
}