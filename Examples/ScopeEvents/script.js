angular.module('eventExample', [])
  .controller('EventController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.count = 0;
    $scope.$on('MyEvent', function() {
      $scope.count++;
    });

    $scope.resetClicks = function() {
      $scope.count = 0;
    };
  }]
);