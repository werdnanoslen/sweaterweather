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
    otherwise({
        redirectTo: '/home'
    });
}]);
