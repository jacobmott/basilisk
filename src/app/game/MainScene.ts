import Phaser from "phaser";
import Player from "./Player";
import Resource from "./Resource";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import Enemy from "./Enemy";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
    this.enemies = [];
  }
  player: Player;
  testPlayer: Player;
  map: Phaser.Tilemaps.Tilemap;
  matterCollision: any;
  enemies: Enemy[];

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
      1,
      2
    );
    const layer1 = this.map.createLayer("Tile Layer 1", tileset);
    const layer2 = this.map.createLayer("Tile Layer 2", tileset);

    layer1.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer1);

    this.map
      .getObjectLayer("Resources")
      .objects.forEach((resource) => new Resource({ scene: this, resource }));

    this.map
      .getObjectLayer("Enemies")
      .objects.forEach((enemy) =>
        this.enemies.push(new Enemy({ scene: this, enemy }))
      );

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
    let camera = this.cameras.main;
    camera.zoom = 2;
    camera.startFollow(this.player);
    camera.setLerp(0.1, 0.1);
    camera.setBounds(
      0,
      0,
      <number>this.game.config.width,
      <number>this.game.config.height
    );
  }

  preload() {
    this.load.image("tiles", "assets/images/RPG Nature Tileset-extruded.png");
    this.load.tilemapTiledJSON("map", "assets/images/map.json");
    Player.preload(this);
    Resource.preload(this);
    Enemy.preload(this);
  }

  update(time: number) {
    let time2 = time / 1000;
    //console.log("deltaTime: "+time/1000);
    this.player.update(time2);
    this.enemies.forEach((enemy) => {
      enemy.update(time2);
    });
  }
}
