import Phaser from 'phaser';

import BootScene from './scenes/Boot';
import SplashScene from './scenes/Splash';
import AdsScene from './scenes/Ads';
import MenuScene from './scenes/Menu';
import InstructionScene from './scenes/Instruction';
import AboutScene from './scenes/About';
import GameScene from './scenes/Game';
import MazeScene from './scenes/Maze';

import config from './config/config';

// All scenes stores in here
const gameConfig = Object.assign(config, {
    scene: [BootScene, SplashScene, AdsScene, MenuScene, InstructionScene, AboutScene, GameScene, MazeScene]
});

// Game Scene (Main configuration of the game)
class Game extends Phaser.Game {
    constructor() {
        super(gameConfig);
    }
}

window.game = new Game();
