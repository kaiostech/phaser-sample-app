import Phaser from 'phaser';

// Splash State
export default class extends Phaser.State {
    preload() {
        // Load your assets
        this.load.spritesheet('spinner', 'assets/images/spinner-100x100.png', 100, 100, 50);
        this.load.image('kaios-logo', 'assets/images/kaios-logo.png');
        
        // Game assets
        this.load.image('logo', 'assets/game/logo.png');
        this.load.image('buttonStart', 'assets/game/buttonStart.png');
        this.load.image('bullet', 'assets/game/bullet.png');
        this.load.image('enemyBullet', 'assets/game/enemy-bullet.png');
        this.load.spritesheet('ufo', 'assets/game/ufo32x32x4.png', 32, 32);
        this.load.image('ship', 'assets/game/spaceship.png');
        this.load.spritesheet('kaboom', 'assets/game/explode.png', 64, 64);
        this.load.image('starfield', 'assets/game/space_bg.png');
    }

    create() {
        this.state.start('Ads');
    }
}
