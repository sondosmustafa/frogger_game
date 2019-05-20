/**
 * @description define each block size
 */
var BLOCK_WIDTH = 101,
    BLOCK_HEIGHT = 83,
    NUM_ROWS = 6,
    NUM_COLS = 5,
    MIN_SPEED = Math.ceil(80),
    MAX_SPEED = Math.floor(600),
    score = 0,
    SAFE_DISTANCE = BLOCK_WIDTH/2;


/** @description Enemies our player must avoid
 * @constructor
 */
var Enemy = function (row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // randomly load bug on game start
    this.row = row;
    // randomly set the start point of an enemy
    this.x = (-BLOCK_WIDTH) - Math.floor(Math.random() * 360);


    // define speed
    this.speed = MIN_SPEED + Math.floor(Math.random() * (MAX_SPEED - MIN_SPEED));

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};


/**
 * @description : Update the enemy's position, required method for game
 * @Param: dt, a time delta between `ticks
 */
Enemy.prototype.update = function (dt) {
    // multiply any movement by the dt parameter
    if (this.x < NUM_ROWS * BLOCK_WIDTH) {
        this.x += this.speed * dt;
    } else {
        this.x = (-BLOCK_WIDTH) - Math.floor(Math.random() * 400);
        this.speed = MIN_SPEED + Math.floor(Math.random() * (MAX_SPEED - MIN_SPEED));
    }
};


/**
 * @description Draw the enemy on the screen, required method for game
 */
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, (this.row-1) * (BLOCK_HEIGHT - 13));
};


/**
 * @description define the Player class
 * @constructor
 */
var Player = function () {
    // initial position of the player on the grid
    this.col = 3;
    this.row = 5;
    this.moveDistanceX = BLOCK_WIDTH;
    this.moveDistanceY = 161 - BLOCK_HEIGHT;

    // Initial x, y coordinator of the player, (this.col-1) is to reduce the player image width.
    this.x = (this.col - 1) * this.moveDistanceX;
    this.y = (this.row - 1) * this.moveDistanceY;

    this.sprite = 'images/char-boy.png';
};


/**
 * @description define Player update function
 */
Player.prototype.update = function (key) {
    // pressed left key
    if (key === 'left' && this.col > 1) {
        this.col--;
        this.x = (this.col - 1) * this.moveDistanceX;
    } else if (key === 'up' && this.row >= 1) {
        this.row--;
        this.y = (this.row - 1) * this.moveDistanceY;
    } else if (key === 'right' && this.col < NUM_COLS) {
        this.col++;
        this.x = (this.col - 1) * this.moveDistanceX;
    } else if (key === 'down' && this.row < NUM_ROWS) {
        this.row++;
        this.y = (this.row - 1) * this.moveDistanceY;
    } else if (this.row === 1) {
        updateScore(this);
        this.reset();
    }
};


/**
 * @description reset the position of te player when win or fail
 */
Player.prototype.reset = function () {
    // reached the river and reset the position
    this.row = 5;
    this.col = 3;

    this.x = (this.col - 1) * this.moveDistanceX;
    this.y = (this.row - 1) * this.moveDistanceY;
};


/**
 * @description render Player on the canvas
 */
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/**
 * @description handle key events to the Player
 */
Player.prototype.handleInput = function (key) {
    this.update(key);
};


/**
 * @description listens for key presses and sends the keys to Player.handleInput() method.
 */
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


/**
 * @description update score display when player reach the river
 * @param player {object} the player
 */
function updateScore(player) {
    if (player.row === 1) {
        score++;
        $('.score-value').text(score);
        console.log('score:' + score);
    }
}


/**
 * @description instantiate enemies and the player
 */
var enemyA = new Enemy(2);
var enemyB = new Enemy(3);
var enemyC = new Enemy(4);
var enemyD = new Enemy(2);
var enemyE = new Enemy(4);
var allEnemies = [enemyA, enemyB, enemyC, enemyD, enemyE];
var player = new Player();


/**
 * @description check the collision event
 * @param enemies {Array} the list of enemies
 * @param player {object} the main player of the game
 */
function checkCollisions(enemies, player) {
    for (var i = 0, len = enemies.length; i < len; i++) {
        var enemyX = enemies[i].x;
        var playerX = player.x;

        if (enemies[i].row === player.row) {
            // calculate distance to judge if it is a collision event
            // when player is on the left side of the enemy
            if(Math.abs(enemyX - playerX) <= SAFE_DISTANCE){
                player.reset();
            }
        }
    }
}