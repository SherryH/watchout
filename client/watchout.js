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
var makeEnemyData = function () {
  return [ ...Array(gameOptions.nEnemies).keys()].map(function(d, i) {
    return {
      id: i,
      x: Math.random() * gameOptions.width,
      y: Math.random() * gameOptions.height
    };
  });
};
var enemyData = makeEnemyData();
console.log(enemyData);

//bind the enemy data to selection, update enemy id on update
var enemySel = gameBoard.selectAll('.enemy').data(enemyData, function(d, i) { return d.id; });
//enter the selections to be rendered
enemySel.enter().append('circle').attr('class', 'enemy').attr('cx', function(d, i) { return d.x; }).attr('cy', function(d, i) { return d.y; }).attr('r', 10).attr('fill', 'yellow');


//-------- Function to update enemy positions on canvas --------
var updateEnemy = function (enemyData) {
  //bind the enemy data to selection, update enemy id on update
  var enemySel = gameBoard.selectAll('.enemy').data(enemyData);
  enemySel.attr('id', function(d) { return d.id; })
  .attr('cx', d => d.x)
  .attr('cy', d => d.y );
  console.log(enemySel);
};


// updateEnemy(makeEnemyData());
setInterval(function() {
  updateEnemy(makeEnemyData());
},1000);
