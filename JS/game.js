var game = new Phaser.Game(1280, 640, Phaser.CANVAS);

var gameState = 
{
    /**
     * @type {Phaser.Sprite}
     */
    player: null,

    /**
     * @type {Phaser.Physics.Arcade.Body}
     */
    playerBody: null,

    /**
     * @type {Phaser.Group}
     */
    blocks: null,

    hasJumpedMidAir: true,

    isSpliping: false,

    isSuperSanic: false,

    splipCounter: 0
};

gameState.preload = function() 
{
    game.load.tilemap('runground', 'assets/blahhh.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image("background", "assets/tide-pod-th.jpg");
    game.load.spritesheet("player", "assets/sanic.png", 64, 64);
    game.load.image("block", "assets/Block.png");
    game.load.image('TL1', 'assets/Grass (2).png');
}

var map;
var layer;
gameState.create = function()
{
    
    var bg = game.add.image(0, 0, "background");
    bg.width = game.width;
    bg.height = game.height;

    var blockSelect = game.add.image(0, 0, "block");
    blockSelect.width = 64;
    blockSelect.height = 64;

    var clickText = game.add.text(70, 40, "Click to Create Block");
    
    var jumpText = game.add.text(70, 100, "Press 'E' to jump, again to double-jump!");
    game.add.sprite(0, 64, "player", 3);

    var splipDashText = game.add.text(70, 160, "Press 'D' and 'G' or 'A' to Splip Dash!!");
    game.add.sprite(0, 110, "player", 7);

    var gFlipText = game.add.text(70, 290, "Press 'SPACE' to Flip Gravity!");
    game.add.sprite(0, 255, "player", 6);


    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.player = game.add.sprite(0, 0, "player", 0);
    game.physics.arcade.enable(this.player);
    this.playerBody = this.player.body;
    this.playerBody.gravity.y = 1000;
    this.playerBody.collideWorldBounds = true;
    this.playerBody.drag.x = 800;
    this.playerBody.mass = 10;

    this.blocks = game.add.group();
    this.blocks.enableBody = true;

    map = game.add.tilemap('runground');
    map.addTilesetImage('Grass (2)', 'TL1');
    layer = map.createLayer(0);
    map.setCollisionBetween(0, 3);
    layer.resizeWorld();
    
}

gameState.update = function()
{
    //game.physics.arcade.collide(this.player, this.blocks);
    game.physics.arcade.collide(this.player, layer);

    
    var kRight = game.input.keyboard.isDown(Phaser.KeyCode.RIGHT) || game.input.keyboard.isDown(Phaser.KeyCode.F);
    var kLeft = game.input.keyboard.isDown(Phaser.KeyCode.LEFT) || game.input.keyboard.isDown(Phaser.KeyCode.S);
    var kFastFall = game.input.keyboard.isDown(Phaser.KeyCode.D) || game.input.keyboard.isDown(Phaser.KeyCode.DOWN);
    var kJump = game.input.keyboard.downDuration(Phaser.KeyCode.E, 5);
    var kJumpUp = game.input.keyboard.downDuration(Phaser.KeyCode.R) || game.input.keyboard.downDuration(Phaser.KeyCode.SHIFT);
    var kFlip = game.input.keyboard.downDuration(Phaser.KeyCode.SPACEBAR);
    var kSplip = game.input.keyboard.downDuration(Phaser.KeyCode.G);
    var kSplip2 = game.input.keyboard.downDuration(Phaser.KeyCode.A);
    var friction = 10;
    var friction2 = 20;
    var goSuper = game.input.keyboard.downDuration(Phaser.KeyCode.P);

    if (goSuper)
    {
        this.isSuperSanic = true;
    }

    if (this.isSuperSanic == false)
    {
        if (kRight)
        {
            this.playerBody.acceleration.x = 500;
            this.playerBody.maxVelocity.x = 300;
            if (this.playerBody.onFloor())
            {
                this.player.frame = 1;
            }     
        }
        else if (this.playerBody.acceleration.x > 0)
        {
            this.playerBody.acceleration.x -= friction;
        }
        
        if (kLeft)
        {
            this.playerBody.acceleration.x = -500;
            
            if (this.playerBody.onFloor())
            {
                this.player.frame = 2;
            } 
        }
        else if (this.playerBody.acceleration.x < 0)
        {
            this.playerBody.acceleration.x += friction;
        }
    }
    else if (this.isSuperSanic == true)
    {
        if (kRight)
        {
            this.playerBody.acceleration.x = 2000;
            this.playerBody.maxVelocity.x = 3000;
            if (this.playerBody.onFloor())
            {
                this.player.frame = 1;
            }     
        }
        else if (this.playerBody.acceleration.x > 0)
        {
            this.playerBody.acceleration.x -= friction2;
        }
        
        if (kLeft)
        {
            this.playerBody.acceleration.x = -2000;
            
            if (this.playerBody.onFloor())
            {
                this.player.frame = 2;
            } 
        }
        else if (this.playerBody.acceleration.x < 0)
        {
            this.playerBody.acceleration.x += friction2;
        }
    }
    
    
    

    if (this.isSuperSanic == false)
    {
        if (kFastFall)
        {
            this.playerBody.velocity.y = 800;
            this.player.frame = 6;
            if (kSplip) //Progrsm as attack
            {
                this.playerBody.velocity.x = 700;
                this.isSpliping = true;
            }
            else if (kSplip2)
            {
                this.playerBody.velocity.x = -700;
                this.isSpliping = true;
            }
        }
    }
    else if (this.isSuperSanic == true)
    {
        if (kFastFall)
        {
            this.playerBody.velocity.y = 800;
            this.player.frame = 6;
            if (kSplip) //Progrsm as attack
            {
                this.playerBody.velocity.x = 1400;
                this.isSpliping = true;
            }
            else if (kSplip2)
            {
                this.playerBody.velocity.x = -1400;
                this.isSpliping = true;
            }
        }
    }

    if (this.isSpliping) 
    {
        if (this.isSuperSanic == false)
        {
            if (this.playerBody.velocity.x <= 700 && this.playerBody.velocity.x >= 0)
            {
                this.player.frame = 7;
            }
            else if (this.playerBody.velocity.x >= -700 && this.playerBody.velocity.x <= 0)
            {
                this.player.frame = 8;
            }
    
            this.splipCounter += 1;
            if (this.splipCounter >= 15)
            {
                this.isSpliping = false;
                this.splipCounter = 0;
            }
        }
        else if (this.isSuperSanic)
        {
            if (this.playerBody.velocity.x <= 1400 && this.playerBody.velocity.x >= 0)
            {
                this.player.frame = 7;
            }
            else if (this.playerBody.velocity.x >= -1400 && this.playerBody.velocity.x <= 0)
            {
                this.player.frame = 8;
            }
    
            this.splipCounter += 1;
            if (this.splipCounter >= 15)
            {
                this.isSpliping = false;
                this.splipCounter = 0;
            }
        }
    }

    var onGround = (this.playerBody.onFloor() || this.playerBody.touching.down);
    if (onGround)
    {
        this.hasJumpedMidAir = true;
    }

    if (kJump && (onGround || this.hasJumpedMidAir))
    {
        if (onGround)
        {
            if (this.isSuperSanic == false)
            {
                this.playerBody.velocity.y = -600;
            }
            else if (this.isSuperSanic == true)
            {
                this.playerBody.velocity.y = -1000
            }

            if (this.playerBody.velocity.x >= 5)
            {
                this.player.frame = 5;
            }
            else if (this.playerBody.velocity.x <= -5)
            {
                this.player.frame = 3;
            }
            else
            {
                this.player.frame = 3;
            }
        }
        else
        {
            this.hasJumpedMidAir = false;
            if (this.isSuperSanic == false)
            {
                this.playerBody.velocity.y = -475;
            }
            else if (this.isSuperSanic == true)
            {
                this.playerBody.velocity.y = -800;
            }
            this.player.frame = 0
        }
    } 

    


    
    
    if (kFlip)
    {
        this.playerBody.gravity.y *= -1;
    }

}

game.state.add('gamestate', gameState, true);