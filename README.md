# Frogger
A classic arcade game in JavaScript and HTML Canvas coded by Millie Lin. The code is based on art assets and game engine from Udacity Front-End Web Developer Nano degree project material.  

## How to play the game
- Use arrow keys 'up', 'right', 'down' and 'left' to move the boy on the grass and try to help him gets to the river without colliding with the bugs on the rock road. 
- If the boy collides with the bugs, he has to go back to the grass and you need to restar
- If you successfully move the boy with no collisions, you score will +1.
- If you want to reset the game, please refresh the page

## How I make the game runs

The game assets has include a file `engine.js` which defined the canvas and the canvas rendering function for all resources. What I need to do is to define following Objects in JavaScript.

1. Enemy Object
2. Player Object
3. collision function

Since the background of the canvas has been rendered in grid with a set of images. So that it would be easier to define the move event and check collision in *row* and *column*. 

So that for both objects Enemy and Player, I use row and the character image size to assign coordinator value to each object. 

 
### Enemy Object
A vehicle/bug is always moving on its own row from left to right. So that I define the function `update()` for enemy by keep it moving. 

To give different enemies different moving speed each time each shows on the canvas, I use `Math.random()` function to make the speed randomly changes within a range:

```$javascript
    this.speed = minSpeed + Math.floor(Math.random() * (maxSpeed - minSpeed));

```     

The `update()` function always check if enemy has run off the canvas and need to reset the position and get a new speed:

```$javascript

/**
 * @description : Update the enemy's position, required method for game
 * @Param: dt, a time delta between `ticks
 */
Enemy.prototype.update = function (dt) {
    // multiply any movement by the dt parameter
    if (this.x < numRows * blockWidth) {
        this.x += this.speed * dt;
    } else {
        this.x = (-blockWidth) - Math.floor(Math.random() * 400);
        this.speed = minSpeed + Math.floor(Math.random() * (maxSpeed - minSpeed));
    }
};
```

I created 5 enemies with the Enemy Object and use the parameter to define the row a bug should be. This can used to change the difficulty of the game. 

```$javascript
/**
 * @description instantiate enemies and the player
 */
var enemyA = new Enemy(2);
var enemyB = new Enemy(3);
var enemyC = new Enemy(4);
var enemyD = new Enemy(2);
var enemyE = new Enemy(4);
var allEnemies = [enemyA, enemyB, enemyC, enemyD, enemyE];

``` 

### Player Object
Player need to be allow to move on both x axis and y axis, and the move always happend when an arrow key pressed function happen. 

So that I pass the key code to the player update() function to make it work:
```$javascript
Player.prototype.handleInput = function (key) {
    this.update(key);
};

``` 

When a player reaches the river or collides with a bug, the players location needs to be reset:
```$javascript
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

```

I also add an updateScore function which will update the score value on the page each time player gets to the river:

```$javascript
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
```
### Check Collisions
I use for loop to iterate each enemy's x coordinate value. 

When enemy and player on the same row, the collision would be able to happen. With `Math.abs()`, the program can get the distance between enemy and player and compare to a predefined `safeDistance` value to check the collision. 

The default `safeDistance` was set to 1/2 width of an resource image so that the collision looks more nature in visual.   

```$javascript

/**
 * @description check the collision event
 * @param enemies {Array} the list of enemies
 * @param player {object} the main player of the game
 */
function checkCollisions(enemies, player) {
    for (var i = 0; i < enemies.length; i++) {
        var enemyX = enemies[i].x;
        var playerX = player.x;

        if (enemies[i].row === player.row) {
            // calculate distance to judge if it is a collision event
            // when player is on the left side of the enemy
            if(Math.abs(enemyX - playerX) <= safeDistance){
                player.reset();
            }
        }
    }
}

```

To detect collisions events, it has to happen each time the canvas get update, so that I call this function in the `update()` function in `engine.js`. 

