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
            $scope.$apply();
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
            $scope.$apply();
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
            $scope.$apply();
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

    $('#demo_btn').on('click', function() {
        $('.ui.large.modal').modal('show');
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
        var w = 300,
        h = 300,
        r = 100,
        inner = 60,
        color = ["#f64747","#f5ab35","#70ceef", "#fff"];

        data = [{"label":"Admin", "value":3},
        {"label":"Design", "value":6},
        {"label":"Coding", "value":6},
        {"label":"", "value":5}];

        var total = d3.sum(data, function(d) {
            return d3.sum(d3.values(d));
        });

        var vis = d3.select("#viz")
        .append("svg:svg")
        .data([data])
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")
        .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

        var textTop = vis.append("text")
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .attr("class", "textTop")
        .text( "15/" + total )
        .attr('font-size', "28px")
        .attr('fill', '#838587')
        .attr("y", -10),
        textBottom = vis.append("text")
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .attr("class", "textBottom")
        .style("font-size", "10px")
        .style("fill", "#838587")
        .text("tasks completed")
        .attr("y", 10);

        var arc = d3.svg.arc()
        .innerRadius(inner)
        .outerRadius(r);

        var arcOver = d3.svg.arc()
        .innerRadius(inner + 5)
        .outerRadius(r + 5);

        var pie = d3.layout.pie()
        .value(function(d) { return d.value; })
        .sort(null);

        var arcs = vis.selectAll("g.slice")
        .data(pie)
        .enter()
        .append("svg:g")
        .attr("class", "slice")
        .on("mouseover", function(d) {
            d3.select(this).select("path").transition()
            .duration(200)
            .attr("d", arcOver)
            textTop.text( d3.select(this).datum().data.label )
            .attr('font-size', "28px")
            .attr('fill', '#838587')
            .attr("y", -10);
            textBottom.text(d3.select(this).datum().data.value + " tasks completed")
            .style("font-size", "10px")
            .style("fill", "#838587");
        })
        .on("mouseout", function(d) {
            d3.select(this).select("path").transition()
            .duration(100)
            .attr("d", arc);

            textTop.text( "15/" + total )
            .attr('font-size', "28px")
            .attr('fill', '#838587')
            .attr("y", -10);
            textBottom.text("tasks completed")
            .style("font-size", "10px")
            .style("fill", "#838587");
        });

        arcs.append("svg:path")
        .attr("fill", function(d, i) { return color[i]; } )
        .attr("d", arc);

        arcs.append("text")
        .attr("x", 0)
        .attr("y", "-120px")
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("font-size", "18px")
        .style("fill", "#838587")
        .text("Tasks");
    };

    $scope.visualize2 = function(data) {
        var w = 300,
        h = 300,
        r = 100,
        inner = 60,
        color = ["#f64747","#f5ab35","#70ceef", "#fff"];

        data = [{"label":"Admin", "value":5},
        {"label":"Design", "value":15},
        {"label":"Coding", "value":15},
        {"label":"", "value":40}];

        var total = d3.sum(data, function(d) {
            return d3.sum(d3.values(d));
        });

        var vis = d3.select("#viz")
        .append("svg:svg")
        .data([data])
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")
        .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

        var textTop = vis.append("text")
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .attr("class", "textTop")
        .text( "15/" + total )
        .attr('font-size', "28px")
        .attr('fill', '#838587')
        .attr("y", -10),
        textBottom = vis.append("text")
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .attr("class", "textBottom")
        .style("font-size", "10px")
        .style("fill", "#838587")
        .text("hours billed")
        .attr("y", 10);

        var arc = d3.svg.arc()
        .innerRadius(inner)
        .outerRadius(r);

        var arcOver = d3.svg.arc()
        .innerRadius(inner + 5)
        .outerRadius(r + 5);

        var pie = d3.layout.pie()
        .value(function(d) { return d.value; })
        .sort(null);

        var arcs = vis.selectAll("g.slice")
        .data(pie)
        .enter()
        .append("svg:g")
        .attr("class", "slice")
        .on("mouseover", function(d) {
            d3.select(this).select("path").transition()
            .duration(200)
            .attr("d", arcOver)
            textTop.text( d3.select(this).datum().data.label )
            .attr('font-size', "28px")
            .attr('fill', '#838587')
            .attr("y", -10);
            textBottom.text(d3.select(this).datum().data.value + " hours billed")
            .style("font-size", "10px")
            .style("fill", "#838587");
        })
        .on("mouseout", function(d) {
            d3.select(this).select("path").transition()
            .duration(100)
            .attr("d", arc);

            textTop.text( "15/" + total )
            .attr('font-size', "28px")
            .attr('fill', '#838587')
            .attr("y", -10);
            textBottom.text("hours billed")
            .style("font-size", "10px")
            .style("fill", "#838587");
        });

        arcs.append("svg:path")
        .attr("fill", function(d, i) { return color[i]; } )
        .attr("d", arc);

        arcs.append("text")
        .attr("x", 0)
        .attr("y", "-120px")
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("font-size", "18px")
        .style("fill", "#838587")
        .text("Time");

        // var legend = d3.select("#viz").append("svg")
        // .attr("class", "legend")
        // .attr("width", r)
        // .attr("height", r * 2)
        // .selectAll("g")
        // .data(data)
        // .enter().append("g")
        // .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
        //
        // legend.append("rect")
        // .attr("width", 18)
        // .attr("height", 18)
        // .style("fill", function(d, i) { return color(i); });
        //
        // legend.append("text")
        // .attr("x", 24)
        // .attr("y", 9)
        // .attr("dy", ".35em")
        // .text(function(d) { return d.label; });
    };

    // get the commit data immediately
    $scope.getTrelloData();
}]);
