let app = angular.module("SocketIoApp", ["ui.router"]);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state("home", {
    url: "",
    templateUrl: "../templates/home.html",
    controller: "HomeController as ctrl"
  });

  $urlRouterProvider.when("/", "");
  $urlRouterProvider.otherwise("");
});
