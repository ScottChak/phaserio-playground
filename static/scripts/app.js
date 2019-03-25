let app = angular.module("PhaserIoPlayground", ["ui.router"]);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state("home", {
    url: "",
    templateUrl: "../templates/home.html",
    controller: "HomeController as ctrl"
  });

  //  Official Phaser 3
  $stateProvider.state("official", {
    url: "/official",
    abstract: true
  });

  $stateProvider.state("official.gettingstarted", {
    url: "/gettingstarted",
    templateUrl: "../templates/official/gettingstarted.html",
    controller: "OfficialGettingStartedController as ctrl"
  });

  $stateProvider.state("official.firstgame", {
    url: "/firstgame",
    templateUrl: "../templates/official/firstgame.html",
    controller: "OfficialFirstGameController as ctrl"
  });

  //  Pong
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
