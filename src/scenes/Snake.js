class Snake extends Phaser.Scene {
    constructor(){
        super("playSnakeScene");
    }

create (){
    var snakeplayer;
    var food;
    var cursors;
    keyY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);
    keyN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
    
    //I couldn't find a way to get the sound to work so I commented
    //all sound-related code out.
    //var ctx = new AudioContext();
    
    //  Direction consts
    var UP = 0;
    var DOWN = 1;
    var LEFT = 2;
    var RIGHT = 3;
    this.scoreConfig = {
        fontFamily: 'Courier',
        fontSize: '16px',
        backgroundColor: '#000000',
        color: '#DFDFDF',
        align: 'right',
          padding: {
            top: 5,
            bottom: 5,
          },
        fixedWidth: 0
      }
      this.gameovertext1 = this.add.text(game.config.width/2, game.config.height/2, '', this.scoreConfig).setOrigin(0.5);
      this.gameovertext2 = this.add.text(game.config.width/2, game.config.height/2 + 32, '', this.scoreConfig).setOrigin(0.5);
      this.gameovertext3 = this.add.text(game.config.width/2, game.config.height/2 + 64, '', this.scoreConfig).setOrigin(0.5);
    
    
    var Food = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Food (scene, x, y)
        {
            Phaser.GameObjects.Image.call(this, scene)

            this.setTexture('food');
            this.setPosition(x * 16, y * 16);
            this.setOrigin(0);

            this.total = 0;

            this.eatEffect = {
                frequency: 523.25,
                attack: 0.05,
                decay: 0.2,
                type: 'sine',
                volume: 3,
                pan: 0.8,
                pitchBend: 600,
                reverse: true,
                random: 100
            };

            scene.children.add(this);
        },

        eat: function ()
        {
            this.total++;

            //new Phaser.Sound.Dynamic.FX(ctx, this.eatEffect);
        }

    });

    var SnakePlayer = new Phaser.Class({

        initialize:

        function SnakePlayer (scene, x, y)
        {
            this.headPosition = new Phaser.Geom.Point(x, y);

            this.body = scene.add.group();

            this.head = this.body.create(x * 16, y * 16, 'body');
            this.head.setOrigin(0);

            this.alive = true;

            this.speed = 100;

            this.moveTime = 0;

            this.tail = new Phaser.Geom.Point(x, y);

            this.heading = RIGHT;
            this.direction = RIGHT;

            this.deathEffect = {
                frequency: 16,
                decay: 1,
                type: 'sawtooth',
                dissonance: 50
            };
        },

        update: function (time)
        {
            if (time >= this.moveTime)
            {
                return this.move(time);
            }
        },

        faceLeft: function ()
        {
            if (this.direction === UP || this.direction === DOWN)
            {
                this.heading = LEFT;
            }
        },

        faceRight: function ()
        {
            if (this.direction === UP || this.direction === DOWN)
            {
                this.heading = RIGHT;
            }
        },

        faceUp: function ()
        {
            if (this.direction === LEFT || this.direction === RIGHT)
            {
                this.heading = UP;
            }
        },

        faceDown: function ()
        {
            if (this.direction === LEFT || this.direction === RIGHT)
            {
                this.heading = DOWN;
            }
        },

        move: function (time)
        {
            /**
            * Based on the heading property (which is the direction the pgroup pressed)
            * we update the headPosition value accordingly.
            * 
            * The Math.wrap call allow the snakeplayer to wrap around the screen, so when
            * it goes off any of the sides it re-appears on the other.
            */
            switch (this.heading)
            {
                case LEFT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 40);
                    break;

                case RIGHT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 40);
                    break;

                case UP:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 30);
                    break;

                case DOWN:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 30);
                    break;
            }

            this.direction = this.heading;

            //  Update the body segments and place the last coordinate into this.tail
            Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1, this.tail);

            //  Check to see if any of the body pieces have the same x/y as the head
            //  If they do, the head ran into the body

            var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);

            if (hitBody)
            {
                console.log('dead');

                //  Game Over
                //new Phaser.Sound.Dynamic.FX(ctx, this.deathEffect);

                this.alive = false;

                return false;
            }
            else
            {
                //  Update the timer ready for the next movement
                this.moveTime = time + this.speed;

                return true;
            }
        },

        grow: function ()
        {
            var newPart = this.body.create(this.tail.x, this.tail.y, 'body');

            newPart.setOrigin(0);
        },

        collideWithFood: function (food)
        {
            if (this.head.x === food.x && this.head.y === food.y)
            {
                this.grow();

                food.eat();

                //  For every 5 items of food eaten we'll increase the snakeplayer speed a little
                if (this.speed > 20 && food.total % 5 === 0)
                {
                    this.speed -= 5;
                }

                return true;
            }
            else
            {
                return false;
            }
        },

        updateGrid: function (grid)
        {
            //  Remove all body pieces from valid positions list
            this.body.children.each(function (segment) {

                var bx = segment.x / 16;
                var by = segment.y / 16;

                grid[by][bx] = false;

            });

            return grid;
        }

    });

    this.food = new Food(this, 3, 4);

    this.snakeplayer = new SnakePlayer(this, 8, 8);

    //  Create our keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();
}

