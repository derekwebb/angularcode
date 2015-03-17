(function(angular) {
  'use strict';

  var myApp = angular.module('weatherApp', [])
    
    .controller('MyWeatherController', ['$scope', '$http', '$log', 'weather', function($scope, $http, $log, weather) {
      $scope.city  = 'Cincinnati';
      $scope.units = 'imperial';
      $scope.tz    = {};

      // Update all weather data
      $scope.updateData = function() {
        weather.updateData($scope, $http, $log); // calls factory service
      };

      $scope.tz.tzChange = function() {
        console.log($scope.tz.tzSelect);
      };

      // Initial run to fetch weather data
      $scope.updateData();
    }])


    // Set up a service factory to fetch current and forecast data
    .factory('weather', ['$http', function($http) {
      var services = {};

      // Timestamp is in seconds
      var formatTime = function(timestamp, scope) {
        console.log(scope);
        console.log(scope.tz.tzSelect);
        console.log(scope.tz.element);
        var offset = scope.tz.element.find("option[value='"+scope.tz.tzSelect+"']").attr('tzOffset');
        console.log(offset);

        var time = new Date(timestamp * 1000);

        return moment(time).utcOffset(Number(offset)).format('h:mm:ssa'); //time.toUTCString();

      };

      services.updateData = function(scope, http, log) {
        this.updateCurrent(scope, http, log);
        this.updateForecast(scope, http, log);
      };

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
          scope.sunrise = formatTime(data.sys.sunrise, scope);
          scope.sunset  = formatTime(data.sys.sunset, scope);
          scope.main = data.main;
          scope.wind = data.wind;
          scope.currentCity = data.name;
          scope.description = data.weather[0].description;
          scope.mapLink = 'http://maps.google.com/?ie=UTF8&hq=&ll='+data.coord.lat+','+data.coord.lon+'&z=15'; //http://maps.google.com/?ie=UTF8&hq=&ll=35.028028,-106.536655&z=13
        })
        .error(function(data, status, headers, config) {
          log.error('Could not retrieve data from '+url);
        });
      };


      // Get forecast data
      services.updateForecast = function(scope, http, log) {
        // Fetch forecast data from public api
        var url = 'http://api.openweathermap.org/data/2.5/forecast/daily';
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        // Get day info
        var getDays = function() {
          var now = new Date;
          var dayOfWeek = now.getDay();
          var dayOfWeekName = days[dayOfWeek];
          return {'dayOfWeek': dayOfWeek, 'dayOfWeekName': dayOfWeekName};
        }

        // Request forecast data
        http.jsonp(url, { params: {
          q: scope.city,
          units: scope.units,
          callback: 'JSON_CALLBACK'
        }})
        .success(function(data, status, headers, config) {
          var dayData = getDays();
          var i = 0;
          angular.forEach(data.list, function(value, key) {
            var forecastDay = (dayData.dayOfWeek + i) % 7;
            data.list[key].dayOfWeek = days[forecastDay];
            i++;
          });
          scope.days = data.list;
          //console.log(data);
        })
        .error(function(data, status, headers, config) {
          // Log an error
          log.error('Cound not retrieve forecast data from ' + url);
        });
      };

      return services;
    }])

    .directive('tzSelect', function() {
      return {
        restrict: 'E',
        link: function(scope, element, attrs) {
          scope.tz.element = element;
          scope.tz.tzSelect = 14; // default value for the tzSelect selectbox
        },

        templateUrl: 'partials/tzselect.html'
      };
    });

} (window.angular));
