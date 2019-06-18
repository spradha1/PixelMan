var gamevar;
var dead = false; // if player still alive

// start stage
function startGame() {
  control.removeEventListener('click', startGame);
  control.innerHTML = "GET TO THE GREEN CELL";
  document.addEventListener("keydown", movePlayer);
  gamevar = window.setInterval(gameOfLife, 200);
}

// grid update
function gameOfLife() {
  nextLives();
  updateGrid();
}

// update player coordinates
function updatePlayer(dist) {
  for (var i=0; i<playerCells.length; i++) {
    playerCells[i] += dist;
  }
}

// player movements
function movePlayer(evt) {
  var key = evt.keyCode;
  var mn = Math.min(... playerCells);
  var mx = Math.max(... playerCells);
  switch(key) {
    case 37:
      if ((mn- 1)%60 != 0)
        updatePlayer(-1);
      break;
    case 38:
      if (mn > 59)
        updatePlayer(-60);
      break;
    case 39:
      if (mx%60 != 59)
        updatePlayer(1);
      break;
    case 40:
      if (mx < 1440)
        updatePlayer(60);
      break;
  }
}

// game over
function gameOver() {
  clearInterval(gamevar);
  document.removeEventListener('keydown', startGame);
  stage.innerHTML = 1;
  
  // player cells become alive as they "die", and game of life rules take over again
  playerCells.forEach((num) => {
    liveCells[num] = 1;
  });
  playerCells = [];
  
  popBox("GAME OVER", "RETRY");
  gamevar = window.setInterval(gameOfLife, 200);
}

// won stage
function winStage() {
  clearInterval(gamevar);
  document.removeEventListener('keydown', startGame);

  let nextStage = parseInt(stage.innerHTML);
  if (nextStage == 3) {
    popBox('You maestro! That\'s the end. We salute you!', 'Play again');
    stage.innerHTML = 1;
  }
  else {
    stage.innerHTML = nextStage + 1;
    popBox('Stage completed', 'Next Stage');
  }
}

// dialog box generation after ending of a stage
function popBox(res, dir) {
  document.body.classList.add("blurred");

  var popup = document.createElement('div');
  popup.innerHTML = res;
  popup.setAttribute("id", "stageEnd");

  var button = document.createElement('div');
  button.classList.add('endButton');
  button.innerHTML = dir;

  // revert to first/next stage conditions
  button.addEventListener('click', function() {
    control.addEventListener('click', startGame);
    control.innerHTML = "START";
    document.body.classList.remove("blurred");
    button.remove();
    popup.remove();
    if (stage.innerHTML == '1')
      clearInterval(gamevar);
    setStage();
  });

  document.body.insertAdjacentElement('afterend', popup);
  popup.insertAdjacentElement('beforeend', button);
}