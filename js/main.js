
/* define board object, size, and winning array */
var board = {
  size: 3,
  wins: [[0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]],

  /* return total cells of the board */
  cells: function(){
    return this.size*this.size;
  },

  /*populate wins array according to board size; */
  buildWins: function(size){
    var wins = [];
    var winRow =[];
    var winCol = [];
    var winDiag1 = [];
    var winDiag2 = [];
    for (var i=0; i<size; i++) {
      winRow = [];
      winCol = [];
      for (var j=0; j<size; j++) {
        winRow.push(i*size+j);
        winCol.push(j*size+i);
      }
      wins.push(winRow);
      wins.push(winCol);
      winDiag1.push(i*size+i);
      winDiag2.push((i+1)*(size-1));
    }
    wins.push(winDiag1);
    wins.push(winDiag2);
    this.wins=wins;
    return wins;
  },

  setBoardSize: function(size){
    this.size = size;
    this.buildWins(size);
  }
}; // end board object

/* define players object and game logic in the methods */
var players = {
  x: {             // first player: score, image, positions taken on the board
    score: 0,
    image: './img/avatar1.png',
    positions: []
  },
  o: {
    score: 0,     // second player: score, image, positions taken on the board
    image: './img/avatar2.png',
    positions: []
  },
  playerSelectionCounter: 0,
  current: 'x',  // current player turn
  result: 'c',   // save move() result, c: contiunscoreCelle, i: ignore, w: win, d: draw
  winLine: [],   // if win occurs, save the winning line for animation purpose
  draws: 0,      // save draw counts.
  ai: false,     // use computer player or not, default no computer player

  /* return a position index randomly choosen from available empty cells
     simulate computer player without brain */
  aiMoveRandom: function() {
    var range = board.cells() - this.x.positions.length - this.o.positions.length
    var randInt = Math.floor((Math.random()* range));
    var positionsTaken = (this.x.positions.concat(this.o.positons)).sort();
    var availableCounter = 0;
    var positionsAvailable = [];
    for (var i = 0; i<board.cells; i++){
      if (!positionsTaken.includes(i) ) {
        if (availableCounter===randInt) {
          return i;
        } else {
          availableCounter +=1;
        }
      }
    }
    return -1;
  },

  /* return an position index calculated using minimax algorithm
     simulate unbeatable computer player
     TO BE COMPLETED LATER !!!!!*/
  aiMinimax: function() {

  },

  /* save the current socre to local storage,
    to be called by move() when win or draw occurs */
  saveScoreToLocalStorage: function() {
    localStorage.setItem("TicTacToeX", JSON.stringify(this.x.score));
    localStorage.setItem("TicTacToeO", JSON.stringify(this.o.score));
    localStorage.setItem("TicTacToeD", JSON.stringify(this.draws));
  },

  /* clear history scores */
  resetScoreToZero: function(){
    this.x.score = 0;
    this.o.score = 0;
    this.draws = 0;
    this.saveScoreToLocalStorage();
  },

  /* when game starts or window reloads,
  this funciton gets callled to load history scores form local storage */
  getScoreFromLocalStorage: function() {
    if (localStorage.getItem("TicTacToeO") === null) {
      localStorage.setItem("TicTacToeX", JSON.stringify(this.x.score));
    } else {
      this.x.score = JSON.parse(localStorage.getItem("TicTacToeX"));
    }
    if (localStorage.getItem("TicTacToeO") === null) {
      localStorage.setItem("TicTacToeO", JSON.stringify(this.o.score));
    } else {
      this.o.score = JSON.parse(localStorage.getItem("TicTacToeO"));
    }
    if (localStorage.getItem("TicTacToeD") === null) {
      localStorage.setItem("TicTacToeD",JSON.stringify(this.draws));
    } else {
      this.draws = JSON.parse(localStorage.getItem("TicTacToeD"));
    }
  },

  /* called by switchTurn to reset after win or draw occurs */
  resetPlayerPositions: function() {
    this.x.positions = [];
    this.o.positions = [];
    this.winLine = [];
    this.result = 'c';
  },

  /* set player token image */
  setImage: function(player,imageUrl) {
    this[player]['image'] = imageUrl;
  },

  /* switch player turn, if win or draw occurs, reset player occupied positions*/
  switchTurn: function(){

    if (this.result === "i") {
      return false;
    }
    this.current = (this.current==="x")?  "o" : "x";
    if ( this.result === "d" || this.result === "w" ) {
      this.resetPlayerPositions();
    }
    return true;
  },

  /* to be called by move(), return winLine if there is a win*/
  checkWin: function(){
    return board.wins.find(function(win){
      for (var i = 0; i<win.length; i++) {
        if ( !this[this.current]['positions'].includes(win[i])) {
          return false;
        }
      }
      this.winLine = win.slice(0);
      return true;
    },this);
  },

  /* input: position index (from 0 to board.cells),
  return: 'd' for draw, 'w' for win, 'c' for continue, 'i' for illegal move (position occupied) */
  move: function(position){

    if (!(this.x.positions.includes(position))   // cell not occupied by 'x'
      && (!(this.o.positions.includes(position))) ) { //and cell not occupied by 'o'
      this[this.current]['positions'].push(position);  //current player take the position
      if (this[this.current]['positions'].length < board.size ){
        result = 'c'; //not having enough positions to win, skip checkWin(), continue game
      } else if (this.checkWin()){
        result = 'w'; //win occurs
        this[this.current]['score'] +=1; // score ++
        this.saveScoreToLocalStorage();  // save score to local storage
      } else if(this[this.current]['positions'].length > board.cells()/2) {
        //no win, and current player takes more than half cells , draw occurs
        result = 'd';
        this['draws'] +=1;  // draw counter ++
        this.saveScoreToLocalStorage();  // save draw counter to local storage
      } else {
        result = 'c'; //no win, no draw, continue
      }
    } else {
      result = 'i'; //illegal move, cell already occupied, ignore
    }
    this.result = result;
    return result;
  }, //end move

  /* to be called by document.ready() to start the game
     load history scores from local storage
     and clear all player occupied positions */
  start: function() {
    this.getScoreFromLocalStorage();
    this.resetPlayerPositions();
    this.playerSelectionCounter = 0;
  }
}; //end players object



