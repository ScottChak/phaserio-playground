let app = angular.module("SocketIoApp", ["ui.router"]);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state("home", {
    url: "",
    templateUrl: "../templates/home.html",
    controller: "HomeController as ctrl"
  });

  $stateProvider.state("pong", {
    url: "/pong",
    abstract: true
  });

  $stateProvider.state("pong.v1", {
    url: "/v1",
    templateUrl: "../templates/pong/v1.html",
    controller: "PongV1Controller as ctrl"
  });

  $urlRouterProvider.when("/", "");
  $urlRouterProvider.otherwise("");
});
