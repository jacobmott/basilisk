import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;  
  
  constructor() {
    this.config = {
      type: Phaser.AUTO,
      height: 512,
      width: 512,
      scene: [ MainScene ],
      scale: {
        zoom: 2
      },
      parent: 'gameContainer',
      physics: {
        default: 'matter',
        matter: {
          debug: true,
          gravity: {y:0},
        }
      },
      plugins: {
        scene: [
          {
            plugin: PhaserMatterCollisionPlugin,
            key: 'matterCollision',
            mapping: 'matterCollision'
          }
        ]
      }
    };
  }  
  
  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
  }


}



class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'main' });
  }  
  player: Phaser.Physics.Matter.Sprite;
  inputKeys: any;
  playerVelocity: Phaser.Math.Vector2;
  readonly speed: number = 2.5;

  init(params: any): void {
    // TODO
    console.log('init method');
  }
  
  create() {
    this.player = new Phaser.Physics.Matter.Sprite(this.matter.world, 0, 0, 'female', 'townsfolk_f_idle_1');
    this.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.add.existing(this.player);
  }  
  
  preload() {
    this.load.atlas('female', 'assets/images/townsfolk_female.png', 'assets/images/townsfolk_female_atlas.json');
    this.load.animation('townsfolk_female_animation', 'assets/images/townsfolk_female_anim.json', 'townsfolk_female_animation');
  } 
  
  update(time: integer) {    
    this.player.anims.currentFrame = 0; 
    this.player.play('townsfolk_female_walk', false);
    this.playerVelocity = new Phaser.Math.Vector2();
    if(this.inputKeys.left.isDown){
      this.playerVelocity.x = -1;
    }
    else if(this.inputKeys.right.isDown){
      this.playerVelocity.x = 1;
    }
    if(this.inputKeys.up.isDown){
      this.playerVelocity.y = -1;
    }
    else if(this.inputKeys.down.isDown){
      this.playerVelocity.y = 1;
    }
    this.playerVelocity.normalize();
    this.playerVelocity.scale(this.speed);
    this.player.setVelocity(this.playerVelocity.x, this.playerVelocity.y);
  }
}
