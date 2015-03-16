(function(angular) {
  'use strict';

  var myApp = angular.module('myApp', [])
    
    .controller('AppController', ['$scope', '$log', function($scope, $log) {

      $scope.updateData = function() {
        console.log('Updating data');
      };

      // Initial run to fetch weather data
      $scope.updateData();
    }])


    .directive('tzSelect', function() {
      return {
        restrict: 'E',
        link: function(scope, element, attrs) {
          console.log(element);
          

        },

        templateUrl: 'partials/tzselect.html'
      };
    });

} (window.angular));
