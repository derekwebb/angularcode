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
        console.log(this);
        console.log(scope);
        this.updateCurrent(scope, http, log);
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
          scope.description = data.weather[0].description;
          console.log(data);
        })
        .error(function(data, status, headers, config) {
          log.error('Could not retrieve data from '+url);
        });
      };

      return services;
    }]);

} (window.angular));



/*

(function(angular) {
  'use strict';
  var myApp = angular.module('weatherApp', [])
    .controller('MyWeatherController', ['$scope', '$http', '$log', function($scope, $http, $log) {
      
      // Set defaults for the form fields
      $scope.city = 'Cincinnati';
      $scope.units = 'imperial';

      $scope.updateCurrent = function() {
        // Fetch data from public API through JSONP
        // See http://openweathermap.org/API#weather
        var url = 'http://api.openweathermap.org/data/2.5/weather';

        $http.jsonp(url, { params: {
          q: $scope.city,
          units: $scope.units,
          callback: 'JSON_CALLBACK'
        }})
        .success(function(data, status, headers, config) {
          $scope.main = data.main;
          $scope.wind = data.wind;
          $scope.description = data.weather[0].description;
        })
        .error(function(data, status, headers, config) {
          // Log an error message
          $log.error('Could not retrieve data from ' + url);
        });
      };

      // Trigger first load for current weather data
      //$scope.updateCurrent();

      // Get the 7 day forecast
      $scope.updateForecast = function() {
        // Fetch forecast data from public api
        var url = 'http://api.openweathermap.org/data/2.5/forecast/daily';

        $http.jsonp(url, { params: {
          q: $scope.city,
          units: $scope.units,
          callback: 'JSON_CALLBACK'
        }})
        .success(function(data, status, headers, config) {
          console.log(data);
          console.log(status);
        })
        .error(function(data, status, headers, config) {
          // Log an error
          $log.error('Cound not retrieve forecast data from ' + url);
        });
      };

      //$scope.updateForecast();

      $scope.updateData = function() {
        $scope.updateCurrent();
        $scope.updateForecast();
      };

      $scope.updateData();
    }]);
}(window.angular));

*/