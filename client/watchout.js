//-------- Initiate objects for the game --------

// Define game settings
var gameOptions = {
  height: window.innerHeight,
  width: window.innerWidth,
  nEnemies: 30,
  padding: 20
};

var gameStats = {
  collisionCount: 0,
  highestScoreCount: 0,
  currentScoreCount: 0
};

// create svg canvas
var gameBoard = d3.select('.board .mouse').append('svg').attr('height', gameOptions.height).attr('width', gameOptions.width);


//---------- Set up helper functions -------------
var makeHelperFunc = function() {
  var obj = {};
  obj.minX = gameOptions.padding;
  obj.maxX = gameOptions.width - gameOptions.padding;
  obj.minY = gameOptions.padding;
  obj.maxY = gameOptions.height - gameOptions.padding;

  obj.moveOnScreen = function(currentX, currentY) {
    if (currentX < obj.minX) { currentX = obj.minX; }
    if (currentY < obj.minY) { currentY = obj.minY; }
    if (currentX > obj.maxY) { currentX = obj.maxX; }
    if (currentY > obj.maxY) { currentY = obj.maxY; }
    return {x: currentX, y: currentY};
  };
  return obj;
};
var helper = makeHelperFunc();

//--------------- Set Up Enemies ---------------------------
// create enemies. all enemies have .enemy class
var makeEnemyData = function () {
  return d3.range(gameOptions.nEnemies).map(function(d, i) {
    return {
      id: i,
      x: Math.random() * gameOptions.width,
      y: Math.random() * gameOptions.height,
      height: 50,
      width: 50
    };
  });
};
var enemyData = makeEnemyData();

//bind the enemy data to selection, update enemy id on update
var enemySel = gameBoard.selectAll('.enemy').data(enemyData, function(d, i) { return d.id; });
//enter the selections to be rendered
var enteredEnemySel = enemySel.enter().append('image').attr('class', 'enemy').attr('x', function(d, i) { return d.x; }).attr('y', function(d, i) { return d.y; }).attr('height', d=>d.height).attr('width', d=>d.width).attr('xlink:href', 'asteroid.png');


//-------------- Set Up Player --------------------------
//create a differently-coloured player and make it draggable
//each circle's datum has [x,y] properties, which updates when dragged
var playerData = [{
  x: gameOptions.width / 2,
  y: gameOptions.height / 2,
  r: 15
}];


playerData._move = function(d) {
  var position = helper.moveOnScreen(d3.event.x, d3.event.y);
  d3.select(this).attr('cx', position.x).attr('cy', position.y);
};

var drag = d3.behavior.drag().on('drag', playerData._move);
var playerSel = gameBoard.selectAll('.player').data(playerData);
var enteredPlayerSel = playerSel.enter().append('circle').attr('class', 'player').attr('cx', d=>d.x).attr('cy', d=>d.y)
.attr('r', d=>d.r).attr('fill', 'yellow').call(drag);


//----------------- Functions to check collisions -------------------
// will be called inside enemy, access playerSelection via 'this'
var checkCollision = function(enemy, collidedCallback) {
  var player = enteredPlayerSel[0];
  // var enemy = enteredEnemySel;
  var halfEnemyWidth = parseFloat(enteredEnemySel.attr('width')) / 2;
  var halfEnemyHeight = parseFloat(enteredEnemySel.attr('height')) / 2;
  var xDiffSum = parseFloat(enteredPlayerSel.attr('r')) + halfEnemyWidth;
  var yDiffSum = parseFloat(enteredPlayerSel.attr('r')) + halfEnemyHeight;
  var currentXDiff = parseFloat(enteredPlayerSel.attr('cx')) - (parseFloat(enemy.attr('x')) + halfEnemyWidth);
  var currentYDiff = parseFloat(enteredPlayerSel.attr('cy')) - (parseFloat(enemy.attr('y')) + halfEnemyHeight);

  // var separation = function() {
  //   return Math.sqrt(Math.pow(currentXDiff, 2) + Math.pow(currentYDiff, 2));
  // };

  if (Math.abs(currentXDiff) < xDiffSum && Math.abs(currentYDiff) < yDiffSum) {
    collidedCallback();
  }

};

var updateScore = function() {
  //increment collision count
  //d3.select('.collisions span').text();
  gameStats.collisionCount++;
  gameStats.highestScoreCount = (gameStats.highestScoreCount < gameStats.currentScoreCount) ? gameStats.currentScoreCount : gameStats.highestScoreCount;
  gameStats.currentScoreCount = 0;

  d3.select('.highscore span').text(gameStats.highestScoreCount.toString());
  d3.select('.collisions span').text(gameStats.collisionCount.toString());
};



//-------- Function to update enemy positions on canvas --------
var updateEnemy = function (enemyData) {
  //bind the enemy data to selection, update enemy id on update
  var enemySel = enteredEnemySel.data(enemyData, d=>d.id);
  enemySel.transition()
  .duration(1000)
  .attr('x', d => d.x)
  .attr('y', d => d.y )
  .tween('detectCollision', function() {
    // after binding with data, enemySel (this) becomes refering to each svg obj in selection
    // use d3.select(this) to wrap the svg obj to d3 obj
    var enemy = d3.select(this);
    // console.log(enemy);
    return function(t) {
      checkCollision(enemy, updateScore);
    };
  });
};

//------------------------- Run Program -------------------------
updateEnemy(makeEnemyData());
setInterval(function() {
  updateEnemy(makeEnemyData());
}, 1000);

setInterval(function() {
  gameStats.currentScoreCount++;
  d3.select('.current span').text(gameStats.currentScoreCount.toString());
}, 500);
