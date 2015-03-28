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

      // Return the wind direction by cardinal coordinates
      services.windDirections = function(angle) {
        var range = []; // holds the current range
        var directions = {
          "North":           [348.75, 11.25],
          "North-northeast": [11.25, 33.75],
          "Northeast":       [33.75, 56.25],
          "East-northeast":  [56.25, 78.75],
          "East":            [78.75, 101.25],
          "East-southeast":  [101.25, 123.75],
          "Southeast":       [123.75, 146.25],
          "South-southeast": [146.25, 168.75],
          "South":           [168.75, 191.25],
          "South-southwest": [191.25, 213.75],
          "Southwest":       [213.75, 236.25],
          "West-southwest":  [236.25, 258.75],
          "West":            [258.75, 281.25],
          "West-northwest":  [281.25, 303.75],
          "Northwest":       [303.75, 326.25],
          "North-northwest": [326.25, 348.75]
        };

        for (var key in directions) {
          if (directions.hasOwnProperty(key)) {
            range = directions[key];
            // North is a special case
            if ((angle > range[0] || angle <= range[1]) && (angle > 348.75 || angle <= 11.25)) {
              return key;
            }
            else if (angle > range[0] && angle <= range[1]) {
              return key;
            }
          }
        }
      };

      services.windSpeed = function(scope) {
        if (scope.units == 'imperial') {
          scope.wind.speed = (scope.wind.speed * 2.23694);
          scope.wind.gust  = (scope.wind.gust * 2.23694);
          scope.wind.units = 'mph';
        }
        else {
          scope.wind.speed = (scope.wind.speed * 3.6);
          scope.wind.gust  = (scope.wind.gust * 3.6);
          scope.wind.units = 'kph';
        }
      };

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
          scope.main        = data.main;
          scope.main.units  = (scope.units == 'imperial') ? 'F' : 'C';
          scope.wind        = data.wind;
          scope.wind.dir    = services.windDirections(data.wind.deg); 
          scope.currentCity = data.name;
          scope.description = data.weather[0].description;
          scope.currentIcon = 'http://openweathermap.org/img/w/'+data.weather[0].icon+'.png';
          scope.mapLink     = 'http://maps.google.com/?ie=UTF8&hq=&ll='+data.coord.lat+','+data.coord.lon+'&z=15';
          
          services.windSpeed(scope);
          //console.log('Current');
          console.log(scope);
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
          //console.log('Forecast');
          //console.log(data);
        })
        .error(function(data, status, headers, config) {
          // Log an error
          log.error('Cound not retrieve forecast data from ' + url);
        });
      };

      return services;
    }]);

    //.directive('myClock', ['dateFilter']);

} (window.angular));
