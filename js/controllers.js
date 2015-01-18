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

    $scope.getTrelloData = function () {
        Trello.authorize({
            success: function() {
                var isLoggedIn = Trello.authorized();
                Trello.members.get("me", function(member){
                    Trello.get("members/me/boards", function(cards) {
                        $scope.data = cards;
                        $scope.visualize1(cards);
                        $scope.visualize2(cards);
                        console.log($scope.data);
                    });
                });
            },
            error: function(data) {
                console.log('trello error: ', data);
            }
        });
    };

    $scope.visualize1 = function(data) {
        var dataset = {
            tasks: [8, 3, 4, 5],
        };

        var width = 300,
        height = 300,
        radius = Math.min(width, height) / 2;

        var color = ["#f64747","#f5ab35","#70ceef", "#fff"];

        var pie = d3.layout.pie()
        .sort(null);

        var piedata = pie(dataset.tasks);

        var arc = d3.svg.arc()
        .innerRadius(radius - 100)
        .outerRadius(radius - 70);

        var svg = d3.select("#viz1")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var path = svg.selectAll("path")
        .data(piedata)
        .enter().append("path")
        .attr("fill", function(d, i) { return color[i]; })
        .attr("d", arc);

        svg.selectAll("text").data(piedata)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", function(d) {
            var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
            d.cx = Math.cos(a) * (radius - 75);
            return d.x = Math.cos(a) * (radius - 20);
        })
        .attr("y", function(d) {
            var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
            d.cy = Math.sin(a) * (radius - 75);
            return d.y = Math.sin(a) * (radius - 20);
        });

        svg.append("defs").append("marker")
        .attr("id", "circ")
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("refX", 3)
        .attr("refY", 3)
        .append("circle")
        .attr("cx", 3)
        .attr("cy", 3)
        .attr("r", 3);

        svg.selectAll("path.pointer").data(piedata).enter()
        .append("path")
        .attr("class", "pointer")
        .style("fill", "none")
        .style("stroke", "black")
        .attr("marker-end", "url(#circ)")
        .attr("d", function(d) {
            if(d.cx > d.ox) {
                return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
            } else {
                return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
            }
        });

        svg.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .style("font-size", "28px")
        .style("fill", "#838587")
        .text("15/20");

        svg.append("text")
        .attr("x", 0)
        .attr("y", "14px")
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "#838587")
        .text("tasks completed");

        svg.append("text")
        .attr("x", 0)
        .attr("y", "-100px")
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("font-size", "18px")
        .style("fill", "#838587")
        .text("Tasks");
    };

    $scope.visualize2 = function(data) {
        var dataset = {
            tasks: [9, 11, 15, 40],
        };

        var width = 300,
        height = 300,
        radius = Math.min(width, height) / 2;

        var color = ["#f64747","#f5ab35","#70ceef", "#fff"];

        var pie = d3.layout.pie()
        .sort(null);

        var piedata = pie(dataset.tasks);

        var arc = d3.svg.arc()
        .innerRadius(radius - 100)
        .outerRadius(radius - 70);

        var svg = d3.select("#viz2")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var path = svg.selectAll("path")
        .data(piedata)
        .enter().append("path")
        .attr("fill", function(d, i) { return color[i]; })
        .attr("d", arc);

        svg.selectAll("text").data(piedata)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", function(d) {
            var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
            d.cx = Math.cos(a) * (radius - 75);
            return d.x = Math.cos(a) * (radius - 20);
        })
        .attr("y", function(d) {
            var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
            d.cy = Math.sin(a) * (radius - 75);
            return d.y = Math.sin(a) * (radius - 20);
        });

        svg.append("defs").append("marker")
        .attr("id", "circ")
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("refX", 3)
        .attr("refY", 3)
        .append("circle")
        .attr("cx", 3)
        .attr("cy", 3)
        .attr("r", 3);

        svg.selectAll("path.pointer").data(piedata).enter()
        .append("path")
        .attr("class", "pointer")
        .style("fill", "none")
        .style("stroke", "black")
        .attr("marker-end", "url(#circ)")
        .attr("d", function(d) {
            if(d.cx > d.ox) {
                return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
            } else {
                return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
            }
        });

        svg.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .style("font-size", "28px")
        .style("fill", "#838587")
        .text("35/75");

        svg.append("text")
        .attr("x", 0)
        .attr("y", "14px")
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "#838587")
        .text("hours budgeted");

        svg.append("text")
        .attr("x", 0)
        .attr("y", "-100px")
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("font-size", "18px")
        .style("fill", "#838587")
        .text("Time");
    };

    // get the commit data immediately
    $scope.getTrelloData();
}]);
