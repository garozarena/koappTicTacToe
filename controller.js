(function() {
  'use strict';

  angular
    .module('koapp-Tictactoe', [])
    .controller('koappTictactoeController', koappTicTacToeController);

  koappTicTacToeController.$inject = ['$scope', 'structureService', '$location'];

  function koappTicTacToeController($scope, structureService, $location) {

    structureService.registerModule($location, $scope, 'koapp-Tictactoe');

    $scope.startGame    = startGame;
    $scope.insertCard   = insertCard;
    $scope.restartCount = restartCount;
    $scope.turn         = "player1Turn";
    $scope.printTurn    = "PLAYER 1";
    $scope.turnClass    = "player1";
    $scope.gameBoard    = 0;
    $scope.existWinner  = false;
    $scope.tie          = false;
    $scope.points = {
      player1: 0,
      player2: 0
    };

    var locked = false;
    var squareCount = 0;

    function startGame() {
      if ($scope.points.player1 === 3 || $scope.points.player2 === 3) restartCount();
      locked     = false;
      $scope.tie = false;
      setTimeout(function() {
        $scope.existWinner = false;
      }, 1500);
      squareCount = 0;
      $scope.gameBoard = [
        ["void", "void", "void"],
        ["void", "void", "void"],
        ["void", "void", "void"]
      ];
    }

    function insertCard(file, row) {
      if ($scope.gameBoard[file][row] === "void" && !locked) {
        $scope.gameBoard[file][row] = $scope.turn;
        squareCount += 1;
        if (checkWinner()) {
          locked = true;
          $scope.existWinner = true;
          addPoints();
          setTimeout(function() {
            startGame();
        }, 500);
        } else {
          checkTie();
          changeTurn($scope.turn);
        }
      }

      function checkWinner() {
        for (var i = 0; i < 3; i++) {
          if (checkThreeInLine([i, 0], [i, 1], [i, 2])) return true;
          if (checkThreeInLine([0, i], [1, i], [2, i])) return true;
        }

        if (checkThreeInLine([0, 0], [1, 1], [2, 2])) return true;
        if (checkThreeInLine([0, 2], [1, 1], [2, 0])) return true;

        return false;

        function checkThreeInLine(square1, square2, square3) {
          if ($scope.gameBoard[square1[0]][square1[1]] !== "void" &&
            $scope.gameBoard[square1[0]][square1[1]] === $scope.gameBoard[square2[0]][square2[1]] &&
            $scope.gameBoard[square1[0]][square1[1]] === $scope.gameBoard[square3[0]][square3[1]]) {
            return true;
          }
        }

      }

      function addPoints() {
        ($scope.turn === "player1Turn") ? $scope.points.player1 += 1 : $scope.points.player2 += 1;
      }

      function checkTie() {
        if (squareCount === 9 && !$scope.existWinner) {
          $scope.existWinner = true;
          $scope.tie         = true;
        }
      }

      function changeTurn(activeTurn) {
        (activeTurn === "player1Turn") ? toggleTurn('player2Turn', 'player2', 'PLAYER 2') : toggleTurn('player1Turn', 'player1', 'PLAYER 1');
      }

      function toggleTurn(activeTurn, turnColor, turnText) {
          $scope.turn       = activeTurn;
          $scope.printTurn  = turnText;
          $scope.turnClass    = turnColor;
      }
    }

    function restartCount() {
      $scope.points = {
        player1 : 0,
        player2 : 0
      }
      startGame();
    }
  }
}());
