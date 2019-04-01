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

      createEvents(this);
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

      response.body.onWorldBounds = true;
      response.body.setCollideWorldBounds();
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
      response.body.setCollideWorldBounds();
      response.body.setImmovable();
      response.body.setMaxVelocity(0, gameCtx.physics.world.bounds.height * 2.0);

      return response;
    }

    function createScoreText(gameCtx, positionX, score) {
      let response = gameCtx.add.text(positionX, 64, score, { fontFamily: "Arial", fontSize: "64px", color: "#ffffff" });
      response.setOrigin(0.5);
      return response;
    }

    function createEvents(gameCtx) {
      gameCtx.input.keyboard.on("keydown-SPACE", function(event) {
        pressSpacebar(event, gameCtx);
      });

      gameCtx.input.on(
        "pointermove",
        function(pointer) {
          movePaddleTowardsPointer(gameCtx, pointer, player2);
        },
        gameCtx
      );

      gameCtx.physics.world.on("worldbounds", function(body) {
        if (body === ball.body) {
          if (body.right === body.world.bounds.width) {
            score(player1);
          } else if (body.left === 0) {
            score(player2);
          }
        }
      });
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

    function score(player) {
      player.score++;
      player.scoreText.setText(player.score);
      reset(player.paddle.body.world.scene);
    }

    function pressSpacebar(gameCtx, event) {
      startMatch(gameCtx);
    }

    function movePaddleTowardsPointer(gameCtx, pointer, player) {
      if (Phaser.Math.Difference(pointer.y, player.paddle.y) > 1) {
        let target = { x: player.paddle.x, y: pointer.y };

        let maxVelocity = gameCtx.physics.world.bounds.height * 2.0;
        let factorVelocity = Phaser.Math.Clamp(
          Phaser.Math.SmoothStep(Phaser.Math.Difference(pointer.y - player.paddle.y, 0), 0, 100),
          0.1,
          1.0
        );

        gameCtx.physics.moveToObject(player.paddle, target, factorVelocity * maxVelocity);
      } else {
        player.paddle.body.setVelocity(0, 0);
        player.paddle.y = Phaser.Math.Clamp(
          pointer.y,
          paddleHeight * 0.5,
          gameCtx.physics.world.bounds.height - paddleHeight * 0.5
        );
      }
    }

    svc.start = function(parent) {
      svc.config.parent = parent;
      svc.game = new Phaser.Game(svc.config);
    };

    return svc;
  }
]);
