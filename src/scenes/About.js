import Phaser from 'phaser';

import config from '../config/config';
import { limitText } from '../config/format';
import lang from '../locales/lang';

// About Scene
export default class extends Phaser.Scene {
    constructor() {
        super({ key: 'AboutScene' });
    }

    create() {
        this.add.tileSprite(0, 0, 240, 320, 'device_bg').setOrigin(0, 0);

        this.renderText();
        this.softKey('', '', lang.text('menu'));

        this.rightButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    update() {
        if (this.rightButton.isDown) {
            this.scene.pause();
            this.scene.start('MenuScene');
        }
    }

    //  ------------------------------------------------------------------------

    renderText() {
        this.add.text(this.cameras.main.centerX, 60, lang.text('about'), config.style.default).setOrigin(0.5);

        this.add.text(this.cameras.main.centerX, 90, lang.text('aboutText'), config.style.text).setOrigin(0.5).setScale(0.8);

        this.add.image(this.cameras.main.centerX, 130, 'kaios-logo');
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
                break;
            case 'SoftRight':
                this.scene.pause();
                this.scene.start('MenuScene');
                break;
        }
    }
}
