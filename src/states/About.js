import Phaser from 'phaser';

import config from '../config/config';
import lang from '../locales/lang';

// About State
export default class extends Phaser.State {
    create() {
        this.world.setBounds(0, 0, game.width, game.height);
        this.add.tileSprite(0, 0, 240, 320, 'starfield');
        
        this.renderText();
        this.bind();

        this.backButton = game.input.keyboard.addKey(Phaser.Keyboard.E);
    }

    update() {
        if (this.backButton.isDown) {
            this.state.start('Menu');
        }
    }

    //  ------------------------------------------------------------------------

    renderText() {
        this.add
            .text(game.world.centerX, 110, lang.text('about'), config.style.default)
            .anchor.set(0.5);

        this.add
            .text(game.world.centerX, 160, lang.text('aboutText'), config.style.wordWrap)
            .anchor.set(0.5);
            
        const logo = this.add.sprite(game.world.centerX, 200, 'kaios-logo');
        logo.anchor.setTo(0.5);
    }

    /**
     *  SoftKey for KaiOS device
     */
    bind() {
        game.navigator.register({
            style: config.style.default,
            label: {
                lsk: {
                    text: ''
                },
                rsk: {
                    text: lang.text('menu')
                }
            },
            action: {
                softLeft: () => {
                },
                enter: () => {},
                softRight: () => {
                    this.state.start('Menu');
                }
            }
        });
    }
}
