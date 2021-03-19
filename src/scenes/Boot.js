import Phaser from 'phaser';
import WebFont from 'webfontloader';

import config from '../config/config';
import lang from '../locales/lang';

// Boot Scene
export default class extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Remove the previous scene state
        localStorage.removeItem('prevScene');

        // Preload font
        this.fontsReady = false;
        this.fontsLoaded = this.fontsLoaded.bind(this);

        if (config.webFonts.length) {
            WebFont.load({
                google: {
                    families: config.webFonts
                },
                timeout: 2000,
                active: this.fontsLoaded
            });
        }

        // Loading text
        const text = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            lang.text('loading'),
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                fill: '#dddddd',
                align: 'center'
            }
        );
        text.setOrigin(0.5, 0.5);
    }

    update() {
        // If font is ready, go to next scene
        if (config.webFonts.length && this.fontsReady) {
            this.scene.start('SplashScene');
        }
        if (!config.webFonts.length) {
            this.scene.start('SplashScene');
        }
    }

    fontsLoaded() {
        this.fontsReady = true;
    }
}
