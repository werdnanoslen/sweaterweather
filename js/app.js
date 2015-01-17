angular.module('sweaterweather', [
    'ngRoute',
    'sweaterweather.controllers',
    'sweaterweather.services',
    'sweaterweather.directives'
])

.config(['$routeProvider',function($routeProvider) {
    $routeProvider.
    when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
    }).
    when('/vis', {
        templateUrl: 'partials/vis.html',
        controller: 'AppCtrl'
    }).
    otherwise({
        redirectTo: '/home'
    });
}]);
