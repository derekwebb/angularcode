var myApp = angular.module('myReverseFilterApp', [])
  .filter('reverse', function() {
    return function(input, uppercase) {
      input = input || '';
      var out = '';
      
      for (var i = input.length; i >= 0; i--) {
        out += input.charAt(i);
      }

      // conditional
      if (uppercase) {
        out = out.toUpperCase();
      }

      return out;
    };
  });

  myApp.controller('MyController', ['$scope', function($scope) {
    $scope.greeting = 'Hello';
  }]);