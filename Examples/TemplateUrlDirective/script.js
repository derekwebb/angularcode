angular.module('docsTemplateUrlDirective', [])
  .controller('Controller', ['$scope', function($scope) {
    $scope.customer = {
      name: 'Bryan Parker',
      address: '4400 Newtown Ave.'
    };
  }])
  .directive('myCustomer', function() {
    return {
      templateUrl: function(elem, attr) {
        return 'customer-'+attr.type+'.html';
      }
    };
  });