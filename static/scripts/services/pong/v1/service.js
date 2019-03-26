app.factory("PongV1Service", [
  function() {
    let svc = {};

    let initialWidth = 768;
    let initialHeight = 512;

    let ballSize = 8;

    let initialBallVelocity = 100;

    let paddleWidth = 8;
    let paddleHeight = 64;

    let maxPaddleVelocity = 600;
    let minPaddleVelocity = 600;

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

      paddles = this.physics.add.group();
      this.physics.add.collider(paddles, ball);

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

    function createBall(gameCtx) {
      let response = gameCtx.add.tileSprite(
        gameCtx.physics.world.bounds.centerX,
        gameCtx.physics.world.bounds.centerY,
        ballSize,
        ballSize,
        "tile-white"
      );

      gameCtx.physics.add.existing(response);
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

      gameCtx.physics.add.existing(response);
      response.body.setCollideWorldBounds(true);

      paddles.add(response);

      return response;
    }

    function createScoreText(gameCtx, positionX, score) {
      let response = gameCtx.add.text(positionX, 64, score, { fontFamily: "Arial", fontSize: "64px", color: "#ffffff" });
      response.setOrigin(0.5);
      return response;
    }

    function startMatch(gameCtx) {
      if (!matchInProgress) {
        ball.body.setVelocity(initialBallVelocity, initialBallVelocity);
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
      let paddleVelocityDirection = pointer.y > player.paddle.y ? 1 : -1;

      let paddleVelocity = 0;

      let difference = Phaser.Math.Difference(pointer.y, player.paddle.y);
      if (difference > 16) {
        let paddleVelocityFactor = Phaser.Math.SmoothStep(difference, 0, maxPaddleVelocity);

        paddleVelocity = paddleVelocityFactor * maxPaddleVelocity;
        if (paddleVelocity < minPaddleVelocity && paddleVelocity < Phaser.Math.Difference(0, player.paddle.body.velocity.y)) {
          paddleVelocity = minPaddleVelocity;
        }
      }

      player.paddle.body.setVelocity(0, paddleVelocityDirection * paddleVelocity);
    }

    svc.start = function(parent) {
      svc.config.parent = parent;
      svc.game = new Phaser.Game(svc.config);
    };

    return svc;
  }
]);
