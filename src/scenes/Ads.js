import Phaser from 'phaser';

// Ads Scene
export default class extends Phaser.Scene {
    constructor() {
        super({ key: 'AdsScene' });
    }

    create() {
        // Spinner for loading
        this.anims.create({
            key: 'loading',
            frames: this.anims.generateFrameNumbers('spinner', { frames: [...Array(50).keys()] }),
            frameRate: 50,
            repeat: -1
        });

        const spinner = this.add.sprite(this.cameras.main.centerX, 160);
        spinner.setOrigin(0.5);
        spinner.setScale(0.3);

        spinner.play('loading');

        // Loading KaiAds
        this.kaiAd();
    }

    //  ------------------------------------------------------------------------

    /**
     * Display KaiAds to the app
     *
     * @param {string} publisher - Your Publisher ID from KaiAds SDK website
     * @param {string} app - Your App Name
     * @param {string} slot - Your Slot Name
     */
    kaiAd() {
        window.getKaiAd({
            publisher: 'yourPublisherID',
            app: 'Phaser 3 Sample App',
            slot: 'yourSlotName',
            onerror: (err) => {
                console.error('Custom catch:', err);

                //* If error occurs, redirect to Menu immediately
                // if the previous scene is Menu, then load Menu after Ads scene
                if (localStorage.getItem('prevScene') === 'MenuScene' || localStorage.getItem('prevScene') === null) {
                    this.scene.start('MenuScene');

                // if the previous scene is Game, then load Game after Ads scene
                } else if (localStorage.getItem('prevScene') === 'GameScene') {
                    this.scene.start('GameScene');
                }
            },
            onready: (ad) => {
                // Ad is ready to be displayed
                // calling 'display' will display the ad
                ad.call('display');

                // For web browser only
                ad.on('click', () => {
                    if (localStorage.getItem('prevScene') === 'MenuScene' || localStorage.getItem('prevScene') === null) {
                        this.scene.start('MenuScene');
                    } else if (localStorage.getItem('prevScene') === 'GameScene') {
                        this.scene.start('GameScene');
                    }
                });
                // Redirect to Menu (KaiOS device)
                ad.on('close', () => {
                    if (localStorage.getItem('prevScene') === 'MenuScene' || localStorage.getItem('prevScene') === null) {
                        this.scene.start('MenuScene');
                    } else if (localStorage.getItem('prevScene') === 'GameScene') {
                        this.scene.start('GameScene');
                    }
                });
            }
        });
    }
}
