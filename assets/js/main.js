//creating a custom component for name input
var nameField = {
  	template: "<input v-model='playerName' id = 'userName' class = 's-8 row input-top' type='text' name='uname' placeholder='Nickname' :disabled='playerId != Main.currentLogin-1 ? true : false'>",

  	//setting different ids per name field
  	props: ['playerId'],
	data: function () {
	  return { id: this.playerId }
	},
	computed: {
		//player name property will automatically be calculated and set
		playerName: {

			get () {
		    	return Main.players[this.id].name;
		    },
		    set (value) {
		    	Main.players[this.id].name = value;
		    }
			
		}
	}
}

//creating a custom component for email input
var emailField = {
  	template: "<input v-model='playerEmail' id = 'email' class = 's-8 row input-bottom' type='text' name='email' placeholder='Email Address' :disabled='playerId != Main.currentLogin-1 ? true : false'>",

  	//setting different ids per email field
	props: ['playerId'],
	data: function () {
	  return { id: this.playerId }
	},
	computed: {
		//player name property will automatically be calculated and set
		playerEmail: {
			get () {
		    	return Main.players[this.id].email;
		    },
		    set (value) {
		    	Main.players[this.id].email = value;
		    }
		}
	}
}

//combining the 2 fields into a signup field
var signUp = {
  	template: "<div><name-field :player-id = 'playerId'></name-field></br><email-field :player-id = 'playerId'></email-field><br></div>",

	components: {
	  	'name-field': nameField,
		'email-field': emailField,
	},

	//child elements will get their ids from here
	props: ['playerId'],
	data: function () {
	  return { id: this.playerId }
	},

	//one way binding for player
	//only used to pass on to children
	computed: {
		player: function () {
			return Main.players[this.id];
		}
	}

}

var shot = {
	template: "<div v-bind:style='(isSelection) ? selectedStyle : normalStyle' class = 'shot'><span>{{pointValue}}</span></div>",

	//child elements will get their ids from here
	props: ['playerId', 'shotId'],
	data: function () {
	  return { 

	  	id: this.playerId,
	  	normalStyle: {
	  		border:'0.5vw solid black',
	  	},
	  	selectedStyle: {
	  		border:'0.5vw solid red',
	  	},
	   }
	},

	//one way binding for player
	//only used to pass on to children
	computed: {

		player: function () {
			return Main.players[this.id];
		},

		pointValue: function () {
			return Main.players[this.id].shots[this.shotId];
		},

		isSelection: function () {
			return (Main.game.currentShotPosition.playerId == this.playerId && Main.game.currentShotPosition.shot == this.shotId);
		}

	}

}

var avatar = {
	template: "<div class = 'avatar'><span>{{name}}</span></div>",

	//child elements will get their ids from here
	props: ['playerId'],
	data: function () {
	  return { id: this.playerId }
	},

	//one way binding for player
	//only used to pass on to children
	computed: {

		name: function () {
			return Main.players[this.id].name;
		}

	}

}

var player = {
	template: "<div> <avatar :player-id = 'playerId' ></avatar><shot v-for='s in Main.game.totalShots' :player-id = 'playerId' :shot-id = 's-1' ></shot><div id='total'>{{totalScore}}</div></div>",

	components: {
	  	'shot': shot,
		'avatar': avatar,
	},

	//child elements will get their ids from here
	props: ['playerId'],
	data: function () {
	  return { id: this.playerId }
	},

	//one way binding for player
	//only used to pass on to children
	computed: {
		player: function () {
			return Main.players[this.id];
		},
		totalScore: function () {
			return Main.players[this.id].getScore();
		}
	}

}

