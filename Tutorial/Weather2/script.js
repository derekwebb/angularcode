(function(angular) {
  'use strict';

  var myApp = angular.module('weatherApp', [])
    
    .controller('MyWeatherController', ['$scope', '$http', '$log', 'weather', function($scope, $http, $log, weather) {
      $scope.city = 'Cincinnati';
      $scope.units = 'imperial';

      $scope.updateData = function() {
        weather.updateData($scope, $http, $log);
      };

      // Initial run to fetch weather data
      $scope.updateData();
    }])


    // Set up a service factory to fetch current and forecast data
    .factory('weather', ['$http', function($http) {
      var services = {};

      services.updateData = function(scope, http, log) {
        this.updateCurrent(scope, http, log);
        this.updateForecast(scope, http, log);
      }

      // Get current data
      services.updateCurrent = function(scope, http, log) {
        // Fetch current weather data from api
        var url = 'http://api.openweathermap.org/data/2.5/weather';

        http.jsonp(url, {params: {
          q: scope.city,
          units: scope.units,
          callback: 'JSON_CALLBACK'
        }})
        .success(function(data, status, headers, config) {
          scope.main = data.main;
          scope.wind = data.wind;
          scope.currentCity = data.name;
          scope.description = data.weather[0].description;
        })
        .error(function(data, status, headers, config) {
          log.error('Could not retrieve data from '+url);
        });
      };


      // Get forecast data
      services.updateForecast = function(scope, http, log) {
        // Fetch forecast data from public api
        var url = 'http://api.openweathermap.org/data/2.5/forecast/daily';

        http.jsonp(url, { params: {
          q: scope.city,
          units: scope.units,
          callback: 'JSON_CALLBACK'
        }})
        .success(function(data, status, headers, config) {
          //console.log(data);
          //console.log(status);
          scope.days = data.list;
          console.log(scope.days);
        })
        .error(function(data, status, headers, config) {
          // Log an error
          log.error('Cound not retrieve forecast data from ' + url);
        });
      };

      return services;
    }]);

} (window.angular));
