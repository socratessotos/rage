var GameModeEnum = {

	//Casual Mode ->  throw 3 axes per player
	CASUAL: "casual",

	//Competitive Mode ->  throw 1 ax per player
	COMPETITIVE: "competitive",

	//Arms Race -> increasing variety of axes based on victory
	ARMS_RACE: "arms race",

	//Tournament --> special multiplayer mode
	PLANK: "plank",

	//Tournament --> special multiplayer mode
	Tournament: "tournament",

}

var Game = function (players, numPlayers, shotsPerTurn) {

	//set the players array and the numbr of players who will be playing
	this.players = players;
	this.numPlayers = numPlayers;

	//set the rules of the game
	this.shotsPerTurn = shotsPerTurn;
	this.totalShots = 10;

	//value used for when the shots per turn
	//doesnt divide equally into the total shots
	this.shotsThisTurn = shotsPerTurn;

	//start the turn at zero
	//figure out who goes first?
	this.canSevenPoint = false;

	//these variables will determine the turn order
	this.shotsTaken = 0; //the total number of shots take in the game
	this.currentShotPosition = {playerId: 0, shot: 0}; //the position of the current shot in the visual array
	this.isRunning = true;

	//stored values just for logic calculations
	this.shotsTakenBeforeThisTurn = 0;
	//value used for when the shots per turn
	//doesnt divide equally into the total shots
	this.shotsThisTurn = shotsPerTurn;

	//initialize 
	this.init ();

}

Game.prototype.init = function () {

	for (var i = 0; i < this.numPlayers; i++) {
		this.players[i].setTotalShots (this.totalShots);
	}

	if (this.players != undefined)
		this.findOutWhosTurn ();

}

Game.prototype.takeShot = function (numPoints) {

	this.players[this.currentShotPosition.playerId].takeShot (numPoints, this.currentShotPosition.shot);
	this.shotsTaken++;
	this.findOutWhosTurn ();

	if (this.gameIsOver ()) {
		this.endGame ();
	}

}

Game.prototype.undoShot = function () {
	
	if (this.shotsTaken > 0)
		this.shotsTaken--;

	//this bugs when you call it only once
	//here only
	//not sure why
	this.findOutWhosTurn ();
	this.findOutWhosTurn ();

	this.players[this.currentShotPosition.playerId].undoShot (this.currentShotPosition.shot);

}

Game.prototype.findOutWhosTurn = function () {

	//figure out how many shots this turn
	this.shotsThisTurn = this.shotsPerTurn;

	if ((this.shotsTakenBeforeThisTurn + this.shotsPerTurn) > this.totalShots) {
		this.shotsThisTurn = this.totalShots % this.shotsPerTurn;
	}

	//a bunch of calculations to figure out
	//whos turn and which shot they are taking
	//
	//
	//this is the total number of shots in one turn for all players
	var totalShotsPerTurn = this.numPlayers * this.shotsPerTurn;

	//which turn are we in for all players
	var currentTurn = Math.floor (this.shotsTaken / totalShotsPerTurn);

	//the number of shots that were taken per players before this turn
	this.shotsTakenBeforeThisTurn = currentTurn * this.shotsPerTurn;

	//the number of shots take by all player this turn
	var shotsTakenThisTurn = (this.shotsTaken - (this.shotsTakenBeforeThisTurn * this.numPlayers));

	//the number of shots take by just this player this turn
	var shotsTakenThisTurnThisPlayer =  shotsTakenThisTurn % this.shotsThisTurn;

	//the final result is the player id of the turn and the shot id
	this.currentShotPosition.playerId = Math.floor (shotsTakenThisTurn / this.shotsThisTurn);
	this.currentShotPosition.shot = this.shotsTakenBeforeThisTurn + shotsTakenThisTurnThisPlayer;

	//the shot is counting from zero
	if (this.currentShotPosition.shot == 4 || this.currentShotPosition.shot == 9) {
		this.canSevenPoint = true;
	} else {
		this.canSevenPoint = false;	
	}

}

Game.prototype.gameIsOver = function () {
	
	if (this.shotsTaken == this.totalShots * this.numPlayers) {
		return true;
	}
	return false;
}

Game.prototype.endGame = function () {
	this.isRunning = false;
}




