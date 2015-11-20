/**
 * Created by pg on 12/11/2015.
 */
angular.module("app.dash", ["ui.router", "chart.js", "angularMoment", "angular-google-gapi"])
    .config(function config($stateProvider) {
        $stateProvider.state("index", {
            url: "",
            controller: "DashController as dash",
            templateUrl: "dash/dash.html"
        });


    })
    .run(['GAuth', 'GApi', 'GData', '$state', '$rootScope', '$window',
        function (GAuth, GApi, GData, $state, $rootScope) {

            $rootScope.gdata = GData;

            var CLIENT = '845543921486-j1noqtdnh0kfu4p9icqpme84plf81sfu.apps.googleusercontent.com';
            GApi.load('calendar', 'v3');

            GAuth.setClient(CLIENT);
            GAuth.setScope('https://www.googleapis.com/auth/calendar');

            GAuth.checkAuth().then(
                function () {
                    console.log('auth ok');
                },
                function () {
                    GAuth.login();
                    console.log('auth error');
                }
            );

        }
    ])
    .filter('weatherFuture', function () {
        return function (periods) {
            var todayDay = moment().format('YYYY-MM-DD') + 'Z'
            var today = _.filter(periods, function (period) {
                //console.log('future --', period.value , todayDay);
                return period.value !== todayDay;
            });
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
    .filter('weatherCode', function (weatherData) {
        return function (code) {
            return _.propertyOf(weatherData.codes)(code).name;
        }
    })
    .filter('weatherIcon', function (weatherData) {
        return function (code) {
            console.log('code', code);
            return _.propertyOf(weatherData.codes)(code).icon;
        }
    })
    .filter('weatherTime', function () {
        return function (minutes) {
            return parseInt(minutes) / 60;
        }
    })
    .factory('calData', function (GApi) {
        return {
            getData: function (plusDays) {
                var time = moment().format('YYYY-MM-DDThh:mm:ssZ');
                if (plusDays) {
                    time = moment().add('days', plusDays).format('YYYY-MM-DDT00:00:00Z');
                }
                return GApi.executeAuth('calendar', 'events.list', {
                    calendarId: "piogrek@gmail.com",
                    timeMin: time
                })
            },
            getDay: function (day) {
                var today = moment();
                today.add('days', day);
                var format = day ? 'YYYY-MM-DDT00:00:00Z' : 'YYYY-MM-DDThh:mm:ssZ';
                var time = today.format(format);
                var maxtime = today.format('YYYY-MM-DDT23:59:59Z');
                return GApi.executeAuth('calendar', 'events.list', {
                    calendarId: "piogrek@gmail.com",
                    timeMin: time,
                    timeMax: maxtime
                })
            }
        }
    })
    .factory('weatherData', function ($http) {
        return {
            getData: function () {
                return $http({
                    url: 'http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/352442?res=3hourly&key=68b93f0c-6480-4d85-ba96-a42f06142c39',
                    method: 'GET'
                })
            },
            getDaily: function () {
                return $http({
                    url: 'http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/352442?res=daily&key=68b93f0c-6480-4d85-ba96-a42f06142c39',
                    method: 'GET'
                })
            },
            codes: {
                "NA": "Not available",
                undefined: "Not available",
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
                11: {icon: 'wi wi-sprinkle', name: "Drizzle"},
                12: {icon: 'wi wi-sprinkle', name: "Light rain"},
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
            templateUrl: "dash/calendar.html",
            link: function (scope) {
            }
        }
    })
    .directive("clock", function () {
        return {
            restrict: "E",
            templateUrl: "dash/clock.html",
            link: function (scope) {
            }
        }
    })
    .directive("news1", function () {
        return {
            restrict: "E",
            templateUrl: "dash/news1.html",
            link: function (scope) {

            }
        }
    })
    .directive("news2", function () {
        return {
            restrict: "E",
            templateUrl: "dash/news2.html",
            link: function (scope) {

            }
        }
    })
    .directive("weather", function () {
        return {
            restrict: "E",
            templateUrl: "dash/weather.html",
            link: function (scope) {
            }
        }
    })
    .controller("DashController", function DashController($scope, $http, weatherData, calData, $timeout, $document, $window) {
        var dash = this;

        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };

        $document.bind("keypress", function (e) {
            $scope.keypressed = true;
            console.log('key class');
            $timeout(function () {
                $scope.keypressed = false;
            }, 5000);
        });

        $scope.forecast = {};
        var refreshWeather = function () {
            weatherData.getData().success(function (data) {
                $scope.forecast.hourly = data;


                var todayDay = moment().format('YYYY-MM-DD') + 'Z';
                var today = _.filter(data.SiteRep.DV.Location.Period, function (period) {
                    //console.log('today --', period.value , todayDay);
                    return period.value == todayDay;
                });

                var nowMinutes = moment().format('h');
                //console.log('today', today[0]);
                var now = _.max(today[0].Rep, function (rep) {
                    //console.log('today --', period);
                    return rep.$ <= nowMinutes;
                });
                //console.log('now', now);
                $scope.forecast.now = now;


                var labels = [],
                    temp = [],
                    temp2 = [],
                    rain = [],
                    wind = [];

                var _i = 0;
                _.each(data.SiteRep.DV.Location.Period, function (period) {
                    _.each(period.Rep, function (rep) {
                        _i++;
                        if (_i == 2) {
                            _i = 0;
                            return;
                        }
                        var time = rep.$ / 60 + ':00';
                        labels.push(time);
                        temp.push(rep.T);
                        temp2.push(rep.F);
                        rain.push(rep.Pp);
                        wind.push(rep.G);
                    });
                });

                $scope.forecast.temp = {
                    data: [temp, temp2],
                    labels: labels,
                    series: ['Temp', 'FeelsLike']
                }
                $scope.forecast.wind = {
                    data: [wind, rain],
                    labels: labels,
                    series: ['Wind', 'Rain %']
                }
            });

            $timeout(refreshWeather, 5 * 60 * 1000);
        }
        refreshWeather();

        $scope.calendar = {
            date: new Date(),
            items: []
        };
        var refreshCal = function () {
            var sanitizeCal = function (items) {
                _.each(items, function (item) {
                    if (!item.start.dateTime) {
                        item.start.dateTime = item.start.date + 'T00:00:00Z';
                    }
                });
            }

            calData.getDay(0).then(function (resp) {
                sanitizeCal(resp.items);
                $scope.calendar.today = resp.items;
            });

            calData.getDay(1).then(function (resp) {
                sanitizeCal(resp.items);
                $scope.calendar.tomorrow = resp.items;
            });
            calData.getData(2).then(function (resp) {
                sanitizeCal(resp.items);
                $scope.calendar.items = resp.items;
            });

            $timeout(refreshWeather, 1 * 60 * 1000);

        }
        refreshCal();

        var setTime = function () {
            $scope.time = {
                time: new Date()
            };
            $timeout(setTime, 1000);
        }
        setTime();

        $scope.reloadPage = function () {
            window.location.reload();
        }
        var timeout = 5 * 60 * 1000;

        var reloadTwitter = function () {
            $scope.reloadPage();
            //init twitter widgets
            $timeout(reloadTwitter, timeout);
        }

        $timeout(reloadTwitter, timeout);

        !function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (!d.getElementById(id)) {
                js = d.createElement(s);
                js.id = id;
                js.src = "//platform.twitter.com/widgets.js";
                fjs.parentNode.insertBefore(js, fjs);
            }
        }(document, "script", "twitter-wjs");


    })
;