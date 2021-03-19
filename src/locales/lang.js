import idiom from 'idiom.js';

// Language Config
const lang = idiom({
    default: {
        welcome: 'Welcome to Phaser Sample App created by KaiOS!',
        title: 'Snake',
        menu: 'Menu',
        rules: 'Rules',
        score: 'Score : ',
        highScore: 'HighScore: ',
        lives: 'Lives : ',
        win: `  YOU WON \n Press '5' Go to Next Stage!`,
        gameOver: 'GAME OVER',
        restart: 'Restart',
        back: 'Back',
        loading: 'Loading Fonts...',
        start: 'START',
        instruction: 'INSTRUCTION',
        instructionText: ' Left => Anti-Clockwise \n Right => Clockwise',
        about: 'ABOUT',
        aboutText: 'This sample app is created by'
    },
    'pt-BR': {
        welcome: 'Bem vindo ao Phaser Sample App criado por KaiOS!'
    }
});

export default lang(window.navigator.language);
