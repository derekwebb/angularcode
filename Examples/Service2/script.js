var myApp = angular.module('myServiceModule', [])
  .controller('MyController', ['$scope', 'notify', function($scope, notify) {
    $scope.repeat = 3;
    var r = $scope.repeat;
    $scope.callNotify = function(msg) {
      notify(msg, $scope.repeat);
    };
  }]
);

myApp.factory('notify', ['$window', function(win) {
  var msgs = [];
  return function(msg, repeat) {
    msgs.push(msg);
    if (msgs.length == repeat) {
      win.alert(msgs.join("\n"));
      msgs = [];
    }
  }
}]);