var game = {
  board:  [" ", " ", " ", " ", " ", " ", " ", " ", " "],
  size: 3, // 3x3
  scores: {"x":0,"o":0,"d":0},
  state: {
    counter:0,
    turn:'x',
    result:'i',
    winningLine:[],
    over:false
  },
  winningCases:[[0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]],

  resetScore: function() {
    this.scores.x=0;
    this.scores.o=0;
    this.scores.d=0;
  },

  // after each move, change game state, return
  // the winner, or draw, or continue,
  // or "i" (ignore), if cell already occupied
  move: function(index){
    if (this.board[index] ===" ") {
      this.board[index] = this.state.turn;
      if (!(this.checkForWin(this.state.turn))) { // not win
        if (this.state.counter === (this.board.length-1)){ //end of cells
          this.scores['d'] ++;
          this.state.result= 'd'; //draw
          this.state.over = true;

        } else {          // not end
          this.state.result = 'c'; //continue
          this.state.over = false;
        }
      } else {  // win
        this.state.over = true;
        this.scores[this.state.turn]++;
        this.state.result = this.state.turn;
        // return result;
      }
    } else(this.state.result = "i");
    return this.state.result;
  },

  //change player, call reset function if game is over
  switchTurn: function(){
    if (this.state.result === "i") {
      return false;
    }
    this.state.turn = (this.state.turn==="x")? "o":"x";
    this.state.counter++;
    if ( this.state.result === "d" || this.state.result === "x" || this.state.result === "o") {
      this.reset();
      return false;
    } else if ( this.state.result === "c" ){
      return true;
    }
  },

  // called by switchTurn, to reset game board
  reset: function() {
    this.state.counter = 0;
    for (var i=0; i<this.board.length; i++ ){
      this.board[i]=" ";
    }
    this.state.winningLine = [];
  },

  // internal funciton, to be called by move
  // return true if there is a winner and store the winningLine array
  checkForWin: function(p) {
    var result = false;
    var win;
    win = this.winningCases.find(function(v){
      result = true;
      for (var i = 0; i<v.length; i++) {
        if ( p !==this.board[v[i]]) {
          result = false;
          break;
        }
      }
      if (result === true) {
        game.state.winningLine.push(v);
        return true;
      }
    },this);
    // debugger;
    return result;
  }
};

$(document).ready(function(){

  var $p1Score = $('#p1-score');
  var $p2Score = $('#p2-score');
  var $drawScore = $('#draw-score');
  var $cells = $('.cell');
  var $win = $('.winAnimation');
  var $scoreReset = $('#reset-scoreboard');

  // load scores from localStorage and update game.scores
  if (localStorage.getItem("TicTacToeScores" ) === null) {
    localStorage.setItem("TicTacToeScores", JSON.stringify(game.scores));
  } else {
    game.scores = JSON.parse(localStorage.getItem("TicTacToeScores"));
    $p1Score.text(game.scores['x']);
    $p2Score.text(game.scores['o']);
    $drawScore.text(game.scores['d']);
  }

  var updateScoreUI = function (p){
    $p.text(game.scores[p]);
  };

  // clear game board UI
  var clearBoard = function() {
    $('.cell').text(' ');
  };

  // animation after win, show hidden html div .winAnimation with .gif background
  var animateWin = function() {
    $win.css({'background':'url("img/fireworks-animation-19-2.gif")','background-size':'cover'});
    $win.show().delay(5000).hide('fast','swing',function(){
      clearBoard();
      game.switchTurn();
      });
  };

  var animateDraw = function() {
      $win.css({'background':'url("img/200w.gif")','background-size':'cover'});
      $win.show().delay(5000).hide('fast','swing',function(){
      clearBoard();
      game.switchTurn();
    });
  }

  // game cell click event callback, call game.move method,
  // check return result from game.move, update UI accordingly
  $cells.on('click',function(){

    var cellId = parseInt($(this).attr('id'));
    var m = game.move(cellId);  // call game.mover, store result in m;
    $(this).text(game.state.turn);

    $(this).removeClass('cell-' + game.state.turn + '-hover');

    switch (m) {
      case 'i': break;            //ignore, if occupied cell clicked, do nothing
      case 'x':                   // player x won, show animation
        localStorage.setItem("TicTacToeScores", JSON.stringify(game.scores));
        $win.text('X WON!');
        $p1Score.text(game.scores['x']);
        animateWin();
        break;
      case 'o':                    // play o won, show animation
        localStorage.setItem("TicTacToeScores", JSON.stringify(game.scores));
        $win.text('O WON!')
        $p2Score.text(game.scores['o']);
        animateWin();
        break;
      case 'd':                   // draw, show 'cats game' animation, to be completed!!!!!
        localStorage.setItem("TicTacToeScores", JSON.stringify(game.scores));
        $win.text('DRAW!')
        $drawScore.text(game.scores['d']);
        animateWin();
        break;
      case 'c':  game.switchTurn(); // continue game.
        break;
    }
  });

  $cells.hover(function(){
    // var cellId = parseInt($(this).attr('id'));  //this.id
    if(game.board[this.id]===' ') {
      $(this).addClass('cell-' + game.state.turn +  '-hover');
    }
  },function(){
    $(this).removeClass('cell-' + game.state.turn + '-hover');
  });

  $scoreReset.on('click',function(){
    game.resetScore();
    localStorage.setItem("TicTacToeScores", JSON.stringify(game.scores));
    $p1Score.text(game.scores['x']);
    $p2Score.text(game.scores['o']);
    $drawScore.text(game.scores['d']);
  });


  var fizzyText = new FizzyText('tic tac toe');

});
