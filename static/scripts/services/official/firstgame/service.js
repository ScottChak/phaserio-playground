app.factory("OfficialFirstGameService", [
  function() {
    let svc = {};

    let initialWidth = 800;
    let initialHeight = 600;

    let playerVelocityXFactor = 0.2;
    let playerVelocityYFactor = 1.6;
    let gravityYFactor = 0.5;

    svc.config = {
      type: Phaser.AUTO,
      width: initialWidth,
      height: initialHeight,
      physics: {
        default: "arcade",
        arcade: {
          //  SCK: Base gravity for everything in the world
          gravity: { y: initialHeight * gravityYFactor },
          debug: false
        }
      },
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    };

    let cursors;

    let platforms;
    let player;
    let stars;
    let bombs;

    let score = 0;
    let scoreText;

    function preload() {
      this.load.image("sky", "assets/official/firstgame/sky.png");
      this.load.image("ground", "assets/official/firstgame/platform.png");
      this.load.image("star", "assets/official/firstgame/star.png");
      this.load.image("bomb", "assets/official/firstgame/bomb.png");

      this.load.spritesheet("dude", "assets/official/firstgame/dude.png", { frameWidth: 32, frameHeight: 48 });
    }

    function create() {
      //  SCK: Get input
      cursors = this.input.keyboard.createCursorKeys();

      //  SCK: Create the world
      createWorld(this);

      //  SCK: Create the player
      createPlayer(this);

      //  SCK: Create the stars
      createStars(this);

      //  SCK: Create the bombs
      createBombs(this);

      scoreText = this.add.text(16, 16, "Score: " + score, { fontSize: "32px" });
    }

    function update() {
      updatePlayerVelocity();
    }

    function createWorld(gameCtx) {
      gameCtx.add.image(400, 300, "sky");

      platforms = gameCtx.physics.add.staticGroup();
      platforms.create(600, 400, "ground");
      platforms.create(50, 250, "ground");
      platforms.create(750, 220, "ground");
      platforms
        .create(400, 568, "ground")
        .setScale(2)
        .refreshBody();
    }

    function createPlayer(gameCtx) {
      //  SCK: Create the player
      player = gameCtx.physics.add.sprite(100, 450, "dude");

      //  SCK: Player is heavier than bombs and stars
      player.body.setGravityY(svc.config.height * gravityYFactor);

      //  SCK: Player is animated
      gameCtx.anims.create({
        key: "left",
        frames: gameCtx.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });

      gameCtx.anims.create({
        key: "turn",
        frames: [{ key: "dude", frame: 4 }],
        frameRate: 20
      });

      gameCtx.anims.create({
        key: "right",
        frames: gameCtx.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
      });

      //  Player physics with the world
      player.setBounce(0.2);
      player.setCollideWorldBounds(true);
      gameCtx.physics.add.collider(player, platforms);
    }

    function createStars(gameCtx) {
      stars = gameCtx.physics.add.group({
        key: "star",
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
      });

      stars.children.iterate(function(child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });

      gameCtx.physics.add.collider(stars, platforms);
      gameCtx.physics.add.overlap(player, stars, collectStar, null, gameCtx);
    }

    function createBombs(gameCtx) {
      bombs = gameCtx.physics.add.group();
      gameCtx.physics.add.collider(bombs, platforms);
      gameCtx.physics.add.collider(player, bombs, hitBomb, null, gameCtx);
    }

    function collectStar(player, star) {
      //  SCK: Remove star
      star.disableBody(true, true);

      score += 10;
      scoreText.setText("Score: " + score);

      //  SCK: Reset stars if all collected
      if (stars.countActive(true) === 0) {
        stars.children.iterate(function(child) {
          child.enableBody(true, child.x, 0, true, true);
        });

        //  SCK: Spawn bomb
        spawnBomb();
      }
    }

    function spawnBomb() {
      var bombX = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

      var bomb = bombs.create(bombX, 16, "bomb");
      bomb.setCollideWorldBounds(true);
      bomb.setBounce(1);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }

    function hitBomb(player, bomb) {
      this.physics.pause();

      player.setTint(0xff0000);
      player.anims.play("turn");

      gameOver = true;
    }

    function updatePlayerVelocity() {
      //  SCK: Velocity X (Move left and right)
      if (cursors.left.isDown) {
        player.setVelocityX(-1 * svc.config.width * playerVelocityXFactor);
        player.anims.play("left", true);
      } else if (cursors.right.isDown) {
        player.setVelocityX(svc.config.width * playerVelocityXFactor);
        player.anims.play("right", true);
      } else {
        player.setVelocityX(0);
        player.anims.play("turn");
      }

      //  SCK: Velocity Y (Jump)
      if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-1 * playerVelocityYFactor * svc.config.height * gravityYFactor);
      }
    }

    svc.start = function(parent) {
      svc.config.parent = parent;
      svc.game = new Phaser.Game(svc.config);
    };

    return svc;
  }
]);
