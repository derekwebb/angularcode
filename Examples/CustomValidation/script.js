var app = angular.module('form-example1', []);

var INTEGER_REGEXP = /^\-?\d+$/;
app.directive('integer', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.integer = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          // empty can be considered true
          return true; 
        }

        if (INTEGER_REGEXP.test(viewValue)) {
          // It is valide
          return true;
        }

        // It is invalid
        return false;
      };
    }
  };
});

app.directive('username', function($q, $timeout) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      var usernames = ['Jim', 'John', 'Jill', 'Jackie'];

      ctrl.$asyncValidators.username = function(modelValue, viewValue) {

        if (ctrl.$isEmpty(modelValue)) {
          // empty is valid
          return $q.when();
        }

        var def = $q.defer();

        $timeout(function() {
          // mock a delayed response
          if (usernames.indexOf(modelValue) === -1) {
            // username available
            def.resolve();
          } else {
            def.reject();
          }

        }, 2000);

        return def.promise;
      };
    }
  };
});