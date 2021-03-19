import Phaser from 'phaser';

import config from '../config/config';
import lang from '../locales/lang';

// Instruction State
export default class extends Phaser.State {
    create() {
        this.world.setBounds(0, 0, game.width, game.height);
        this.add.tileSprite(0, 0, 240, 320, 'starfield');
        
        this.renderText();
        this.bind();

        this.leftButton = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    }

    update() {
        if (this.leftButton.isDown) {
            this.state.start('Menu');
        }
    }

    //  ------------------------------------------------------------------------

    renderText() {
        this.add
            .text(game.world.centerX, 110, lang.text('instruction'), config.style.default)
            .anchor.set(0.5);

        this.add
            .text(game.world.centerX, 160, lang.text('instructText'), config.style.default)
            .anchor.set(0.5);
    }

    /**
     *  SoftKey for KaiOS device
     */
    bind() {
        game.navigator.register({
            style: config.style.default,
            label: {
                lsk: {
                    text: lang.text('menu')
                },
                rsk: {
                    text: ''
                }
            },
            action: {
                softLeft: () => {
                    this.state.start('Menu');
                },
                enter: () => {},
                softRight: () => {}
            }
        });
    }
}
