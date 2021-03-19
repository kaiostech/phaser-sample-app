import Phaser from 'phaser';

// Ads State
export default class extends Phaser.State {
    create() {
        // Spinner for loading
        const spinner = this.add.sprite(game.world.centerX, 160, 'spinner');
        spinner.animations.add('loading');
        spinner.animations.play('loading', 50, true);

        spinner.scale.set(0.3);
        spinner.anchor.set(0.5);

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
            app: 'Phaser 2 Sample App',
            slot: 'yourSlotName',
            onerror: (err) => {
                console.error('Custom catch:', err);

                //* If error occurs, redirect to Menu immediately
                // if the previous scene is Menu, then load Menu after Ads scene
                if (localStorage.getItem('prevScene') === 'Menu' || localStorage.getItem('prevScene') === null) {
                    this.state.start('Menu');

                // if the previous scene is Game, then load Game after Ads scene
                } else if (localStorage.getItem('prevScene') === 'Game') {
                    this.state.start('Game');
                }
            },
            onready: (ad) => {
                // Ad is ready to be displayed, calling 'display' will display the ad
                ad.call('display');

                // For web browser only
                ad.on('click', () => {
                    if (localStorage.getItem('prevScene') === 'Menu' || localStorage.getItem('prevScene') === null) {
                        this.state.start('Menu');
                    } else if (localStorage.getItem('prevScene') === 'Game') {
                        this.state.start('Game');
                    }
                });

                // Redirect to Menu (KaiOS device)
                ad.on('close', () => {
                    if (localStorage.getItem('prevScene') === 'Menu' || localStorage.getItem('prevScene') === null) {
                        this.state.start('Menu');
                    } else if (localStorage.getItem('prevScene') === 'Game') {
                        this.state.start('Game');
                    }
                });
            }
        });
    }
}
