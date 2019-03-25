app.factory("PongV1Service", [
  function() {
    let svc = {};

    svc.config = {
      type: Phaser.AUTO,
      width: 768,
      height: 512,
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    };

    function preload() {}

    function create() {}

    function update() {}

    svc.start = function(parent) {
      svc.config.parent = parent;
      svc.game = new Phaser.Game(svc.config);
    };

    return svc;
  }
]);
