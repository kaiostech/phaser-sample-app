import Phaser from 'phaser';

import config from '../config/config';
import { limitText } from '../config/format';
import lang from '../locales/lang';

export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        // Highest score
        this.setHighScore();
        this.highScore = localStorage.getItem('highScore_snakeSampleApp');
    }

    init() {
        // Initial game score.
        this.scores = 0;
    }

    create() {
        //  Get a reference of the scenes to start.
        const maze = this.scene.get('MazeScene');

        //  Run scene
        this.scene.launch(maze);

        //  Add the game objects to the maze scene.
        this.food = maze.addFood(3, 4);
        this.snake = maze.addSnake(8, 8);

        // Background color
        this.cameras.main.setBackgroundColor('#1E317D');

        // Score Board
        this.scoreBoard = this.add.text(5, 5, lang.text('score'), config.style.text);

        this.highScoreBoard = this.add.text(
            this.cameras.main.centerX + 25,
            5,
            lang.text('highScore'),
            config.style.text
        );
        this.highScoreBoard.setText(lang.text('highScore') + this.highScore);

        // Game Over Text
        this.gamOverText = this.add.text(75, 30, lang.text('gameOver'), config.style.textL).setVisible(false);

        //  Create our keyboard controls.
        this.cursors = this.input.keyboard.addKeys({
            leftKey: Phaser.Input.Keyboard.KeyCodes.LEFT,
            rightKey: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            upKey: Phaser.Input.Keyboard.KeyCodes.UP,
            downKey: Phaser.Input.Keyboard.KeyCodes.DOWN
        });

        // SoftKey Navigator for KaiOS device
        this.softKey(lang.text('restart'), '', lang.text('back'));

        this.restartButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.backButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    update(time) {
        if (this.restartButton.isDown) {
            // Add Ads between Scene
            localStorage.setItem('prevScene', 'GameScene');

            this.scene.stop('MazeScene').start('AdsScene');
        } else if (this.backButton.isDown) {
            this.scene.pause();
            this.scene.stop('MazeScene').start('MenuScene');
        }

        if (this.snake.alive) {
            this.updateInput();
            this.updateLogic(time);
            this.scoreBoard.setText(lang.text('score') + this.scores);
        }
    }

    //  ------------------------------------------------------------------------

    /**
     * Setup high score.
     *
     * @private
     */
    setHighScore() {
        if (localStorage.getItem('highScore_snakeSampleApp') === null) {
            localStorage.setItem('highScore_snakeSampleApp', 0);
        }
    }

    /**
     * Update the direction with input.
     *
     * @private
     */
    updateInput() {
        const { leftKey, rightKey } = this.cursors;

        //  Check which key was just pressed down, then change the direction the
        //  snake is heading.
        if (Phaser.Input.Keyboard.JustDown(leftKey)) {
            this.snake.turnLeft();
        } else if (Phaser.Input.Keyboard.JustDown(rightKey)) {
            this.snake.turnRight();
        }
    }

    /**
     * Update the collision of food and snake and reposition the food.
     *
     * @private
     * @param {number} time - Current time
     */
    updateLogic(time) {
        const { food, snake } = this;

        if (snake.update(time)) {
            //  If the snake updated, we need to check for collision against food.
            if (snake.collideWithFood(food, this.scores)) {
                this.updateScores();
                food.reposition(snake);
            }
        }

        if (!snake.alive) {
            this.gameOver();
        }
    }

    /**
     * Game over after collide with the same box.
     *
     * @private
     */
    gameOver() {
        this.events.emit('snake-died');

        //  Update the high score.
        this.highScore = Math.max(this.scores, localStorage.getItem('highScore_snakeSampleApp'));
        localStorage.setItem('highScore_snakeSampleApp', this.highScore);

        this.gamOverText.setVisible(true);

        //  Wait for a moment and go back to the menu screen.
        this.time.delayedCall(2500, () => {
            this.scene.stop('MazeScene').start('GameScene');
        });
    }

    /**
     * Update score.
     *
     * @private
     */
    updateScores() {
        this.scores += 5;
        this.events.emit('food-eaten', this.scores);
    }

    /**
     * SoftKey Text Configuration
     *
     * @private
     * @param {string} left - Left label
     * @param {string} center - Center label
     * @param {string} right - Right label
     */
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
        this.btLeft = this.add.text(
            5,
            this.sys.canvas.height - 20,
            limitText(left).toUpperCase(),
            config.style.default
        );
        this.btRight = this.add
            .text(
                this.sys.canvas.width - 5,
                this.sys.canvas.height - 20,
                limitText(right).toUpperCase(),
                config.style.default
            )
            .setOrigin(1, 0);
    }

    /**
     * SoftKey Event Configuration
     *
     * @private
     * @param event - Event Handler
     */
    actionsSoftKey(e) {
        switch (e.key) {
            case 'Enter':
                break;
            case 'SoftLeft':
                // Add Ads between Scene
                localStorage.setItem('prevScene', 'GameScene');

                this.scene.stop('MazeScene').start('AdsScene');
                break;
            case 'SoftRight':
                this.scene.pause();
                this.scene.stop('MazeScene').start('MenuScene');
                break;
        }
    }
}
