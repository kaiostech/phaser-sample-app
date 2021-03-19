import idiom from 'idiom.js';

// Language Config
const lang = idiom({
    default: {
        welcome: 'Welcome to Phaser Sample App created by KaiOS!',
        menu: 'Menu',
        about: 'About',
        aboutText: 'This sample app is created by',
        rules: 'Rules',
        score: 'Score : ',
        lives: 'Lives : ',
        win: `  YOU WON \n Press '5' Go to Next Stage!`,
        gameOver: '  GAME OVER \n Click to restart',
        restart: 'Restart',
        back: 'Back',
        loading: 'Loading Fonts...',
        start: 'START',
        instruction: 'INSTRUCTION',
        instructText: ' Left => Move Left \n Right => Move Right \n Enter => Fire'
    },
    'pt-BR': {
        welcome: 'Bem vindo ao Phaser Sample App criado por KaiOS!'
    }
});

export default lang(window.navigator.language);
