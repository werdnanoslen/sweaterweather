angular.module('sweaterweather.controllers', [])

.controller('HomeCtrl', ['$scope', '$timeout', '$http', function ($scope, $timeout, $http) {
    $scope.isLoading = true;
    $timeout(function () {
        $scope.isLoading = false;
    },
    1000);
}]);
