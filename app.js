/**
 * Created by pg on 12/11/2015.
 */
angular.module("app.dash", ["ui.router", "angularMoment"])
    .config(function config($stateProvider) {
        $stateProvider.state("index", {
            url: "",
            controller: "DashController as dash",
            templateUrl: "templates/dash.html"
        });


    })
    .filter('weatherToday', function () {
        return function (periods) {
            var todayDay = moment().format('YYYY-MM-DD') + 'Z'
            var today = _.filter(periods, function (period) {
                //console.log('today --', period.value , todayDay);
                return period.value == todayDay;
            });
            //console.log('today', today);
            return today;
        }
    })
    .filter('weatherFuture', function () {
        return function (periods) {
            var todayDay = moment().format('YYYY-MM-DD') + 'Z'
            var today = _.filter(periods, function (period) {
                //console.log('future --', period.value , todayDay);
                return period.value != todayDay;
            });
            //console.log('future', today);
            return today;
        }
    })
    .filter('stats', function () {
        return function (reps, operator, code) {
            var compare = function (rep) {
                return parseFloat(_.propertyOf(rep)(code));
            }
            var result;
            if (operator == 'min') {
                result = _.min(reps, compare);
            } else {
                result = _.max(reps, compare);
            }
            return _.propertyOf(result)(code);
        }
    })
    .filter('weatherCode', function (calData) {
        return function (code) {
            return _.propertyOf(calData.codes)(code).name;
        }
    })
    .filter('weatherIcon', function (calData) {
        return function (code) {
            return _.propertyOf(calData.codes)(code).icon;
        }
    })
    .filter('weatherTime', function () {
        return function (minutes) {
            return parseInt(minutes) / 60;
        }
    })
    .factory('calData', function ($http) {
        return {
            getData: function () {
                return $http({
                    url: 'http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/352442?res=3hourly&key=68b93f0c-6480-4d85-ba96-a42f06142c39',
                    method: 'GET'
                })
            },
            codes: {
                "NA": "Not available",
                0: {icon: 'wi wi-night-clear', name: "Clear night"},
                1: {icon: 'wi wi-day-sunny', name: "Sunny day"},
                2: {icon: 'wi wi-night-alt-cloudy', name: "Partly cloudy (night)"},
                3: {icon: 'wi wi-day-cloudy', name: "Partly cloudy (day)"},
                4: {icon: 'wi wi-na', name: "Not used"},
                5: {icon: 'wi wi-day-fog', name: "Mist"},
                6: {icon: 'wi wi-day-fog', name: "Fog"},
                7: {icon: 'wi wi-cloudy', name: "Cloudy"},
                8: {icon: 'wi wi-cloud', name: "Overcast"},
                9: {icon: 'wi wi-night-alt-rain', name: "Light rain shower (night)"},
                10: {icon: 'wi wi-day-rain', name: "Light rain shower (day)"},
                11: {icon: 'wi wi-day-sprinkle', name: "Drizzle"},
                12: {icon: 'wi wi-day-sprinkle', name: "Light rain"},
                13: {icon: 'wi wi-showers', name: "Heavy rain shower (night)"},
                14: {icon: 'wi wi-rain', name: "Heavy rain shower (day)"},
                15: {icon: 'wi wi-rain', name: "Heavy rain"},
                16: {icon: 'wi wi-night-sleet', name: "Sleet shower (night)"},
                17: {icon: 'wi wi-day-sleet', name: "Sleet shower (day)"},
                18: {icon: 'wi wi-sleet', name: "Sleet"},
                19: {icon: 'wi wi-night-alt-hail', name: "Hail shower (night)"},
                20: {icon: 'wi wi-day-hail', name: "Hail shower (day)"},
                21: {icon: 'wi wi-night-alt-hail', name: "Hail"},
                22: {icon: 'wi wi-night-alt-snow', name: "Light snow shower (night)"},
                23: {icon: 'wi wi-day-snow', name: "Light snow shower (day)"},
                24: {icon: 'wi wi-day-snow', name: "Light snow"},
                25: {icon: 'wi wi-snow-wind', name: "Heavy snow shower (night)"},
                26: {icon: 'wi wi-snow-wind', name: "Heavy snow shower (day)"},
                27: {icon: 'wi wi-snow-wind', name: "Heavy snow"},
                28: {icon: 'wi wi-thunderstorm', name: "Thunder shower (night)"},
                29: {icon: 'wi wi-thunderstorm', name: "Thunder shower (day)"},
                30: {icon: 'wi wi-thunderstorm', name: "Thunder"}
            }
        }
    })
    .directive("calendar", function () {
        return {
            restrict: "E",
            templateUrl: "templates/calendar.html",
            link: function (scope) {
            }
        }
    })
    .directive("clock", function () {
        return {
            restrict: "E",
            templateUrl: "templates/clock.html",
            link: function (scope) {
            }
        }
    })
    .directive("weather", function () {
        return {
            restrict: "E",
            templateUrl: "templates/weather.html",
            link: function (scope) {
            }
        }
    })

    .controller("DashController", function DashController($scope, $http, calData, $timeout) {
        var dash = this;
        $scope.forecast = [];
        var refreshWeather = function () {
            calData.getData().success(function (data) {
                $scope.forecast = data;
                $timeout(refreshWeather, 1 * 60 * 1000);
            });
        }
        refreshWeather();

        var setTime = function () {
            $scope.time = {
                time: new Date()
            };
            $timeout(setTime, 1000);
        }
        setTime();
    })
;