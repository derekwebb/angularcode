angular.module('docsIsolatedScopeDirective', [])
  .controller('Controller', ['$scope', function($scope) {
    $scope.naomi = { name: 'Naomi', address: '757 Groria Ln.' };
    $scope.igor  = { name: 'Igor', address: '3589 Tate Blvd.' };
    $scope.derek = { name: 'Derek', address: '6194 Autumnleaf Ln.' };
  }])
  .directive('myCustomer', function() {
    return {
      restrict: 'E',
      scope: {
        customerInfo: '=' // binds to attribute customer-info - note it is denormalized
      },
      templateUrl: 'my-customer-iso.html'
    };
  });