angular.module('expressionExample', [])
  .controller('ExampleController', ['$scope', function($scope) {
    var exprs = $scope.exprs = [];
    $scope.expr = '4*5|currency';
    console.log('text');
    $scope.addExpr = function(expr) {

      exprs.push(expr);
    };

    $scope.removeExpr = function(index) {
      exprs.splice(index, 1);
    };
  }]);