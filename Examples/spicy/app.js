var myApp = angular.module('spicyApp1', []);

myApp.controller('SpicyController', ['$scope', function($scope) {
  $scope.spice = 'hella';

  $scope.chiliSpicy = function() {
    $scope.spice = 'chili';
  };

  $scope.jalapenoSpicy = function() {
    $scope.spice = 'jalapeno';
  };
}]);