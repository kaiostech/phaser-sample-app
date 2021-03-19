import Phaser from 'phaser';

// Splash Scene
export default class extends Phaser.Scene {
    constructor() {
        super({ key: 'SplashScene' });
    }

    preload() {
        // Load your assets
        this.load.spritesheet('spinner', 'assets/images/spinner-100x100.png', {
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.image('kaios-logo', 'assets/images/kaios-logo.png');

        // Game assets
        this.load.image('player', 'assets/game/player.png');
        this.load.image('food', 'assets/game/star.png');

        // Background
        this.load.image('device_bg', 'assets/game/device_bg.png');
    }

    create() {
        this.scene.start('AdsScene');
    }
}
