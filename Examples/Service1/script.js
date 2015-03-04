var myApp = angular.module('myServiceModule', [])
  .controller('MyController', ['$scope', 'notify', function($scope, notify) {
    $scope.callNotify = function(msg) {
      notify(msg);
    };
  }]
);

myApp.factory('notify', ['$window', function(win) {
  var msgs = [];
  return function(msg) {
    msgs.push(msg);
    if (msgs.length == 3) {
      win.alert(msgs.join("\n"));
      msgs = [];
    }
  }
}]);