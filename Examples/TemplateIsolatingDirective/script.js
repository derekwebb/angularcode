angular.module('docsScopeProblemExample', [])
  .controller('NaomiController', ['$scope', function($scope) {
    $scope.customer = {
      name: 'Naomi',
      address: '1440 Adison Dr.'
    };
  }])
  .controller('IgorController', ['$scope', function($scope) {
    $scope.customer = {
      name: 'Igor',
      address: '880 West Ave.'
    };
  }])
  .directive('myCustomer', function() {
    return {
      restrict: 'E',
      templateUrl: 'my-customer.html'
    };
  });