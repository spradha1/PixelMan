// ********** variables *************

var stage = document.querySelector('div#subhead div span'); // stage
const table = document.getElementById('pixelCanvas'); // grid

// control button
const control = document.querySelector('.gameButton');
control.addEventListener('click', startGame);

// starting live cells for stages
const stages = [
  [2, 63, 121, 122, 123, 372, 430, 432, 491, 492, 81, 142, 200, 201, 202, 412, 470, 472, 531, 532, 971, 1032, 1090, 1091, 1092, 1001, 1062, 1120, 1121, 1122],
  [670, 671, 672, 674, 730, 793, 794, 851, 852, 854, 910, 912, 914, 822, 824, 764, 706, 646, 648, 586, 588, 589, 528],
  [668, 730, 787, 788, 791, 792, 793, 698, 760, 817, 818, 821, 822, 823]
];

// state of cells
var playerCells;
var goal = 779;
var liveCells = Array(1500).fill(0);


// ********* functions ************

// set up live cells for stage
function setStage() {

  // stage #
  playerCells = [661, 720, 721, 722, 781, 840, 842];
  var sn = parseInt(stage.innerHTML) - 1;
  var cells = stages[sn];

  for(var k=0; k<liveCells.length; k++) {
    if(cells.includes(k))
      liveCells[k] = 1;
    else
      liveCells[k] = 0;
  }

  updateGrid();
}

// render updated grid
function updateGrid() {
  dead = false;
  const previousCells = document.querySelectorAll('tr');
  previousCells.forEach((item) => {
      item.remove();
  });

  var cn = 0;
  for (var r=0; r<25; r++){
    const row = document.createElement('tr');
    table.appendChild(row);
    for (var c=0; c<60; c++){
      const cell = document.createElement('td');
      const list = cell.classList;
      row.appendChild(cell);
      if (liveCells[cn] == 1)
        list.add('alive');
      if (playerCells.includes(cn))
        list.add('player');
      if (goal == cn)
        list.add('goal');
      
      if (list.contains('alive') && list.contains('player'))
        dead = true;
      else if (cn==goal && list.contains('player'))
        winStage();
      cn++;
    }
  }
  if (dead)
    gameOver();
}

// update alive cells by rules of Conway's game of life
function nextLives() {
  var next = Array(1500).fill(0);
  for (var cn=0; cn<1500; cn++) {
    var living = 0;
    if (cn > 59 && cn < 1440 && cn%60 != 0 && cn%60!=59)
      living += liveCells[cn-60] + liveCells[cn-61] + liveCells[cn-59] + liveCells[cn+60] + liveCells[cn+59] + liveCells[cn+61] + liveCells[cn-1] + liveCells[cn+1];
    else {
      if (cn == 0)
        living += liveCells[1] + liveCells[59] + liveCells[60] + liveCells[61] + liveCells[119] + liveCells[1440] + liveCells[1441] + liveCells[1499];
      else if (cn == 59)
        living += liveCells[0] + liveCells[58] + liveCells[60] + liveCells[118] + liveCells[119] + liveCells[1440] + liveCells[1498] + liveCells[1499];
      else if (cn == 1440)
        living += liveCells[0] + liveCells[1] + liveCells[59] + liveCells[1380] + liveCells[1381] + liveCells[1439] + liveCells[1441] + liveCells[1499];
      else if (cn == 1499)
        living += liveCells[0] + liveCells[58] + liveCells[59] + liveCells[1380] + liveCells[1438] + liveCells[1439] + liveCells[1440] + liveCells[1498];
      else if (cn%60 == 0)
        living += liveCells[cn-60] + liveCells[cn-59] + liveCells[cn-1] + liveCells[cn+1] + liveCells[cn+59] + liveCells[cn+60] + liveCells[cn+61] + liveCells[cn+119];
      else if (cn%60 == 59)
        living += liveCells[cn-119] + liveCells[cn-61] + liveCells[cn-60] + liveCells[cn-59] + liveCells[cn-1] + liveCells[cn+1] + liveCells[cn+59] + liveCells[cn+60];
      else if (cn < 60) {
        living += liveCells[cn-1] + liveCells[cn+1] + liveCells[cn+59] + liveCells[cn+60] + liveCells[cn+61] + liveCells[cn+1440] + liveCells[cn+1441] + liveCells[cn+1439];
      }
      else if (cn > 1439) {
        living += liveCells[cn-1] + liveCells[cn+1] + liveCells[cn-59] + liveCells[cn-60] + liveCells[cn-61] + liveCells[cn-1440] + liveCells[cn-1441] + liveCells[cn-1439];
      }
    }

    if (liveCells[cn] == 1) {
      if (living == 2 || living == 3)
        next[cn] = 1;
    }
    else {
      if (living == 3)
        next[cn] = 1;
    }
  }
  liveCells = next;
}