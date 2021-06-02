import { Component, OnInit } from "@angular/core";
import Phaser from "phaser";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import MainScene from "./MainScene";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit {
  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      height: 512,
      width: 512,
      backgroundColor: "#999999",
      scene: [MainScene],
      scale: {
        zoom: 2,
      },
      parent: "gameContainer",
      physics: {
        default: "matter",
        matter: {
          debug: true,
          gravity: { y: 0 },
        },
      },
      plugins: {
        scene: [
          {
            plugin: PhaserMatterCollisionPlugin,
            key: "matterCollision",
            mapping: "matterCollision",
          },
        ],
      },
    };
  }

  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
  }
}
