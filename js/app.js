/*jshint globalstrict: true*/
'use strict';

// Game Environment positions and presets
// It might be considered better practice to move these into their associated classes, but I figured it made at least some sense to have these values in one place for easier tweaking of the game environment
var lanes = [62, 144, 228]; // Possible lane choices for bugs (y coordinate)
var laneMin = -100; // Off-screen start position for bugs (x coordinate, default is -100)
var laneMax = 650; // End position for bugs before respawn (x coordinate, default is 650)
var speedBase = 50; // Base speed of bugs (default is 50)
var speedMultiplier = 200; // Scales bug speed (default is 200)
var maxEnemies = 5; // Maximum number of simultaneous bugs (default is 5)
var playerStartX = 202; // Starting position for player (x coordinate)
var playerStartY = 404; // Starting position for player (y coordinate)
var playerMoveX = 101; // X-axis movement increment for player
var playerMoveY = 83; // Y-axis movement increment for player
var xMin = 0; // Setting player boundaries
var yMin = 0;
var xMax = 404;
var yMax = 404;

// Enemies our player must avoid
var Enemy = function() {
  this.sprite = 'images/enemy-bug.png';
  this.respawn();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  this.x += this.speed * dt;
  // Checks to see if bug has exited its lane, if so a new one is generated
  if (this.x > laneMax) {
    this.respawn();
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Randomly select a lane for each bug
Enemy.prototype.chooseLane = function() {
  var index = Math.floor(Math.random() * lanes.length);
  return lanes[index];
};

// Randomly generate a speed for each bug
Enemy.prototype.chooseSpeed = function() {
  return Math.random() * speedMultiplier + speedBase;
};

// Spawn a new bug once a previous bug has exited
Enemy.prototype.respawn = function() {
  this.x = laneMin;
  this.y = this.chooseLane();
  this.speed = this.chooseSpeed();
};

// Player class
// Requires an update(), render() and a handleInput() method.
var Player = function() {
  this.sprite = 'images/char-boy.png';
  this.respawn();
};

// Update the player's position (since the player is manually controlled by user input, this is only called upon victory or defeat)
Player.prototype.update = function() {
  // Victory condition: player reaches the water
  if (this.y < yMin) {
    this.respawn(); // This is a pretty lackluster victory celebration, but minimum viable product is the goal right now
  }
  // Loss condition: player collides with bug
  var position = this; // Need a placeholder variable here, as the scope of "this" changes in the below loop
  allEnemies.forEach(function(enemy) {
    if (Math.floor(enemy.x) >= Math.floor(position.x) - 50 && Math.floor(enemy.x) <= Math.floor(position.x) + 50) {
      if (Math.floor(enemy.y) >= Math.floor(position.y) - 50 && Math.floor(enemy.y) <= Math.floor(position.y) + 50) {
        position.respawn();
      }
    }
  });
};

// Draw the player on the screen
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// User input to move player, bounded by game board
Player.prototype.handleInput = function(move) {
  if (move === 'left' && this.x > xMin) {
    this.x -= playerMoveX;
  } else if (move === 'right' && this.x < xMax) {
    this.x += playerMoveX;
  } else if (move === 'up' && this.y > yMin) {
    this.y -= playerMoveY;
  } else if (move === 'down' && this.y < yMax) {
    this.y += playerMoveY;
  }
};

// Respawn player at starting position after victory or defeat
Player.prototype.respawn = function() {
  this.x = playerStartX;
  this.y = playerStartY;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];

// This loop allows the number of enemies to be dynamic, and bounded by the maxEnemies variable
for (var i = 0; i < maxEnemies; i++) {
  allEnemies.push(new Enemy());
}

// Place the player object in a variable called player
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
