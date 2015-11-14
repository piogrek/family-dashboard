/**
 * Created by pg on 12/11/2015.
 */
angular.module("app.dash", ["ui.router"])
    .config(function config($stateProvider) {
        $stateProvider.state("index", {
            url: "",
            controller: "DashController as dash",
            templateUrl: "templates/dash.html"
        });


    })
    .filter('weatherCurrent', function() {
    return function(data){
        var time = 
    }
    })
    .factory('calData', function ($http) {
        return {
            getData: function () {
                return $http({
                    url: 'http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/352442?res=3hourly&key=68b93f0c-6480-4d85-ba96-a42f06142c39',
                    method: 'GET'
                })
            }
        }
    })
    .directive("calendar", function () {
        return {
            restrict: "E",
            templateUrl: "templates/calendar.html",
            link: function (scope) {
                console.log(scope);
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

    .controller("DashController", function DashController($scope, $http, calData) {
        var dash = this;
        $scope.forecast = [];
        calData.getData().success(function (data) {
            $scope.forecast = data;
        });
    })
;