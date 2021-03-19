import Phaser from 'phaser';

import config from '../config/config';
import lang from '../locales/lang';

// Menu State
export default class extends Phaser.State {
    create() {
        // Add KaiAds between scene
        localStorage.setItem('prevScene', 'Menu');

        this.world.setBounds(0, 0, game.width, game.height);
        this.add.tileSprite(0, 0, 240, 320, 'starfield');
        
        this.renderText();
        this.bind();

        this.startButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.leftButton = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.rightButton = game.input.keyboard.addKey(Phaser.Keyboard.E);
    }

    update() {
        if (this.startButton.isDown) {
            this.state.start('Game');
        } else if (this.leftButton.isDown) {
            this.state.start('About');
        } else if (this.rightButton.isDown) {
            this.state.start('Instruction');
        }
    }
    
    //  ------------------------------------------------------------------------

    renderText() {
        const logo = this.add.sprite(game.world.centerX, 100, 'logo');
        logo.anchor.setTo(0.5);
        logo.scale.setTo(0.15);

        const button = this.add.sprite(game.world.centerX, 196, 'buttonStart');
        button.anchor.setTo(0.5);
        button.scale.setTo(0.6);

        this.add
            .text(game.world.centerX, 200, lang.text('start'), config.style.default)
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
                    text: lang.text('about')
                },
                rsk: {
                    text: lang.text('rules')
                }
            },
            action: {
                softLeft: () => {
                    this.state.start('About');
                },
                enter: () => {
                    this.state.start('Game');
                },
                softRight: () => {
                    this.state.start('Instruction');
                }
            }
        });
    }
}
