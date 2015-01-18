angular.module('sweaterweather', [
    'ngRoute',
    'sweaterweather.controllers',
    'sweaterweather.services',
    'sweaterweather.directives'
])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
    }).
    when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
    }).
    when('/register/client/basic', {
        templateUrl: 'partials/register/client/basic.html',
        controller: 'RegisterCtrl'
    }).
    when('/register/client/3rd_party', {
        templateUrl: 'partials/register/client/3rd_party.html',
        controller: '3rdPartyCtrl'
    }).
    when('/register/client/confirmation', {
        templateUrl: 'partials/register/client/confirmation.html',
    }).
    when('/projects', {
        templateUrl: 'partials/project_listing.html',
    }).
    when('/dashboard', {
        templateUrl: 'partials/dashboard.html',
        controller: 'DashboardCtrl'
    }).
    when('/vis', {
        templateUrl: 'partials/vis.html',
        controller: 'AppCtrl'
    }).
    otherwise({
        redirectTo: '/home'
    });

    Hull.init({
        orgUrl: "https://56f8c7dd.hullapp.io",
        appId: "54b9cdba1c94bc6a43000975"
    }, function(hull, me, app, org){
        console.log('Success, Hull is ready.');
    }, function(error){
        console.error(error);
    });
}]);
