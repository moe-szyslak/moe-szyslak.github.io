window.addEventListener('load', function (e) {
  window.applicationCache.addEventListener('updateready', function (e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      window.location.reload();
    }
  }, false);
}, false);

var app = angular.module('PIFA', []);

app.controller('PIFACtrl', ['$scope', function ($scope) {
  $scope.players = PIFA.players;
  $scope.matches = PIFA.matches.reverse();
  $scope.nextPredictions = PIFA.predictions;

  // this is where the `magic` happens
  for (match in $scope.matches) {
    $scope.matches[match].pts = {};

    // this will `calculate` games that are of group stage
    for(player in $scope.players) {
      // forfeit
      if ($scope.matches[match].prediction.hasOwnProperty(player) === false) {
        $scope.matches[match].prediction[player] = {};
        $scope.matches[match].prediction[player].teamA = 'X';
        $scope.matches[match].prediction[player].teamB = 'X';
        $scope.players[player].PTS -= 2;
        $scope.players[player].forfeit++;
        $scope.matches[match].pts[player] = -2;
      } else if ($scope.matches[match].hasOwnProperty('round') === true &&
                 $scope.matches[match].match.scoreA === $scope.matches[match].prediction[player].teamA &&
                 $scope.matches[match].match.scoreB === $scope.matches[match].prediction[player].teamB &&
                 $scope.matches[match].match.scoreA - $scope.matches[match].match.scoreB === 0 &&
                 $scope.matches[match].prediction[player].teamA - $scope.matches[match].prediction[player].teamB === 0) {
        // Second stage and on
        // SPOT-ON DRAW
        // 4PTS
        $scope.players[player].PTS += 4;
        $scope.players[player].boom++;
        $scope.matches[match].pts[player] = 4;
      } else if ($scope.matches[match].hasOwnProperty('round') === true &&
                 $scope.matches[match].match.scoreA === $scope.matches[match].match.scoreB &&
                 $scope.matches[match].prediction[player].teamA === $scope.matches[match].prediction[player].teamB) {
        // Second stage and on
        // GD draw
        // 3PTS
        $scope.players[player].PTS += 3;
        $scope.players[player].rgd++;
        $scope.matches[match].pts[player] = 3;
      } else if (($scope.matches[match].match.scoreA === $scope.matches[match].prediction[player].teamA) &&
                 ($scope.matches[match].match.scoreB === $scope.matches[match].prediction[player].teamB)) {
        // after here everything goes as planned

        // spot on prediction
        $scope.players[player].PTS += 3;
        $scope.players[player].spotOn++;
        $scope.matches[match].pts[player] = 3;
      } else if (($scope.matches[match].match.scoreA > $scope.matches[match].match.scoreB) ===
                 ($scope.matches[match].prediction[player].teamA > $scope.matches[match].prediction[player].teamB) &&
                 ($scope.matches[match].match.scoreA < $scope.matches[match].match.scoreB) ===
                 ($scope.matches[match].prediction[player].teamA < $scope.matches[match].prediction[player].teamB)) {
        // side prediction

        // goal difference
        if (($scope.matches[match].match.scoreA - $scope.matches[match].match.scoreB) ===
            ($scope.matches[match].prediction[player].teamA - $scope.matches[match].prediction[player].teamB)) {
          $scope.players[player].PTS += 2;
          $scope.players[player].gd++;
          $scope.matches[match].pts[player] = 2;
        } else {
          $scope.players[player].PTS += 1;
          $scope.players[player].right++;
          $scope.matches[match].pts[player] = 1;
        }
      } else {
        // wrong prediction
        $scope.players[player].PTS -= 1;
        $scope.players[player].wrong++;
        $scope.matches[match].pts[player] = -1;
      }
    }
  }

  // calculating ranking...
  // it'll be `easier` to do it this way - i don't deserve to use Angular
  // forgiveness, please
  $scope.playersList = [];
  for (player in $scope.players) {
    $scope.playersList.push({name: player, stat: $scope.players[player]});
  };
}]);
