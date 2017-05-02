var Player = function () {

	//signup / differentiation info
	this.name = "";
	this.email = "";

	//game info
	this.shots = [];
}

Player.prototype.setTotalShots = function (numShots) {
	this.shots = [];

	for (var i = 0; i < numShots; i++) {
		this.shots.splice(i, 1, 0);
	}

}

Player.prototype.takeShot = function (numPoints, shotIndex) {

	this.shots.splice(shotIndex, 1, numPoints);
}

Player.prototype.undoShot = function (shotIndex) {

	this.shots.splice(shotIndex, 1, 0);
}

Player.prototype.fullReset = function () {
	this.name = "";
	this.email = "";

}

Player.prototype.getScore = function () {
	return this.shots.reduce(add, 0);
}

//helper function for finding the score
function add(a, b) {
    return a + b;
}