$(document).ready(function(){

  var $p1Score = $('#p1-score');
  var $p2Score = $('#p2-score');
  var $drawScore = $('#draw-score');
  var $cells = $('.cell');
  var $win = $('.winAnimation');
  var $scoreReset = $('#reset-scoreboard');

  // update scores
  var updateScoreUI = function (){
    $p1Score.text(players.x.score);
    $p2Score.text(players.o.score);
    $drawScore.text(players.draws);
  };

  // clear game board UI
  var clearBoardUI = function() {
    $('.cell').text('');
  };

  // animation after win, show hidden html div .winAnimation with .gif background
  var animateWin = function() {
    $win.css({'background':'url("img/fireworks-animation-19-2.gif")','background-size':'cover'});
    $win.show().delay(5000).hide('fast','swing',function(){
      clearBoardUI();
      updateScoreUI();
      players.switchTurn();
    });
  };

  var animateDraw = function() {
    $win.css({'background':'url("img/200w.gif")','background-size':'cover'});
    $win.show().delay(5000).hide('fast','swing',function(){
      clearBoardUI();
      updateScoreUI();
      players.switchTurn();
    });
  };

  var gameMessageUI = function() {
    if (players.current === 'o') {
      $('.game-message').html('<span class="is-secondary-color">player 1</span> move');
    } else {
      $('.game-message').html('<span class="is-primary-color">player 2</span> move');
    }
  };

  var winMessageUI = function() {
    if (players.current === 'x') {
      $('.game-message').html('<span class="is-secondary-color">player 1</span> won');
    } else {
      $('.game-message').html('<span class="is-primary-color">player 2</span> won');
    }
  };

  var winLineAnimation = function () {
    for (var i=0; i<players.winLine.length; i++)
    $('#' + players.winLine[i]).animate('opacity','0.5');
  }

  // game cell click event callback, call move method,
  // check return result from game.move, update UI accordingly
  $cells.on('click',function(){
    gameMessageUI();
    var cellId = parseInt(this.id);
    var m = players.move(cellId);  // call move(), store result in m;
    if (m!=='i') {
      // $(this).text(players.current);
      $(this).append('<img src="' + players[players.current].image + '" />' )
    }
    $(this).removeClass('cell-' + players.current + '-hover');
    $(this).css('background-image', 'url("")');

    switch (m) {
      case 'i': return;            //ignore, if occupied cell clicked, do nothing
      case 'w':                   // player x won, show animation
        $win.text( players.current + 'WON!');

        winLineAnimation();
        winMessageUI();
        clearBoardUI();
        updateScoreUI();
        break;
      case 'd':                   // draw, show 'cats game' animation, to be completed!!!!!
        $win.text('DRAW!');
        // animateWin();
        clearBoardUI();
        updateScoreUI();
        break;
      case 'c':
        // players.switchTurn();// continue game.
        break;
      }
      players.switchTurn();// continue game.
  });


  $cells.hover(function(){
    // var cellId = parseInt($(this).attr('id'));  //this.id
    if(!(players.x.positions.includes(parseInt(this.id)))
      && !(players.o.positions.includes(parseInt(this.id)))) {
      $(this).addClass('cell-' + players.current +  '-hover');
      $(this).css('background-image', 'url("'  + players[players.current].image + '")');
    }
  },function(){
    $(this).css('background-image', 'url("")');
    $(this).removeClass('cell-' + players.current + '-hover');

  });

  $scoreReset.on('click',function(){
    players.resetScoreToZero();
    $p1Score.text(players.x.score);
    $p2Score.text(players.o.score);
    $drawScore.text(players.draws);
  });

  board.setBoardSize(3);  // set board size to 3;
  players.start();  //start the game
  updateScoreUI();
  clearBoardUI();


  $('#player-selection-button').on('click', function(){
    $('#player-selection-menu').css('display','flex');
    players.start();
    $('.cell img').remove();
  });

  var characterMouseoverEvent = function() {
    if (players.playerSelectionCounter === 0) {
      $(this).css("background-color","#95d3c4");
    } else {
      $(this).css("background-color","#f69697");
    }
  };

  var characterMouseoutEvent = function() {
      $(this).css("background-color","#ddd1b7");
  };

  $(".player-icon-choice").on("mouseover",characterMouseoverEvent);
  $(".player-icon-choice").on("mouseout",characterMouseoutEvent);

  var $player1Character;
  var characterClickEvent = function(){

    if ( players.playerSelectionCounter === 0) {
      players.x.image = $(this).find('img').attr("src");
      players.playerSelectionCounter = 1;
      $('.player-selection-message').html('choose <span class="is-primary-color">player 2</span> character');
      $player1Character = $(this);
      $(this).off("click");
      $(this).off("mouseover");
      $(this).off("mouseout");
    } else if ( players.playerSelectionCounter === 1) {
      players.o.image = $(this).find('img').attr("src");
      players.playerSelectionCounter = 0;

      $('.player-selection-message').html('choose <span class="is-secondary-color">player 1</span> character');
      // $('.player-icon-choice').on('click', characterClickEvent);
      $('#player-selection-menu').css('display','none');
      $player1Character.on('click',characterClickEvent);
      $player1Character.on('mouseover',characterMouseoverEvent);
      $player1Character.on('mouseout',characterMouseoutEvent);
      // $( "#player-selection-button" ).trigger( "click" );
    }
  }

  $('.player-icon-choice').on('click', characterClickEvent);

});
