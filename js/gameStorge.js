import {
    character,
    character_object_vote,
    passsive_vote_boost,
    character_passive,
    character_open_hero,
    character_open_background,
    character_boost
} from './constants.js';

// Объединяем все данные по умолчанию
const defaultGameData = {
    character: {...character},
    character_object_vote: {...character_object_vote},
    passsive_vote_boost: {...passsive_vote_boost},
    character_passive: {...character_passive},
    character_open_hero: {...character_open_hero},
    character_open_background: {...character_open_background},
    character_boost: {...character_boost}
};

// Функция для загрузки данных
export function loadGameData() {
    try {
        const savedData = localStorage.getItem('gameData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            
            // Возвращаем объединенные данные (сохраненные + defaults для новых полей)
            return {
                character: {...defaultGameData.character, ...parsedData.character},
                character_object_vote: {...defaultGameData.character_object_vote, ...parsedData.character_object_vote},
                passsive_vote_boost: {...defaultGameData.passsive_vote_boost, ...parsedData.passsive_vote_boost},
                character_passive: {...defaultGameData.character_passive, ...parsedData.character_passive},
                character_open_hero: {...defaultGameData.character_open_hero, ...parsedData.character_open_hero},
                character_open_background: {...defaultGameData.character_open_background, ...parsedData.character_open_background},
                character_boost: {...defaultGameData.character_boost, ...parsedData.character_boost}
            };
        }
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    }
    
    // Возвращаем копию данных по умолчанию
    return {...defaultGameData};
}

// Функция для сохранения данных
export function saveGameData(gameData) {
    try {
        localStorage.setItem('gameData', JSON.stringify(gameData));
    } catch (error) {
        console.error('Ошибка при сохранении данных:', error);
    }
}

// Функция для сброса к значениям по умолчанию
export function resetGameData() {
    saveGameData(defaultGameData);
    return {...defaultGameData};
}