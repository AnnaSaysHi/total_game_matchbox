class Menu extends Phaser.Scene {

  constructor() {
    super("menuScene");
  }

  preload() {
    // load audio
    this.load.audio('sfx_select', './assets/blip_select.wav');
    this.load.audio('sfx_explosion', './assets/explosion.wav');
    this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    this.load.image('food', './assets/snake/food.png');
    this.load.image('body', './assets/snake/body.png');
  }
  
  setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  checkCookie() {
    let init = this.getCookie("initialized");
    if (init != "yes") {
      this.setCookie("initialized", "yes", 365);
      this.setCookie("burned1", "no", 365);
      this.setCookie("burned2", "no", 365);
      this.setCookie("burned3", "no", 365);
    }
  }
  
  


    create() {
      let menuConfig = {
        fontFamily: 'Courier',
        fontSize: '28px',
        backgroundColor: '#000000',
        color: '#DFDFDF',
        align: 'center',
          padding: {
            top: 5,
            bottom: 5,
          },
        fixedWidth: 0
      }
      if(navigator.cookieEnabled){this.checkCookie()}
      this.holdingMatchbox = false;
      this.selection = 1;
      this.textNumber = 0;
      this.textList = ['Use the SPACEBAR to advance text.', 'You find yourself in an arcade.', 'There are two games and a table.', 'What do you do?', 'SNAKE        Credits        Table', 'You approach the table.', 'There is a matchbox on the table.', 'The matchbox reads\n\"Total Game Matchbox\".', 'The instructions on the\nback of the matchbox read:\n\"Use these matchs to destroy \nall games. Keep last match for\nthis matchbox. Return matchbox\n to this table when finished.\"', 'Pick up the matchbox? (Y/N)', 'Put back the matchbox? (Y/N)', 'Burn the game?(Y/N)', 'Burn the matchbox? (Y/N)', 'The game is burnt beyond recognition.', 'The matchbox is burnt\nbeyond recognition.', 'The match is damp and won\'t\nlight because cookies are turned off.', 'The game is now burning.', 'You set the matchbox on the table\n before burning it.', 'CREDITS\nTotal Art Matchbox: Ben Vautier\n\nPhaser port of snake: Phaser Examples\nhttps://phaser.io/examples/\nv3/category/games/snake\n\n Idea for game: Anna Perlow'];
      this.textbox1 = this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'Use the SPACEBAR to advance text.', menuConfig).setOrigin(0.5);
      this.textbox2 = this.add.text(game.config.width/2, game.config.height - 96 - borderUISize - borderPadding, '', menuConfig).setOrigin(0.5);
      this.textbox3 = this.add.text(game.config.width/2, game.config.height/2 + 64 - borderUISize - borderPadding, '', menuConfig).setOrigin(0.5);
      menuConfig.backgroundColor = '#000000';
      menuConfig.color = '#000';

      // define keys
      keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
      keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
      keyY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);
      keyN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
      keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    

    update() {
      this.textbox1.text = this.textList[this.textNumber];
      switch(this.textNumber){
        case 4:
          this.textbox2.text = 'Use the arrow keys to navigate menus\nand SPACEBAR to make a selection.'
          this.textbox3.text = '^'
          if ((Phaser.Input.Keyboard.JustDown(keyLEFT)) && this.selection > 0){
            this.selection -= 1;
          }
          if ((Phaser.Input.Keyboard.JustDown(keyRIGHT)) && this.selection < 2){
            this.selection += 1;
          }
          this.textbox3.x = game.config.width/2 + ((this.selection - 1) * 240)
  
          if (Phaser.Input.Keyboard.JustDown(keySPACE)){
            if(this.selection == 0){
              if(this.getCookie("burned1") == "yes"){
                this.textNumber = 13;
                break;
              }else{
                if(this.holdingMatchbox){
                  this.textbox3.text = '';
                  this.textNumber = 11;
                  break;
                }else{
                  this.scene.sleep();
                  this.scene.launch('playSnakeScene')
                }
              }
            }
            if(this.selection == 1){
              this.textbox3.text = '';
              this.textNumber = 18;
              break;

            }
            if(this.selection == 2){
              this.textbox3.text = ''
              if(this.getCookie("burned3") == "yes"){
                this.textNumber = 14;
                break;
              }else{
                if(this.holdingMatchbox){
                  this.textNumber = 12
                }else{
                  this.textNumber = 5;
                }
              }
            }
  
          }
          break;
        case 9:
        case 10:
          if (Phaser.Input.Keyboard.JustDown(keyY)){   
            this.textNumber = 4;
            this.holdingMatchbox = !this.holdingMatchbox;
            this.textbox3.text = '^'
          } else if (Phaser.Input.Keyboard.JustDown(keyN)){  
            this.textNumber = 4;
            this.textbox3.text = '^'
          } 
          break;  
        case 11:
        case 12:
          if (Phaser.Input.Keyboard.JustDown(keyY)){   
            if(!navigator.cookieEnabled || this.getCookie("initialized") != "yes"){
              this.textNumber = 15;
            }else{
              this.textNumber += 5;
              if(this.textNumber == 17){
                this.holdingMatchbox = false;
                this.setCookie("burned3", "yes", 365)
              }
              if(this.textNumber == 16){
                if(this.selection == 0){
                  this.setCookie("burned1", "yes", 365)
                }
                else{
                  this.setCookie("burned2", "yes", 365)
                }
              }
            }
          } else if (Phaser.Input.Keyboard.JustDown(keyN)){  
            if(this.textNumber == 12){
              this.textNumber = 10;
            }else{
              this.textNumber = 4;
            }
          } 
          break;

        case 13:
        case 14:
        case 15:
        case 16:
        case 17:
        case 18:
        
          this.textbox3.text = ''
          if (Phaser.Input.Keyboard.JustDown(keySPACE)){
            this.textNumber = 4;
          }
          break;
        
        default:
          if (Phaser.Input.Keyboard.JustDown(keySPACE)){
            this.textNumber++;
          }
      }
    }
  }