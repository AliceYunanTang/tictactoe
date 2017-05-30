var game = {
  board:  [" ", " ", " ", " ", " ", " ", " ", " ", " "],
  size: 9, // 3x3
  scores: {"x":0,"o":0,"d":0},
  state: {counter:0,turn:'x',result:'i',winningLine:[],over:false},
  winningCases:[[0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]],

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

  switchTurn: function(){
    this.state.turn = (this.state.turn==="x")? "o":"x";
    this.state.counter++;
    if ( this.state.result === "d" || this.state.result === "x" || this.state.result === "o") {
      this.reset();
      return false;
    } else if ( this.state.result === "c" ){
      return true;
    }
  },

  reset: function() {
    this.state.counter = 0;
    for (var i=0; i<this.board.length; i++ ){
      this.board[i]=" ";
    }
    this.state.winningLine = [];
  },

  checkForWin: function(p) {  // return the winning case, or undefined
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
  var $cells = $('.cell');
  $cells.on('click',function(){
    var cellId = parseInt($(this).attr('id'));
    var m = game.move(cellId);
    $(this).text(game.state.turn);
    // debugger;
    setTimeout(function(){
      if( game.state.over ) {
      $cells.text(" ");
      }
    },10);

    game.switchTurn();
    // if (g )
  });
});
