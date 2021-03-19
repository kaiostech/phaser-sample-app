import Phaser from 'phaser';

import config from '../config/config';
import { limitText } from '../config/format';
import lang from '../locales/lang';

// Instruction Scene
export default class extends Phaser.Scene {
    constructor() {
        super({ key: 'InstructionScene' });
    }

    create() {
        this.add.tileSprite(0, 0, 240, 320, 'device_bg').setOrigin(0, 0);

        this.renderText();
        this.softKey(lang.text('menu'), '', '');

        this.leftButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    }

    update() {
        if (this.leftButton.isDown) {
            this.scene.pause();
            this.scene.start('MenuScene');
        }
    }

    //  ------------------------------------------------------------------------

    renderText() {
        this.add.text(this.cameras.main.centerX, 60, lang.text('instruction'), config.style.default).setOrigin(0.5);

        this.add.text(this.cameras.main.centerX, 110, lang.text('instructionText'), config.style.text).setOrigin(0.5);
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

        // Text
        const leftText = this.add
            .text(30, this.sys.canvas.height - 20, limitText(left).toUpperCase(), config.style.default);
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
                this.scene.start('MenuScene');
                break;
            case 'SoftRight':
                break;
        }
    }
}
