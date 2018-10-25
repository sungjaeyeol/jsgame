var width = 1500;
var height = 605;
var game = new Phaser.Game(width, height, Phaser.AUTO);

var TEST = {
    preload: function () {
        game.load.image('floor', 'floor.png'); //140 *25
        game.load.spritesheet('player', 'player.png', 54, 70, 8);
        game.load.image('bg', 'bg.png'); //1500*600
        game.load.image('fence', 'fence.png'); //120*120
    },
    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 3000;

        this.score = 0;

        this.Akey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.Dkey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.Jkey = game.input.keyboard.addKey(Phaser.Keyboard.J);
        this.Kkey = game.input.keyboard.addKey(Phaser.Keyboard.K);
        this.Lkey = game.input.keyboard.addKey(Phaser.Keyboard.L);
        this.Skey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        game.stage.backgroundColor = "#000000";

        this.bg1 = game.add.sprite(0, 0, 'bg');
        this.bg2 = game.add.sprite(width, 0, 'bg');

        this.sprite = game.add.sprite(250, 350, 'player');
        this.sprite.animations.add('walk');
        this.sprite.animations.play('walk', 20, true);
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.collideWorldBounds = true;

        this.floorGroup = game.add.group();
        this.floorGroup.enableBody = true;
        this.floorGroup.physicsBodyType = Phaser.Physics.ARCADE;

        for (let i = 0; i * 140 <= 1500; i++) {
            let temp = this.floorGroup.create(i * 140, height - 25, 'floor');
            temp.body.allowGravity = false;
            temp.body.immovable = true;
        }

        this.fenceGroup = game.add.group();
        this.fenceGroup.enableBody = true;
        this.fenceGroup.physicsBodyType = Phaser.Physics.ARCADE;


        for (let i = 0; i < 4; i++) {
            let temp = this.fenceGroup.create(width + 240, 140 * i + 10, 'fence');
            temp.body.allowGravity = false;
            temp.body.immovable = true;
        }

        let i = Math.floor(Math.random() * this.fenceGroup.length);
        this.fenceGroup.children[i].visible = false;


        this.scoreText = game.add.text(15, 5, "score : 0", {
            font: "35px Arial",
            fill: "#E874FF",
            align: "center"
        });
        this.scoreText.anchor.setTo(0, 0);

    },
    update: function () {
        game.physics.arcade.collide(this.sprite, this.floorGroup);
        game.physics.arcade.collide(this.sprite, this.fenceGroup, function (obj1, obj2) {
            game.state.start('MAIN');
        });

        if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            this.sprite.body.velocity.y += 500;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.J) && this.sprite.body.touching.down) {
            this.sprite.body.velocity.y -= 1100;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.K) && this.sprite.body.touching.down) {
            this.sprite.body.velocity.y -= 1450;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.L) && this.sprite.body.touching.down) {
            this.sprite.body.velocity.y -= 1750;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            this.sprite.body.velocity.x -= 12;
            if (this.sprite.body.velocity.x > 0) {
                this.sprite.body.velocity.x -= 12;
            }
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.sprite.body.velocity.x += 12;
            if (this.sprite.body.velocity.x < 0) {
                this.sprite.body.velocity.x += 12;
            }
        }
        if (!((game.input.keyboard.isDown(Phaser.Keyboard.A)) || (game.input.keyboard.isDown(Phaser.Keyboard.D)))) {
            this.sprite.body.velocity.x *= 0.9;
            if (Math.abs(this.sprite.body.velocity.x) <= 0.1) {
                this.sprite.body.velocity.x = 0;
            }
        }
        this.bg1.x -= 5;
        this.bg2.x -= 5;
        for (let i = 0; i < this.fenceGroup.length; i++) {
            this.fenceGroup.children[i].body.velocity.x = -1100;
        }

        if (this.bg1.x <= 0 - width) {
            this.bg1.x += width * 2;
        }
        if (this.bg2.x <= 0 - width) {
            this.bg2.x += width * 2;
        }
        if (this.fenceGroup.children[0].x < -240) {
            for (let i = 0; i < this.fenceGroup.length; i++) {
                this.fenceGroup.children[i].x = width;
                this.fenceGroup.children[i].visible = true;
            }
            let i = Math.floor(Math.random() * this.fenceGroup.length);
            this.fenceGroup.children[i].visible = false;
            this.score++;
            this.scoreText.setText("score : " + this.score);
        }
    }
};



var MAIN = {
    preload: function () {
        game.load.image('gameover', 'gameover.png'); //1500 *600
    },
    create: function () {
        this.gmaeover = game.add.sprite(0, 0, 'gameover');
        this.spacekey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        alert('PRESS \'SPACEBAR\' TO TRY AGAIN');
    },
    update: function () {
        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            game.state.start('TEST');
        }
    }
};
game.state.add('TEST', TEST);
game.state.add('MAIN', MAIN);
game.state.start('TEST');