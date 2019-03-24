app.factory("PongV1Service", [
  function() {
    let svc = {};

    svc.width = 768;
    svc.height = 512;

    svc.config = {
      type: Phaser.AUTO,
      width: svc.width,
      height: svc.height,
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
