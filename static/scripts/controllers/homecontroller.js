app.controller("HomeController", [
  "$scope",
  "PageService",
  function($scope, pageService) {
    let ctrl = this;

    pageService.setTitle("Home");
  }
]);
