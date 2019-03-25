app.controller("OfficialGettingStartedController", [
  "$scope",
  "PageService",
  "OfficialGettingStartedService",
  function($scope, pageService, officialGettingStartedService) {
    let ctrl = this;

    pageService.setTitle("Official Phaser 3 - Getting Started");

    officialGettingStartedService.start("PhaserContainer");
    angular.element(".phaserWrapper").width(officialGettingStartedService.config.width);
  }
]);
