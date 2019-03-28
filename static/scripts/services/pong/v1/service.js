app.factory("PongV1Service", [
  function() {
    let svc = {};

    let initialWidth = 768;
    let initialHeight = 512;

    let ballSize = 8;

    let initialBallVelocityX = 200;
    let initialBallVelocityY = 0;

    let paddleWidth = 8;
    let paddleHeight = 64;

    let ball;
    let paddles;
    let player1;
    let player2;

    let matchInProgress;

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
      matchInProgress = false;

      ball = createBall(this);

      let paddleOffset = 16 + paddleWidth * 0.5;
      let scoreOffset = this.physics.world.bounds.width * 0.25;

      paddles = createPaddles(this);

      player1 = createPlayer(this, paddleOffset, scoreOffset);
      player2 = createPlayer(
        this,
        this.physics.world.bounds.width - paddleOffset,
        this.physics.world.bounds.width - scoreOffset
      );

      this.input.keyboard.on("keydown-SPACE", function(event) {
        pressSpacebar(event, this);
      });

      this.input.on(
        "pointermove",
        function(pointer) {
          movePaddleTowardsPointer(this, pointer, player2);
        },
        this
      );
    }

    function update() {
      movePaddleTowardsPointer(this, this.input.mousePointer, player2);
    }

    function createPaddles(gameCtx) {
      let response = gameCtx.physics.add.group();
      gameCtx.physics.add.collider(response, ball);
      return response;
    }

    function createBall(gameCtx) {
      let response = gameCtx.add.tileSprite(
        gameCtx.physics.world.bounds.centerX,
        gameCtx.physics.world.bounds.centerY,
        ballSize,
        ballSize,
        "tile-white"
      );

      gameCtx.physics.add.existing(response, false);
      response.body.setCollideWorldBounds(true);
      response.body.setBounce(1.0, 1.0);

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
      let response = gameCtx.add.tileSprite(
        positionX,
        gameCtx.physics.world.bounds.height * 0.5,
        paddleWidth,
        paddleHeight,
        "tile-white"
      );

      gameCtx.physics.add.existing(response, false);

      paddles.add(response);

      //  SCK: Need to reset these after adding to group, can this be done on group ?
      response.body.setCollideWorldBounds(true);
      response.body.setImmovable(true);

      return response;
    }

    function createScoreText(gameCtx, positionX, score) {
      let response = gameCtx.add.text(positionX, 64, score, { fontFamily: "Arial", fontSize: "64px", color: "#ffffff" });
      response.setOrigin(0.5);
      return response;
    }

    function startMatch(gameCtx) {
      if (!matchInProgress) {
        ball.body.setVelocity(initialBallVelocityX, initialBallVelocityY);
        matchInProgress = true;
      }
    }

    function reset(gameCtx) {
      if (matchInProgress) {
        ball.body.setVelocity(0, 0);
        ball.setPosition(gameCtx.physics.world.bounds.centerX, gameCtx.physics.world.bounds.centerY);
        matchInProgress = false;
      }
    }

    function pressSpacebar(gameCtx, event) {
      startMatch(gameCtx);
    }

    function movePaddleTowardsPointer(gameCtx, pointer, player) {
      player.paddle.y = pointer.y;
    }

    svc.start = function(parent) {
      svc.config.parent = parent;
      svc.game = new Phaser.Game(svc.config);
    };

    return svc;
  }
]);
