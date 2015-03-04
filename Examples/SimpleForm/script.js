angular.module('formExample', [])
  .controller('ExampleController', ['$scope', function($scope) {
    $scope.master = {};
    
    $scope.update = function(user) {
      var Obj = {};
      Obj = angular.copy(user);
      $scope.master[$scope.user.name] = Obj;
      $scope.userCount++;
    };

    $scope.reset = function() {
      $scope.master = {};
      $scope.userCount = 0;
    };

    $scope.reset();
  }]);