app.controller("PongV1Controller", [
  "$scope",
  "PageService",
  "PongV1Service",
  function($scope, pageService, pongV1Service) {
    let ctrl = this;

    pageService.setTitle("Pong V1");

    pongV1Service.start("PhaserContainer");
    angular.element(".phaserWrapper").width(pongV1Service.config.width);
  }
]);
