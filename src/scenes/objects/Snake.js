import Phaser from 'phaser';

import { WIDTH, HEIGHT, LENGTH } from '../../config/config';

// Snake Object
export default class Snake {
    /**
     *  Handles the logic and appearance of the snake in the maze.
     *
     *  @param {Phaser.Scene} scene - The scene that owns this object.
     *  @param {number} x - The horizontal coordinate relative to the scene viewport.
     *  @param {number} y - The vertical coordinate relative to the scene viewport.
     */
    constructor(scene, x, y) {
        this.player = scene.add.group({
            defaultKey: 'player',
            createCallback: (o) => o.setOrigin(0)
        });

        this.head = this.player.create(x * LENGTH, y * LENGTH);

        this.direction = new Phaser.Geom.Point(LENGTH, 0);
        this.headPosition = new Phaser.Geom.Point(0, 0);
        this.tailPosition = new Phaser.Geom.Point(0, 0);

        this.alive = true;
        this.updated = true;
        this.moveTime = 0;
        this.moveDelay = 100;
    }

    /**
     *  Updates the snake components in the maze.
     *
     *  @public
     *  @param {number} time - The current game clock value.
     *  @returns {boolean} Whether the snake updated or not.
     */
    update(time) {
        if (time >= this.moveTime) {
            this.updated = true;
            return this.move(time);
        }

        return false;
    }

    //  ------------------------------------------------------------------------

    /**
     *  Anti-Clockwise
     */
    turnLeft() {
        if (this.updated) {
            this.direction.setTo(this.direction.y, -this.direction.x);

            this.updated = false;
        }
    }

    /**
     *  Anti-Clockwise
     */
    turnRight() {
        if (this.updated) {
            this.direction.setTo(-this.direction.y, this.direction.x);

            this.updated = false;
        }
    }

    /**
     *  Tells whether the snake run over itself or not.
     *
     *  @private
     *  @returns {boolean} True if the snake collided with itself.
     */
    collidePlayer() {
        return Phaser.Actions.GetFirst(this.player.children.entries, { x: this.head.x, y: this.head.y }, 1);
    }

    /**
     *  Moves the snake components around the maze.
     *
     *  @private
     *  @param {number} time - The current game clock value.
     *  @returns {boolean} Whether the snake has moved or not.
     */
    move(time) {
        /*
        *   Update the snake position according to the direction the player wants it to move to.
        *   The `Math.Wrap` function call allows the snake to wrap around the screen edges,
        *   so when it goes off any side it should re-appear on the opposite side.
        */
        this.headPosition.setTo(
            Phaser.Math.Wrap(this.head.x + this.direction.x, 0, WIDTH * LENGTH),
            Phaser.Math.Wrap(this.head.y + this.direction.y, 0, HEIGHT * LENGTH)
        );

        //  Update the player components and place the last coordinate into `this.tailPosition`.
        Phaser.Actions.ShiftPosition(
            this.player.children.entries,
            this.headPosition.x,
            this.headPosition.y,
            1,
            this.tailPosition
        );

        //  Check to see if any of the player pieces have the same x/y as the head.
        //  If they do, the head ran into the player.
        if (this.collidePlayer()) {
            //  Game Over!
            this.alive = false;
            return false;
        }

        //  Update the timer ready for the next movement.
        this.moveTime = time + this.moveDelay;

        return true;
    }

    /**
     *  Adds a new component behind the snake.
     *
     *  @private
     */
    grow() {
        this.player.create(this.tailPosition.x, this.tailPosition.y);
    }

    /**
     *  Checks if the snake has collided with a piece of food.
     *
     *  @public
     *  @param {Food} food - A food sprite.
     *  @param {number} points - The player scored points.
     *  @returns {boolean} True if the snake collided, otherwise false.
     */
    collideWithFood(food, points) {
        if (this.head.x === food.x && this.head.y === food.y) {
            this.grow();

            //  For every 5 pieces of food eaten we'll increase the snake speed a
            //  little.
            if (this.moveDelay > 20 && points % 25 === 0) {
                this.moveDelay -= 5;
            }

            return true;
        }

        return false;
    }

    /**
     *  Validates the positions on the grid where a new piece of food can be
     *  placed.
     *
     *  @protected
     *  @param {boolean.<array[]>} grid - A grid of positions to validate.
     *  @returns {boolean.<array[]>} The updated grid.
     */
    updateGrid(grid) {
        //  Remove all player pieces from valid positions list.
        // eslint-disable-next-line no-unused-vars
        for (const component of this.player.getChildren()) {
            const x = component.x / LENGTH;
            const y = component.y / LENGTH;

            grid[y][x] = false;
        }

        return grid;
    }
}
