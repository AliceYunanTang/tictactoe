var game = {
  board:  [" ", " ", " ", " ", " ", " ", " ", " ", " "],
  size: 3, // 3x3
  scores: {"x":0,"o":0,"d":0},
  state: {counter:0,turn:'x',result:'i',winningLine:[],over:false},
  winningCases:[[0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]],

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
  var $drawScore = $('draw-score');
  var $cells = $('.cell');

  var updateScoreUI = function (p){
    $p.text(game.scores[p]);
  }

  var updateBoard = function() {
    $('.cell').text(' ');
  }

  $cells.on('click',function(){
    var cellId = parseInt($(this).attr('id'));
    var m = game.move(cellId);
    $(this).text(game.state.turn);
    // debugger;
    switch (m) {
      case 'i': break;
      case 'x':
        $p1Score.text(game.scores['x']);
          $('.cell').text(' ');
            game.switchTurn();
        break;
      case 'o':
        $p2Score.text(game.scores['o']);
          $('.cell').text(' ');
            game.switchTurn();
        break;
      case 'd':
        $drawScore.text(game.scores['d']);
          $('.cell').text(' ');
        game.switchTurn();
        break;
      case 'c':  game.switchTurn();
        break;
    }




    // setTimeout(function(){
  // game.switchTurn();
    // },1000);

    // game.switchTurn();

  });
});
