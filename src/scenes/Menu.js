import Phaser from 'phaser';

import config from '../config/config';
import { limitText } from '../config/format';
import lang from '../locales/lang';

// Menu Scene
export default class extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        // For ads configuration
        localStorage.setItem('prevScene', 'MenuScene');
    }
    
    create() {
        this.add.tileSprite(0, 0, 240, 320, 'device_bg').setOrigin(0, 0);

        this.renderText();
        this.softKey(lang.text('about'), '', lang.text('rules'));

        this.startButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.leftButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.rightButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    update() {
        if (this.startButton.isDown) {
            this.scene.start('GameScene');
        } else if (this.leftButton.isDown) {
            this.scene.start('AboutScene');
        } else if (this.rightButton.isDown) {
            this.scene.start('InstructionScene');
        }
    }

    //  ------------------------------------------------------------------------

    renderText() {
        const logoText = this.add.text(this.cameras.main.centerX, 80, lang.text('title'), config.style.logoText);
        logoText.setOrigin(0.5);

        const startButton = this.add.text(this.cameras.main.centerX, 140, lang.text('start'), config.style.start);
        startButton.setOrigin(0.5);

        // Start button animation
        this.add.tween({
            targets: [startButton],
            ease: (k) => (k < 0.5 ? 0 : 1),
            duration: 250,
            yoyo: true,
            repeat: -1,
            alpha: 0
        });
    }

    // SoftKey for KaiOS device
    softKey(left, center, right) {
        // listen Events
        this.input.keyboard.on(
            'keydown',
            (e) => {
                this.actionsSoftKey(e);
            },
            this
        );
        
        const leftText = this.add
            .text(38, this.sys.canvas.height - 20, limitText(left).toUpperCase(), config.style.default);
        leftText.setOrigin(1, 0);

        const rightText = this.add.text(
            this.sys.canvas.width - 5,
            this.sys.canvas.height - 20,
            limitText(right).toUpperCase(),
            config.style.default
        );
        rightText.setOrigin(1, 0);
    }

    actionsSoftKey(e) {
        switch (e.key) {
            case 'SoftLeft':
                this.scene.pause();
                this.scene.start('AboutScene');
                break;
            case 'Enter':
                this.scene.start('GameScene');
                break;
            case 'SoftRight':
                this.scene.pause();
                this.scene.start('InstructionScene');
                break;
        }
    }
}