update (time, delta)
{
    if (!this.snakeplayer.alive)
    {
        this.gameovertext1.text = 'GAME OVER'
        this.gameovertext2.text = ('YOU REACHED A LENGTH OF ' + (this.food.total + 1));
        this.gameovertext3.text = 'DO YOU WANT TO TRY AGAIN? (Y/N)'

        if (Phaser.Input.Keyboard.JustDown(keyY)) {
            this.scene.restart();
          }

    if (Phaser.Input.Keyboard.JustDown(keyN)) {
        this.scene.wake('menuScene');
        this.scene.stop();
      }

        return;
    }

    /**
    * Check which key is pressed, and then change the direction the snakeplayer
    * is heading based on that. The checks ensure you don't double-back
    * on yourself, for example if you're moving to the right and you press
    * the LEFT cursor, it ignores it, because the only valid directions you
    * can move in at that time is up and down.
    */
    if (this.cursors.left.isDown)
    {
        this.snakeplayer.faceLeft();
    }
    else if (this.cursors.right.isDown)
    {
        this.snakeplayer.faceRight();
    }
    else if (this.cursors.up.isDown)
    {
        this.snakeplayer.faceUp();
    }
    else if (this.cursors.down.isDown)
    {
        this.snakeplayer.faceDown();
    }

    if (this.snakeplayer.update(time))
    {
        //  If the snakeplayer updated, we need to check for collision against food

        if (this.snakeplayer.collideWithFood(this.food))
        {
            this.repositionFood();
        }
    }
}

/**
* We can place the food anywhere in our 40x30 grid
* *except* on-top of the snakeplayer, so we need
* to filter those out of the possible food locations.
* If there aren't any locations left, they've won!
*
* @method repositionFood
* @return {boolean} true if the food was placed, otherwise false
*/
repositionFood ()
{
    //  First create an array that assumes all positions
    //  are valid for the new piece of food

    //  A Grid we'll use to reposition the food each time it's eaten
    var testGrid = [];

    for (var y = 0; y < 30; y++)
    {
        testGrid[y] = [];

        for (var x = 0; x < 40; x++)
        {
            testGrid[y][x] = true;
        }
    }

    this.snakeplayer.updateGrid(testGrid);

    //  Purge out false positions
    var validLocations = [];

    for (var y = 0; y < 30; y++)
    {
        for (var x = 0; x < 40; x++)
        {
            if (testGrid[y][x] === true)
            {
                //  Is this position valid for food? If so, add it here ...
                validLocations.push({ x: x, y: y });
            }
        }
    }

    if (validLocations.length > 0)
    {
        //  Use the RNG to pick a random food position
        var pos = Phaser.Math.RND.pick(validLocations);

        //  And place it
        this.food.setPosition(pos.x * 16, pos.y * 16);

        return true;
    }
    else
    {
        return false;
    }
}
}