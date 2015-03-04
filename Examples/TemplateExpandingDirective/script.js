angular.module('docTemplateUrlDirective', [])
  .controller('Controller', ['$scope', function($scope) {
    $scope.customer = {
      name: 'Naomi',
      address: '1600 Regular Ave.'
    };
  }])
  .directive('myCustomer', function() {
    return {
      restrict: 'E',
      templateUrl: 'my-customer.html'
    };
  });

  //template: 'Name: {{customer.name}} | Address: {{customer.address}}'