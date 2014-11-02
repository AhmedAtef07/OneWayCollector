var grid, score, tank, defaultLevel = 3, size = defaultLevel, 
	defaultTimer = 7, startTimer = 7, timer = defaultTimer, dp;
var startGameButton = document.createElement('button');
startGameButton.style['width'] = '200px';
startGameButton.style['height'] = '30px';
startGameButton.innerHTML = 'Start';
startGameButton.style['visibility'] = 'visible';
startGameButton.onclick = setStage;
document.body.appendChild(startGameButton);
var gameDiv = document.createElement('div');
document.body.appendChild(gameDiv);

var cellColors = {
	70: 'yellow',
	140: 'orange',
	210: 'lime',
	280: 'navy',
	350: 'red'
}

function clearStage() {
	startGameButton.style['visibility'] = 'visible';
	gameDiv.innerHTML = '';	
}
function setStage() {
	startGameButton.style['visibility'] = 'collapse';
	score = new Score(0, startTimer);
	grid = new Grid(1000, 600, size);
	score.setBestValue(getMax(grid.size - 1, 0));
	grid.clearCell(grid.size - 1, 0);
	tank = new MovingObject('tank.png', grid.size - 1, 0);
}

document.onkeydown = keyDown;

function keyDown(ev) {
	console.log(ev);
	switch(ev.keyCode){
		// case 37: case 65: // Left A
		// 	tank.move(0, -1);
		// 	break;
		case 38: case 87: // Up W
			tank.move(-1, 0);
			break;
		case 39: case 68: // Right D
			tank.move(0, 1);
			break;
		// case 40: case 83: // Down S
		// 	tank.move(1, 0);
		// 	break;	
		case 32:
			if(startGameButton.style['visibility'] == 'visible') {
				setStage();
			}
			break;

	}
}


function getH2 (innerHtml) {
	var header = document.createElement('h2');
	header.innerHTML = innerHtml + '';
	return header;
}
function Score(value, time) {
	this.value = value;
	this.bestValue = 0;
	this.time = time;
	var scoreDiv = document.createElement('table');

	var userScoreCell = document.createElement('td');
	var userScore = getH2('0');
	userScoreCell.appendChild(userScore);
	scoreDiv.appendChild(userScoreCell);

	var splitterCell = document.createElement('td');
	splitterCell.appendChild(getH2('/'));
	scoreDiv.appendChild(splitterCell);
	
	var bestScoreCell = document.createElement('td');
	var bestScore = document.createElement('h2');
	bestScoreCell.appendChild(bestScore);
	scoreDiv.appendChild(bestScoreCell);

	splitterCell = document.createElement('td');
	splitterCell.appendChild(getH2(' - Level ' + (size - (defaultLevel - 1)) + ' - '));
	scoreDiv.appendChild(splitterCell)

	var timerCell = document.createElement('td');
	var timerH2 = document.createElement('h2');
	timerCell.appendChild(timerH2);
	scoreDiv.appendChild(timerCell);
	
	gameDiv.appendChild(scoreDiv);
	
	this.setTimerValue = function() {
		timerH2.innerHTML = ' ---- ' + this.time + ' seconds to your lose!';
		this.time--;
		if(this.time >= 0) {
			clearTimeout(timer);
			timer = setTimeout(function() {score.setTimerValue();}, 1000);
		}
		else {
			loseGame();
		}
		
	}
	this.setTimerValue();

	this.addToValue = function(addedValue) {
		this.value += addedValue;
		userScore.innerHTML = this.value + '';
	}

	this.setBestValue = function (value){
		this.bestValue = value;
		bestScore.innerHTML = value + '';
	}
}


function loseGame () {
	clearTimeout(timer);
	alert("YOU ARE DONE MATE!\n YOU ARE FINISHED!\n YOU LOST!!\nNeHAHAHAHAHAHA");
	size = defaultLevel;
	startTimer = defaultTimer;
	clearStage();
}


function winGame (argument) {
	clearTimeout(timer);
    alert("YOU WON!\nlet's see what you gonna do in the next one!");
	size++;
	var level = (size - (defaultLevel - 1));
	startTimer = defaultTimer + (level * level) + score.time;
	clearStage()
	setStage();
}
function Grid(width, height, size) {
	this.size = size;
	this.cells = createTable(width, height, size);

	this.clearCell = function(i, k) {
		this.cells[i][k].innerHTML = '';
	}

	this.addToCell = function (i, k, imageSource) {
		var image = document.createElement('img');
		image.src = imageSource;
		image.style['max-width'] = 1 / size * width - 2;
		image.style['min-height'] = 1 / size * height - 2;
		this.cells[i][k].appendChild(image);
	}
}

function MovingObject(imageSource, i, k) {
	this.imageSource = imageSource;
	this.i = i;
	this.k = k;
	grid.addToCell(i, k, imageSource);

	this.move = function (iDir, kDir) {
		var newI = this.i + iDir, 
			newK = this.k + kDir;
		if (newI == -1 || newI == grid.size || 
			newK == -1 || newK == grid.size) return;
		grid.clearCell(this.i, this.k);
		score.addToValue(parseInt(grid.cells[newI][newK].innerHTML));
		grid.clearCell(newI, newK);	
		grid.addToCell(newI, newK, this.imageSource);
		this.i = newI;
		this.k = newK;

		if(newI === 0 && newK == grid.size - 1) {
			if (score.value != score.bestValue) loseGame();
			else winGame();
		}
	}
}

function createTable(width, height, size) {	
	var periodsTable = document.createElement('table');
	periodsTable.style['width'] = width;
	periodsTable.style['height'] = height;
	var cells = [];
	dp = [];
	for (var i = 0; i < size; ++i) {
		var tableRow = document.createElement('tr');
		cells[i] = [];
		dp[i] = [];
		for (var k = 0; k < size; ++k) {
			var tableColumn = document.createElement('td');
			tableColumn.style['width'] = (1 / size * 100) + '%';
			tableColumn.style['height'] = (1 / size * 100) + '%';
			tableColumn.style['border'] = '1px solid black';

			var randomValue = (Math.floor(Math.random()*700) % 5 + 1) * 70;
			tableColumn.innerHTML = randomValue + '';
			if (!(i == size - 1 && k == 0)) tableColumn.style['background'] = cellColors[randomValue];
			tableRow.appendChild(tableColumn);
			cells[i][k] = tableColumn;
			dp[i][k] = -1;
		}
		periodsTable.appendChild(tableRow);
	}
	gameDiv.appendChild(periodsTable);
	return cells;
}


function getMax(newI ,newK) {
		if (newI == -1 || newK == grid.size) return 0;
		var thisCellValue = parseInt(grid.cells[newI][newK].innerHTML);
		if(newI == grid.size - 1 && newK == 0) thisCellValue = 0;

		 if(dp[newI][newK] !== -1) return dp[newI][newK];
        return dp[newI][newK] = Math.max(getMax(newI - 1, newK), getMax(newI, newK + 1)) + thisCellValue;
}

var counter = document.createElement('img');
counter.src = 'http://sstatic1.histats.com/0.gif?2780746&101';
counter.border = 0;
document.body.appendChild(counter);
