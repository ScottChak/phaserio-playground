app.factory("OfficialFirstGameService", [
  function() {
    let svc = {};

    svc.config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 300 },
          debug: false
        }
      },
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    };

    let player;
    let stars;
    let bombs;

    let score = 0;
    let scoreText;

    let cursors;

    function preload() {
      this.load.image("sky", "assets/official/firstgame/sky.png");
      this.load.image("ground", "assets/official/firstgame/platform.png");
      this.load.image("star", "assets/official/firstgame/star.png");
      this.load.image("bomb", "assets/official/firstgame/bomb.png");

      this.load.spritesheet("dude", "assets/official/firstgame/dude.png", { frameWidth: 32, frameHeight: 48 });
    }

    function create() {
      this.add.image(400, 300, "sky");

      let platforms = this.physics.add.staticGroup();
      platforms.create(600, 400, "ground");
      platforms.create(50, 250, "ground");
      platforms.create(750, 220, "ground");
      platforms
        .create(400, 568, "ground")
        .setScale(2)
        .refreshBody();

      player = this.physics.add.sprite(100, 450, "dude");
      player.body.setGravityY(300);
      player.setBounce(0.2);
      player.setCollideWorldBounds(true);

      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: "turn",
        frames: [{ key: "dude", frame: 4 }],
        frameRate: 20
      });

      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
      });

      this.physics.add.collider(player, platforms);

      stars = this.physics.add.group({
        key: "star",
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
      });

      stars.children.iterate(function(child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });

      this.physics.add.collider(stars, platforms);
      this.physics.add.overlap(player, stars, collectStar, null, this);

      bombs = this.physics.add.group();
      this.physics.add.collider(bombs, platforms);
      this.physics.add.collider(player, bombs, hitBomb, null, this);

      scoreText = this.add.text(16, 16, "Score: " + score, { fontSize: "32px", fill: "#000" });
      cursors = this.input.keyboard.createCursorKeys();
    }

    function update() {
      let playerVelocity = 160;

      if (cursors.left.isDown) {
        player.setVelocityX(-playerVelocity);
        player.anims.play("left", true);
      } else if (cursors.right.isDown) {
        player.setVelocityX(playerVelocity);
        player.anims.play("right", true);
      } else {
        player.setVelocityX(0);
        player.anims.play("turn");
      }

      if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-480);
      }
    }

    function collectStar(player, star) {
      star.disableBody(true, true);

      score += 10;
      scoreText.setText("Score: " + score);

      if (stars.countActive(true) === 0) {
        stars.children.iterate(function(child) {
          child.enableBody(true, child.x, 0, true, true);
        });

        var x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, "bomb");
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      }
    }

    function hitBomb(player, bomb) {
      this.physics.pause();

      player.setTint(0xff0000);
      player.anims.play("turn");

      gameOver = true;
    }

    svc.start = function(parent) {
      svc.config.parent = parent;
      svc.game = new Phaser.Game(svc.config);
    };

    return svc;
  }
]);
