//http://dev.opera.com/articles/view/creating-pseudo-3d-games-with-html-5-can-1/

var mapWidth = 0;  // number of map blocks in x-direction
var mapHeight = 0;  // number of map blocks in y-direction
var miniMapScale = 8;  // how many pixels to draw a map block

function init() {
  mapWidth = map[0].length;
  mapHeight = map.length;

  bindKeys();
  drawMiniMap();
}

function drawMiniMap() {
  // draw the topdown view minimap
  var miniMap = $("minimap");
  miniMap.width = mapWidth * miniMapScale;  // resize the internal canvas dimensions 
  miniMap.height = mapHeight * miniMapScale;
  miniMap.style.width = (mapWidth * miniMapScale) + "px";  // resize the canvas CSS dimensions
  miniMap.style.height = (mapHeight * miniMapScale) + "px";

  // loop through all blocks on the map
  var ctx = miniMap.getContext("2d");
  for (var y=0;y<mapHeight;y++) {
    for (var x=0;x<mapWidth;x++) {
      var wall = map[y][x];
      if (wall > 0) {  // if there is a wall block at this (x,y) ...
        ctx.fillStyle = "rgb(200,200,200)";
        ctx.fillRect(  // ... then draw a block on the minimap
          x * miniMapScale,
          y * miniMapScale,
          miniMapScale,miniMapScale
        );
      }
    }
  }
}

function gameCycle() {
  move();
  updateMiniMap();
  setTimeout(gameCycle,1000/30); // aim for 30 FPS
}

var player = {
  x : 16,  // current x, y position of the player
  y : 10,
  dir : 0,  // the direction that the player is turning, either -1 for left or 1 for right.
  rot : 0,  // the current angle of rotation
  speed : 0,  // is the playing moving forward (speed = 1) or backwards (speed = -1).
  moveSpeed : 0.18,  // how far (in map units) does the player move each step/update
  rotSpeed : 6 * Math.PI / 180  // how much does the player rotate each step/update (in radians)
}

function move() {
  var moveStep = player.speed * player.moveSpeed;	// player will move this far along the current direction vector

  player.rot += player.dir * player.rotSpeed; // add rotation if player is rotating (player.dir != 0)

  var newX = player.x + Math.cos(player.rot) * moveStep;	// calculate new player position with simple trigonometry
  var newY = player.y + Math.sin(player.rot) * moveStep;

  player.x = newX; // set new position
  player.y = newY;
}

// bind keyboard events to game functions (movement, etc)
function bindKeys() {
  document.onkeydown = function(e) {
    e = e || window.event;
    switch (e.keyCode) { // which key was pressed?
      case 38: // up, move player forward, ie. increase speed
        player.speed = 1; break;
      case 40: // down, move player backward, set negative speed
        player.speed = -1; break;
      case 37: // left, rotate player left
        player.dir = -1; break;
      case 39: // right, rotate player right
        player.dir = 1; break;
    }
  }
  // stop the player movement/rotation when the keys are released
  document.onkeyup = function(e) {
    e = e || window.event;
    switch (e.keyCode) {
      case 38:
      case 40:
        player.speed = 0; break; 
      case 37:
      case 39:
        player.dir = 0; break;
    }
  }
}

function move() {
  if (isBlocking(newX, newY)) {	// are we allowed to move to the new position?
    return; // no, bail out.
  }
}

function isBlocking(x,y) {
  // first make sure that we cannot move outside the boundaries of the level
  if (y < 0 || y >= mapHeight || x < 0 || x >= mapWidth)
    return true;
  // return true if the map block is not 0, ie. if there is a blocking wall.
  return (map[Math.floor(y)][Math.floor(x)] != 0); 
}
