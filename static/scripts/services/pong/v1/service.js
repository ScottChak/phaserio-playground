app.factory("PongV1Service", [
  function() {
    let svc = {};

    let initialWidth = 768;
    let initialHeight = 512;

    let ballSize = 8;

    let paddleWidth = 8;
    let paddleHeight = 64;

    let ball;
    let player1;
    let player2;

    svc.config = {
      type: Phaser.AUTO,
      width: initialWidth,
      height: initialHeight,
      physics: {
        default: "arcade",
        arcade: {
          debug: false
        }
      },
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    };

    function preload() {
      this.load.image("tile-white", "assets/pong/v1/tile-white.png");
    }

    function create() {
      ball = createBall(this);

      let paddleOffset = 16 + paddleWidth * 0.5;
      let scoreOffset = svc.config.width * 0.25;

      player1 = createPlayer(this, paddleOffset, scoreOffset);
      player2 = createPlayer(this, svc.config.width - paddleOffset, svc.config.width - scoreOffset);
    }

    function update() {}

    function createBall(gameCtx) {
      let response = gameCtx.add.tileSprite(svc.config.width * 0.5, svc.config.height * 0.5, ballSize, ballSize, "tile-white");

      gameCtx.physics.add.existing(response);
      response.body.setCollideWorldBounds(true);
      response.body.setBounce(1.0, 1.0);
      response.body.setVelocity(100, 100);

      return response;
    }

    function createPlayer(gameCtx, paddlePositionX, scorePositionX) {
      let player = {};
      player.score = 0;

      player.paddle = createPaddle(gameCtx, paddlePositionX);
      player.scoreText = createScoreText(gameCtx, scorePositionX, player.score);

      return player;
    }

    function createPaddle(gameCtx, positionX) {
      let response = gameCtx.add.tileSprite(positionX, svc.config.height * 0.5, paddleWidth, paddleHeight, "tile-white");

      gameCtx.physics.add.existing(response);
      response.body.setCollideWorldBounds(true);

      return response;
    }

    function createScoreText(gameCtx, positionX, score) {
      let response = gameCtx.add.text(positionX, 64, score, { fontFamily: "Arial", fontSize: "64px", color: "#ffffff" });
      response.setOrigin(0.5);
      return response;
    }

    svc.start = function(parent) {
      svc.config.parent = parent;
      svc.game = new Phaser.Game(svc.config);
    };

    return svc;
  }
]);
