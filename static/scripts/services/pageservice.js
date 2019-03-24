app.factory("PageService", [
  "$rootScope",
  function($rootScope) {
    let svc = {};

    svc.setTitle = function(newTitle) {
      $rootScope.title = newTitle;
    };

    return svc;
  }
]);