//the actual signup sheet vue 
var Main = new Vue ({

	el: '#main',
	data: {

		//keep track of players
		players: [
			new Player (),
			new Player (),
			new Player (),
		],

		//keep track of the current game
		game: new Game (),

		//the index of the page the user is on
		currentPage: 0,
		//the language of the current session
		language: 'f',
		//the number of players in the game
		numPlayers: 1,
		//the number of players you have logged in
		currentLogin: 1,
		//the current chosen game mode
		gameMode: GameModeEnum.CASUAL,
		
		//message to help user understand problems with the login
		loginMessage: "initial message",

		//everything under here are dynamic styles
		logoFull : {
			opacity: 1
		},

		logoHalf : {
			opacity: 0.2,
		},

		inputPreSignup : {
			top: '92vw',
			width: '33%',
			opacity: 0.2
		},

		inputSignup : {
			top: '50vw',
			left: '16.66vw'
		},

	},

	//the possible custom components in the app
	components: {
		'sign-up': signUp,
		'player' : player,
	},

	watch: {

		players: {
	      	handler: function (val, oldVal) {
	        	this.checkCredentials ();
	     	},
	      	deep: true
	    }

	},

	computed: {
		canSevenShot: function () {
			return this.game.canSevenPoint;
		},
		isRunning: function () {
			return this.game.isRunning;
		},
	},

	//functions of the app
	methods: {

		goToNextPage: function () {
			if (this.checkPageInfo()) this.currentPage++;
		},

		goToPreviousPage: function () {

			switch (this.currentPage) {

				case 1: 
					if (this.currentLogin > 1) {
						this.currentLogin--;
						return;
					}

				break;

				default:
				break;

			}

			if (--this.currentPage < 0) this.currentPage = 0;

		},

		checkPageInfo: function () {

			switch (this.currentPage) {

				//going to login
				case 0:
					this.resetPlayers ();
				break;

				//going to game select
				case 1: 

					return true;

					for (var i = 0; i < this.numPlayers; i++) {
						if(Main.players[i].name == "" || Main.players[i].email == "")
	
							if (this.players[this.currentLogin-1].name == "") {
								this.loginMessage = "user name can  not be left blank";
								return false;

							} else{

								if (this.players[this.currentLogin-1].email == "") {
									this.loginMessage = "email can  not be left blank";
									return false;
								}

							}

							if (this.currentLogin < this.numPlayers) {

								this.currentLogin++;
								return false;

							} else {

								return true;

							}

							return false;

					};

					this.addPlayersToDB ();

					break;

				//going into game
				case 2:
					this.game = new Game (this.players, this.numPlayers, 3);

				break

				default:
					break;

			}

			return true;

		},

		checkCredentials: _.debounce(
		    function () {

				this.loginMessage = "";

				if (this.currentLogin == 1) return;

				for (var i = 0; i < this.currentLogin-1; i++) {

					if (this.players[i].name == this.players[this.currentLogin-1].name) {
						this.loginMessage = "the user name you have chosen is already used by another player."

					} else if (this.players[i].email == this.players[this.currentLogin-1].email) {
						this.loginMessage = "the email you have email is already used by another player."

					}

				}

			},
			// This is the number of milliseconds we wait for the
			// user to stop typing.
			200
	    ),

		addPlayersToDB: function () {

			for (var i = 0; i < this.numPlayers; i++) {

				//Add player info to the db by referencing the player array in data like this
				//
				//
				//this.players[0]
				//this.players[0].name
				//this.players[0].email

			}

		},

		resetPlayers: function () {

			for (var i = 0; i < this.players.length; i++) {
				this.players[i].fullReset ();

			}

		},

		takeShot: function (numPoints) {

			this.game.takeShot (numPoints);

		},

		undoShot: function (numPoints) {

			this.game.undoShot ();

		},

		quitGame: function () {

			var r = confirm("Are you sure you want to quit the game?");
			if (r == true) {
			   	this.currentPage--;
			}

		},

		replay: function () {

			this.game = new Game (this.players, this.numPlayers, 3);

		},

		chooseMode: function () {

			this.currentPage = 2;

		},

	},

})









