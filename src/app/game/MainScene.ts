import Phaser from "phaser";
import Player from "./Player";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }
  player: Player;
  testPlayer: Player;

  init(params: any): void {
    // TODO
    console.log("init method");
  }

  create() {
    this.testPlayer = new Player({
      scene: this,
      x: 100,
      y: 100,
      texture: "townsfolk_female",
      frame: "townsfolk_f_idle_1",
    });

    this.player = new Player({
      scene: this,
      x: 50,
      y: 50,
      texture: "townsfolk_female",
      frame: "townsfolk_f_idle_1",
    });

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage(
      "RPG Nature Tileset",
      "tiles",
      32,
      32,
      0,
      0
    );
    const layer1 = map.createLayer("Tile Layer 1", tileset);
    const layer2 = map.createLayer("Tile Layer 2", tileset);

    layer1.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer1);

    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
    this.add.existing(this.player);
    this.add.existing(this.testPlayer);
  }

  preload() {
    Player.preload(this);
    this.load.image("tiles", "assets/images/RPG Nature Tileset.png");
    this.load.tilemapTiledJSON("map", "assets/images/map.json");
  }

  update(time: integer) {
    this.player.update(time);
  }
}
