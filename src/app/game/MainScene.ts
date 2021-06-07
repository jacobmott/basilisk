import Phaser from "phaser";
import Player from "./Player";
import Resource from "./Resource";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }
  player: Player;
  testPlayer: Player;
  map: Phaser.Tilemaps.Tilemap;
  matterCollision: any;

  init(params: any): void {
    // TODO
    console.log("init method");
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    this.map = map;
    const tileset = this.map.addTilesetImage(
      "RPG Nature Tileset",
      "tiles",
      32,
      32,
      0,
      0
    );
    const layer1 = this.map.createLayer("Tile Layer 1", tileset);
    const layer2 = this.map.createLayer("Tile Layer 2", tileset);

    layer1.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer1);

    this.map
      .getObjectLayer("Resources")
      .objects.forEach((resource) => new Resource({ scene: this, resource }));

    this.player = new Player({
      scene: this,
      x: 250,
      y: 250,
      texture: "townsfolk_female",
      frame: "townsfolk_f_idle_1",
    });

    //this.testPlayer = new Player({
    //  scene: this,
    //  x: 150,
    //  y: 150,
    //  texture: "townsfolk_female",
    //  frame: "townsfolk_f_idle_1",
    //});

    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  preload() {
    this.load.image("tiles", "assets/images/RPG Nature Tileset.png");
    this.load.tilemapTiledJSON("map", "assets/images/map.json");
    Player.preload(this);
    Resource.preload(this);
  }

  update(time: integer) {
    this.player.update(time);
  }
}
