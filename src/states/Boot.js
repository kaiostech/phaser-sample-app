import Phaser from 'phaser';
import WebFont from 'webfontloader';

import '../config/plugin/navigator';
import config from '../config/config';
import lang from '../locales/lang';

// Boot State
export default class extends Phaser.State {
    init() {
        // Remove the previous scene state
        localStorage.removeItem('prevScene');
        
        this.stage.backgroundColor = '#000';

        // Preload font
        this.fontsReady = false;
        this.fontsLoaded = this.fontsLoaded.bind(this);
        
        // Enable Phaser Navigator for KaiOS
        game.navigator = game.plugins.add(Phaser.Plugin.Navigator);
    }

    preload() {
        if (config.webFonts.length) {
            WebFont.load({
                google: {
                    families: config.webFonts
                },
                active: this.fontsLoaded
            });
        }

        // Loading text
        const text = this.add.text(this.world.centerX, this.world.centerY, lang.text('loading'), config.style.center);
        text.anchor.setTo(0.5, 0.5);
    }

    render() {
        // If font is ready, go to next scene
        if (config.webFonts.length && this.fontsReady) {
            this.state.start('Splash');
        }
        if (!config.webFonts.length) {
            this.state.start('Splash');
        }
    }

    fontsLoaded() {
        this.fontsReady = true;
    }
}
