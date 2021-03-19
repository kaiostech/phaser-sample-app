import 'pixi';
import 'p2';
import Phaser from 'phaser';

import AdsState from './states/Ads';
import BootState from './states/Boot';
import SplashState from './states/Splash';
import MenuState from './states/Menu';
import InstructionState from './states/Instruction';
import AboutState from './states/About';
import GameState from './states/Game';

import config from './config/config';

// Game Scene (Main configuration of the game)
class Game extends Phaser.Game {
    constructor() {
        const docElement = document.documentElement;
        const width =
            docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth;
        const height =
            docElement.clientHeight > config.gameHeight
                ? config.gameHeight
                : docElement.clientHeight;

        super(width, height, Phaser.CANVAS, 'content', null);

        // All scenes stores in here
        this.state.add('Ads', AdsState, false);
        this.state.add('Boot', BootState, false);
        this.state.add('Splash', SplashState, false);
        this.state.add('Menu', MenuState, false);
        this.state.add('Instruction', InstructionState, false);
        this.state.add('About', AboutState, false);
        this.state.add('Game', GameState, false);

        this.state.start('Boot');
    }
}

// Start rendering the game
window.game = new Game();

//* Service worker (Please config yourself)
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker
//             .register('/service-worker.js')
//             .then((registration) => {
//                 console.log('SW registered: ', registration);
//             })
//             .catch((registrationError) => {
//                 console.log('SW registration failed: ', registrationError);
//             });
//     });
// }
