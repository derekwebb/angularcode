(function(angular) {
  'use strict';

  var myApp = angular.module('weatherApp', [])
    
    .controller('MyWeatherController', ['$scope', '$http', '$log', 'weather', function($scope, $http, $log, weather) {
      $scope.city  = 'Cincinnati';
      $scope.units = 'imperial';

      // Update all weather data
      $scope.updateData = function() {
        weather.updateData($scope, $http, $log); // calls factory service
      };

      // Initial run to fetch weather data
      $scope.updateData();
    }])


    // Set up a service factory to fetch current and forecast data
    .factory('weather', ['$http', function($http) {
      var services = {};

      services.fetchTZInfo = function(tzParams) {
        //var url = "https://maps.googleapis.com/maps/api/timezone/json?location=39.161999,-84.456886&timestamp=1427392872";
        var url = "https://maps.googleapis.com/maps/api/timezone/json"; //?location="+lat+","+lon+"&timestamp="+timestamp;

        tzParams.http.get(url, {params: {
          location: tzParams.lat+','+tzParams.lon,
          timestamp: tzParams.timestamp,
          callback: 'JSON_CALLBACK'
        }})
        .success(function(data, status, headers, config) {
          tzParams.scope.tzInfo  = data; // store the TZ data
          tzParams.scope.sunrise = services.formatTime(tzParams.scope.sunriseData, tzParams.scope);
          tzParams.scope.sunset  = services.formatTime(tzParams.scope.sunsetData, tzParams.scope);
        })
        .error(function(data, status, headers, config) {
          tzParams.log.error('Could not retrieve data from '+url);
        });
      };

      services.formatTime = function(timestamp, scope) {
        var time = new Date(timestamp * 1000);
        return moment(time).utcOffset((scope.tzInfo.rawOffset / (60*60)) + scope.tzInfo.dstOffset / (60*60)).format('h:mm:ssa'); //time.toUTCString();
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
          // call up the timezone data
          var tzInfoParams = {
            lat: data.coord.lat, 
            lon: data.coord.lon, 
            timestamp: data.dt, 
            http: http,
            log: log,
            scope: scope
          };
          services.fetchTZInfo(tzInfoParams);
          
          // Apply other scope data
          scope.sunriseData = data.sys.sunrise;
          scope.sunsetData  = data.sys.sunset;
          scope.main = data.main;
          scope.wind = data.wind;
          scope.currentCity = data.name;
          scope.description = data.weather[0].description;
          scope.currentIcon = 'http://openweathermap.org/img/w/'+data.weather[0].icon+'.png';
          scope.mapLink = 'http://maps.google.com/?ie=UTF8&hq=&ll='+data.coord.lat+','+data.coord.lon+'&z=15';
          //console.log('Current');
          //console.log(data);
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
            data.list[key].forecastIcon = 'http://openweathermap.org/img/w/'+data.list[key].weather[0].icon+'.png';
            i++;
          });

          scope.days = data.list;

          console.log('Forecast');
          console.log(data);
        })
        .error(function(data, status, headers, config) {
          // Log an error
          log.error('Cound not retrieve forecast data from ' + url);
        });
      };

      return services;
    }]);

} (window.angular));
