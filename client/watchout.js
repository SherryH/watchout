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
console.log(gameBoard.size());

// create enemies. all enemies have .enemy class
var enemyData = [ ...Array(gameOptions.nEnemies).keys()].map(function(d, i) {
  return {
    id: i,
    x: Math.random() * gameOptions.width,
    y: Math.random() * gameOptions.height
  };
});
console.log(enemyData);



//-------- Function to update enemy positions on canvas --------
var updateEnemy = function () {
  //bind the enemy data to selection, update enemy id on update
  var enemySel = gameBoard.selectAll('.svg .enemy').data(enemyData, function(d, i) { return d.id; });
  //enter the selections to be rendered
  enemySel.enter().append('circle').attr('class', 'enemy').attr('cx', function(d, i) { return d.x; }).attr('cy', function(d, i) { return d.y; }).attr('r', 10).attr('fill', 'yellow');
  //update the enemy position every second

  console.log(enemySel.size());
};

updateEnemy();

