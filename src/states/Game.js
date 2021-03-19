import Phaser from 'phaser';

import config from '../config/config';
import lang from '../locales/lang';

// Game State
export default class extends Phaser.State {
    init() {
        this.player;
        this.aliens;
        this.bullets;
        this.bulletTime = 0;
        this.cursors;
        this.fireButtonEnter;
        this.fireButtonFive;
        this.explosions;
        this.starfield;
        this.score = 0;
        this.scoreString = '';
        this.scoreText;
        this.lives;
        this.enemyBullet;
        this.firingTimer = 0;
        this.stateText;
        this.livingEnemies = [];
        this.gameOver = false;
        this.enemyBulletTime = 120;
    }

    create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, game.width, game.height);

        // The scrolling starfield background
        this.starfield = game.add.tileSprite(0, 0, 240, 320, 'starfield');

        // Our bullet group
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 1);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);

        // The enemy's bullets
        this.enemyBullets = game.add.group();
        this.enemyBullets.enableBody = true;
        this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemyBullets.createMultiple(30, 'enemyBullet');
        this.enemyBullets.setAll('anchor.x', 0.5);
        this.enemyBullets.setAll('anchor.y', 1);
        this.enemyBullets.setAll('outOfBoundsKill', true);
        this.enemyBullets.setAll('checkWorldBounds', true);

        // The hero!
        this.player = game.add.sprite(125, 285, 'ship');
        this.player.scale.setTo(0.5, 0.5);
        this.player.anchor.setTo(0.5, 0.5);
        game.physics.enable(this.player, Phaser.Physics.ARCADE);

        // The baddies!
        this.aliens = game.add.group();
        this.aliens.enableBody = true;
        this.aliens.physicsBodyType = Phaser.Physics.ARCADE;

        this.createAliens();

        // The score
        this.scoreString = lang.text('score');
        this.scoreText = game.add.text(10, 10, this.scoreString + this.score, config.style.default);

        // Lives
        this.lives = game.add.group();
        game.add.text(game.world.width - 100, 10, lang.text('lives'), config.style.default);

        // Text
        this.stateText = game.add.text(game.world.centerX, game.world.centerY, ' ', config.style.center);
        this.stateText.anchor.setTo(0.5, 0.5);
        this.stateText.visible = false;

        for (let i = 0; i < 3; i++) {
            const ship = this.lives.create(game.world.width - 25, 21, 'ship');
            ship.anchor.setTo(0.5, 0.5);
            ship.scale.setTo(0.6, 0.6);
            ship.angle = 90;
            ship.alpha = 0.4;
        }

        // An explosion pool
        this.explosions = game.add.group();
        this.explosions.scale.setTo(1.05, 1.05);
        this.explosions.createMultiple(30, 'kaboom');
        this.explosions.forEach(this.setupEnemy, this);

        // And some controls to play the game with
        this.cursors = game.input.keyboard.createCursorKeys();

        // For Web Control
        this.fireButtonEnter = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.fireButtonFive = game.input.keyboard.addKey(Phaser.Keyboard.FIVE);

        this.key_4 = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
        this.key_6 = game.input.keyboard.addKey(Phaser.Keyboard.SIX);

        this.restartButton = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.backButton = game.input.keyboard.addKey(Phaser.Keyboard.E);

        // Softkey navigator
        this.bind();
    }

    update() {
        if (this.restartButton.isDown) {
            localStorage.setItem('prevScene', 'Game');

            this.state.start('Ads');
        } else if (this.backButton.isDown) {
            this.state.start('Menu');
        }

        // Scroll the background
        this.starfield.tilePosition.y += 2;

        if (this.player.alive) {
            const player = this.player;
            if (player.body.x < 5) {
                player.body.x = 5;
            }
            if (player.body.x > 220) {
                player.body.x = 220;
            }
            this.gameOver = false;

            // Reset the player, then check for movement keys
            this.player.body.velocity.setTo(0, 0);

            if (this.cursors.left.isDown || this.key_4.isDown) {
                this.player.body.velocity.x = -200;
            } else if (this.cursors.right.isDown || this.key_6.isDown) {
                this.player.body.velocity.x = 200;
            }

            // Firing?
            if (this.fireButtonEnter.isDown || this.fireButtonFive.isDown) {
                this.fireBullet();
            }

            if (game.time.now > this.firingTimer) {
                this.enemyFires();
            }

            if (this.aliens.countLiving() === 0) {
                if (this.fireButtonFive.isDown) {
                    this.nextLevel();
                }
            }

            // Run collision
            game.physics.arcade.overlap(
                this.bullets,
                this.aliens,
                this.collisionHandler,
                null,
                this
            );
            game.physics.arcade.overlap(
                this.enemyBullets,
                this.player,
                this.enemyHitsPlayer,
                null,
                this
            );
        }
    }

    render() {
        //* Debug Area
        // if (__DEV__) {
        //    this.game.debug.spriteInfo(this.player, 32, 32);
        //
        //    for (let i = 0; i < this.aliens.length; i++)
        //    {
        //        game.debug.body(this.aliens.children[i]);
        //    }
        // }
    }

    //  ------------------------------------------------------------------------

    /**
     * Create aliens (enemies)
     *
     * @private
     */
    createAliens() {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 8; x++) {
                const alien = this.aliens.create(x * 25, y * 30, 'ufo');
                alien.anchor.setTo(0.5, 0.5);
                alien.scale.setTo(0.5, 0.5);
                alien.animations.add('fly', [0, 1, 2, 3], 20, true);
                alien.play('fly');
                alien.body.moves = false;
            }
        }

        this.aliens.x = 20;
        this.aliens.y = 50;

        // All this does is basically start the enemy moving. Notice we're moving the Group they belong to, rather than the enemy directly.
        const tween = game.add
            .tween(this.aliens)
            .to({ x: 50 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

        // When the tween loops it calls descend
        tween.onLoop.add(this.descend, this);
    }

    /**
     * Setup aliens (enemies)
     *
     * @private
     * @param enemy - Setup the aliens config
     */
    setupEnemy(enemy) {
        enemy.anchor.x = 0.5;
        enemy.anchor.y = 0.5;
        enemy.animations.add('kaboom');
    }

    /**
     * Descend aliens (enemies)
     *
     * @private
     */
    descend() {
        this.aliens.y += 10;
    }

    /**
     * Handle the collision
     *
     * @private
     * @param bullet - When a bullet hits an alien, we kill the bullet
     * @param alien - When a bullet hits an alien, we kill the alien
     */
    collisionHandler(bullet, alien) {
        bullet.kill();
        alien.kill();

        // Increase the score
        this.score += 20;
        this.scoreText.text = this.scoreString + this.score;

        // And create an explosion
        const explosion = this.explosions.getFirstExists(false);
        explosion.reset(alien.body.x, alien.body.y);
        explosion.play('kaboom', 30, false, true);

        if (this.aliens.countLiving() === 0) {
            this.gameOver = false;
            this.score += 1000;
            this.scoreText.text = this.scoreString + this.score;

            this.enemyBullets.callAll('kill', this);
            this.stateText.text = lang.text('win');
            this.stateText.visible = true;

            // "Click to restart" Handler
            game.input.onTap.addOnce(this.nextLevel, this);
        }
    }

    /**
     * Handle the collision
     *
     * @private
     * @param player - A copy of player
     * @param bullet - When a enemy bullet hits the player, we kill the bullet
     */
    enemyHitsPlayer(player, bullet) {
        bullet.kill();

        this.live = this.lives.getFirstAlive();

        if (this.live) {
            this.live.kill();
        }

        // And create an explosion :)
        const explosion = this.explosions.getFirstExists(false);
        explosion.reset(this.player.body.x, this.player.body.y);
        explosion.play('kaboom', 30, false, true);

        // When the player dies
        if (this.lives.countLiving() < 1) {
            this.gameOver = true;
            this.player.kill();
            this.enemyBullets.callAll('kill');

            this.stateText.text = lang.text('gameOver');
            this.stateText.visible = true;

            // "Click to restart" handler
            game.input.onTap.addOnce(this.restartGame, this);
        }
    }

    /**
     * Enemy fires bullet
     *
     * @private
     */
    enemyFires() {
        // Grab the first bullet we can from the pool
        this.enemyBullet = this.enemyBullets.getFirstExists(false);

        this.livingEnemies.length = 0;

        this.aliens.forEachAlive((alien) => {
            // Put every living enemy in an array
            this.livingEnemies.push(alien);
        });

        if (this.enemyBullet && this.livingEnemies.length > 0) {
            const random = game.rnd.integerInRange(0, this.livingEnemies.length - 1);

            // Randomly select one of them
            const shooter = this.livingEnemies[random];
            // And fire the bullet from this enemy
            this.enemyBullet.reset(shooter.body.x, shooter.body.y);

            game.physics.arcade.moveToObject(this.enemyBullet, this.player, this.enemyBulletTime);
            this.firingTimer = game.time.now + 2000;

            if (this.score >= 1640) {
                game.physics.arcade.moveToObject(
                    this.enemyBullet,
                    this.player,
                    this.enemyBulletTime + 20
                );
            }
        }
    }

    /**
     * Player fires bullet
     *
     * @private
     */
    fireBullet() {
        if (this.gameOver === false) {
            // To avoid them being allowed to fire too fast we set a time limit
            if (game.time.now > this.bulletTime) {
                // Grab the first bullet we can from the pool
                this.bullet = this.bullets.getFirstExists(false);

                if (this.bullet) {
                    // And fire it
                    this.bullet.reset(this.player.x, this.player.y + 8);
                    this.bullet.body.velocity.y = -400;
                    this.bulletTime = game.time.now + 200;
                }
            }
        }
    }

    /**
     * Reset enemy bullet
     *
     * @param bullet - Kill the bullet
     */
    resetBullet(bullet) {
        // Called if the bullet goes out of the screen
        bullet.kill();
    }

    /**
     * Restart game after player dies
     */
    restartGame() {
        this.gameOver = true;

        // Resets the scores and life counts
        this.score = 0;
        this.scoreText.setText(this.scoreString + this.score);

        this.lives.callAll('revive');

        // And brings the aliens back from the dead :)
        this.aliens.removeAll();
        this.createAliens();

        // Remove bullets
        this.bullet.kill();
        this.enemyBullets.callAll('kill');

        // Revives the player
        this.player.revive();

        // Hides the text
        this.stateText.visible = false;
    }

    /**
     * A new level starts. Otherwise, keep continuing until the player dies
     */
    nextLevel() {
        if (this.gameOver === false) {
            //* Otherwise, keep continuing until the player dies
            // And brings the aliens back from the dead :)
            this.aliens.removeAll();
            this.createAliens();

            // Remove bullets
            this.bullet.kill();
            this.enemyBullets.callAll('kill');

            // Revives the player
            this.player.revive();

            // Hides the text
            this.stateText.visible = false;
        }
    }
    
    /**
     *  SoftKey for KaiOS device
     */
    bind() {
        // Game Controller for KaiOS device
        game.navigator.register({
            style: config.style.default,
            label: {
                lsk: {
                    text: lang.text('restart')
                },
                rsk: {
                    text: lang.text('back')
                }
            },
            action: {
                softLeft: () => {
                    // Add KaiAds between scene
                    localStorage.setItem('prevScene', 'Game');

                    this.state.start('Ads');
                },
                enter: () => {
                    this.fireBullet();
                },
                softRight: () => {
                    this.state.start('Menu');
                }
            }
        });
    }
}
