angular.module('xmpl.service', [])

  .value('greeter', {
    salutation: 'Hey there',
    localize: function(localization) {
      this.salutation = localization.salutation;
    },
    greet: function(name) {
      return this.salutation + ' ' + name + '!';
    }
  })

  .value('user', {
    load: function(name) {
      this.name = name;
    }
  });

angular.module('xmpl.directive', []);

angular.module('xmpl.filter', []);

angular.module('xmpl', ['xmpl.service', 'xmpl.directive', 'xmpl.filter'])

  .run(function(greeter, user) {
    greeter.localize({
      salutation: 'Bonjour'
    });
    user.load('World');
  })

  .controller('XmplController', function($scope, greeter, user) {
    $scope.greeting = greeter.greet(user.name);
  });