angular.module('sweaterweather.controllers', [])

.controller('HomeCtrl', ['$scope', '$timeout', '$http', function ($scope, $timeout, $http) {
    $scope.isLoading = true;
    $timeout(function () {
        $scope.isLoading = false;
    },
    1000);
}])

.controller('LoginCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.submit = function() {
        var credentials = {
            login: $scope.username,
            password: $scope.password
        };
        Hull.login(credentials).then(function (me) {
            console.log("You're logged in as ", me.email);
            $location.path('/projects');
        }, function (error) {
            console.log("Ooops, something went wrong", error.message);
        });
    };
}])

.controller('RegisterCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.submit = function() {
        var user = {
            name: $scope.name,
            email: $scope.email,
            password: $scope.password
        }
        Hull.signup(user).then(function(user) {
            console.log('Hello ' + user.name);
            $location.path('/register/client/3rd_party');
        }, function(error) {
            console.log(error.message);
        });
    };
}])

.controller('3rdPartyCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $("#venmo_button").click(function(){
        if ($("#venmo_alert").hasClass('hidden')) {
            $("#venmo_alert").transition('fade');
        }
    });

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    var venmoToken = getParameterByName('access_token');
    if (venmoToken != "") {
        $http.get('https://api.venmo.com/v1/me?access_token=' + venmoToken)
        .success(function(data, status, headers, config) {
            // clear the error messages
            $scope.error = '';
            console.log(JSON.parse(data));

            $location.path('/register/client/confirmation');
        })
        .error(function(data, status, headers, config) {
            $scope.error = 'Error: ' + status;
        });
    }
}])

.controller('DashboardCtrl', ['$scope', '$http', function ($scope, $http) {
    $('#sidebar_btn').show();
    $('#sidebar_btn').on('click', function() {
        $('.dashboard').sidebar('toggle');
    });
    $('#budget_bar').progress({
      percent: 76
    });
}])

.controller('AppCtrl', function AppCtrl($scope, $http) {
    // initialize the model
    $scope.user = 'angular';
    $scope.repo = 'angular.js';

    // helper for formatting date
    var humanReadableDate = function (d) {
        return d.getUTCMonth()+1 + '/' + d.getUTCDate();
    };

    // helper for reformatting the Github API response into a form we can pass to D3
    var reformatGithubResponse = function (data) {
        // sort the data by author date (rather than commit date)
        data.sort(function (a, b) {
            if (new Date(a.commit.author.date) > new Date(b.commit.author.date)) {
                return -1;
            } else {
                return 1;
            }
        });

        // date objects representing the first/last commit dates
        var date0 = new Date(data[data.length - 1].commit.author.date);
        var dateN = new Date(data[0].commit.author.date);

        // the number of days between the first and last commit
        var days = Math.floor((dateN - date0) / 86400000) + 1;

        // map authors and indexes
        var uniqueAuthors = []; // map index -> author
        var authorMap = {}; // map author -> index
        data.forEach(function (datum) {
            var name = datum.commit.author.name;
            if (uniqueAuthors.indexOf(name) === -1) {
                authorMap[name] = uniqueAuthors.length;
                uniqueAuthors.push(name);
            }
        });

        // build up the data to be passed to our d3 visualization
        var formattedData = [];
        formattedData.length = uniqueAuthors.length;
        var i, j;
        for (i = 0; i < formattedData.length; i++) {
            formattedData[i] = [];
            formattedData[i].length = days;
            for (j = 0; j < formattedData[i].length; j++) {
                formattedData[i][j] = {
                    x: j,
                    y: 0
                };
            }
        }
        data.forEach(function (datum) {
            var date = new Date(datum.commit.author.date);
            var curDay = Math.floor((date - date0) / 86400000);
            formattedData[authorMap[datum.commit.author.name]][curDay].y += 1;
            formattedData[0][curDay].date = humanReadableDate(date);
        });

        // add author names to data for the chart's key
        for (i = 0; i < uniqueAuthors.length; i++) {
            formattedData[i][0].user = uniqueAuthors[i];
        }

        return formattedData;
    };

    $scope.getCommitData = function () {
        $http({
            method: 'GET',
            url:'https://api.github.com/repos/' +
            $scope.user +
            '/' +
            $scope.repo +
            '/commits'
        }).
        success(function (data) {
            // attach this data to the scope
            $scope.data = reformatGithubResponse(data);

            // clear the error messages
            $scope.error = '';
        }).
        error(function (data, status) {
            if (status === 404) {
                $scope.error = 'That repository does not exist';
            } else {
                $scope.error = 'Error: ' + status;
            }
        });
    };

    // get the commit data immediately
    $scope.getCommitData();
});
