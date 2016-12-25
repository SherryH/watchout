//-------- Initiate objects for the game --------

// Define game settings
var gameOptions = {
  height: window.innerHeight,
  width: window.innerWidth,
  nEnemies: 30,
  padding: 20
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

//--------------- Set Up Enemies ---------------------------
// create enemies. all enemies have .enemy class
var makeEnemyData = function () {
  return d3.range(gameOptions.nEnemies).map(function(d, i) {
    return {
      id: i,
      x: Math.random() * gameOptions.width,
      y: Math.random() * gameOptions.height
    };
  });
};
var enemyData = makeEnemyData();

//bind the enemy data to selection, update enemy id on update
var enemySel = gameBoard.selectAll('.enemy').data(enemyData, function(d, i) { return d.id; });
//enter the selections to be rendered
var enterEnemySel = enemySel.enter().append('image').attr('class', 'enemy').attr('x', function(d, i) { return d.x; }).attr('y', function(d, i) { return d.y; }).attr('height', 50).attr('width', 50).attr('xlink:href', 'asteroid.png');


//-------------- Set Up Player --------------------------
//create a differently-coloured player and make it draggable
//each circle's datum has [x,y] properties, which updates when dragged
var playerData = [{
  x: gameOptions.width / 2,
  y: gameOptions.height / 2
}];




var helper = makeHelperFunc();
playerData._move = function(d) {
  var position = helper.moveOnScreen(d3.event.x, d3.event.y);
  d3.select(this).attr('cx', position.x).attr('cy', position.y);
};
var drag = d3.behavior.drag().on('drag', playerData._move);
var playerSel = gameBoard.selectAll('.player').data(playerData);
playerSel.enter().append('circle').attr('class', 'player').attr('cx', d=>d.x).attr('cy', d=>d.y)
.attr('r', 10).attr('fill', 'yellow').call(drag);






//-------- Function to update enemy positions on canvas --------
var updateEnemy = function (enemyData) {
  //bind the enemy data to selection, update enemy id on update
  var enemySel = enterEnemySel.data(enemyData, d=>d.id);
  enemySel.attr('id', function(d) { return d.id; })
  .transition()
  .duration(5000)
  .attr('x', d => d.x)
  .attr('y', d => d.y );
  // console.log(enemySel);
};


updateEnemy(makeEnemyData());
setInterval(function() {
  updateEnemy(makeEnemyData());
}, 1000);
