angular.module('customTriggerExample', [])
  .controller('ExampleController', ['$scope', function($scope) {
    $scope.user = {};    
  }])
  .controller('ExampleController2', ['$scope', function($scope) {
    $scope.user = {};
  }]);