<?php

try {
    $conn = new PDO (
        "sqlsrv:server = tcp:kn8snbwiz9.database.windows.net,1433; Database = sweaterweather",
        "sweaterweather",
        'jwBE!*BkQGsu!rzspQBCj9T$u5QWCjTY'
    );
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    print("Error connecting to SQL Server.");
    echo "<pre>";
    die(print_r($e));
    echo "</pre>";
}

?>

<!doctype html>
<html ng-app="MainApp">
  <head>
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
    <title>sweaterweather by gulp-angular-semantic-ui yeoman generator</title>

    <!-- build:css styles/style.css -->
    <!-- bower:css -->
    <link rel="stylesheet" href="../bower_components/semantic/dist/semantic.css" />
    <!-- endbower -->
    <link rel="stylesheet" href="styles/main.css">
    <!-- endbuild -->

  </head>
  <body>
    <h4 class="ui inverted black block header">sweaterweather</span></h4>

    <div class="ui top attached tabular menu">
        <tab-item id="'tab1'" text="'Tab 1'" active="true"></tab-item>
        <tab-item id="'tab2'" text="'Tab 2'"></tab-item>
    </div>

    <div class="ui bottom attached tab active segment tab1" ng-controller="MainCtrl">
        <div class="ui grid">
            <div class="ui form sixteen wide column ng-class: {loading: isLoading}">
                <h4 class="ui block top attached header">Insert Contact</h4>
                <div class="ui bottom attached secondary segment">
                    <div class="field">
                        <label>Name:</label>
                        <input type="text" ng-model="name">
                    </div>
                    <div class="field">
                        <label>Site:</label>
                        <input type="text" ng-model="site">
                    </div>
                    <div class="field">
                        <button class="ui button large primary" ng-click="insert()">Insert</button>
                    </div>
                </div>
            </div>
        </div>

        <table class="ui celled striped large table segment">
            <thead>
                <tr>
                    <th colspan="2">Contacts</th>
                </tr>
            </thead>
            <tbody>
                <tr ng-repeat="person in contacts track by person.name">
                    <td>{{person.name}}</td>
                    <td class="collapsing right aligned"><a href="http://{{person.site}}">{{person.site}}</a></td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="ui bottom attached tab segment tab2">
        <p>This is the tab 2 content</p>
    </div>


    <!-- build:js script.js -->
    <!-- bower:js -->
    <script src="../bower_components/angularjs/angular.js"></script>
    <!-- endbower -->
    <script src="scripts/app-service.js"></script>
    <script src="scripts/app-controller.js"></script>
    <script src="scripts/app-directives.js"></script>
    <script src="scripts/app.js"></script>
    <!-- endbuild -->
  </body>
</html>
