app.controller("OfficialFirstGameController", [
  "$scope",
  "PageService",
  "OfficialFirstGameService",
  function($scope, pageService, officialFirstGameService) {
    let ctrl = this;

    pageService.setTitle("Official Phaser 3 - First Game");

    officialFirstGameService.start("PhaserContainer");
    angular.element(".phaserWrapper").width(officialFirstGameService.config.width);
  }
]);
