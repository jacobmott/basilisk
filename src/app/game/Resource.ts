import Phaser from "phaser";
import DropItem from "./DropItem";

export default class Resource extends Phaser.Physics.Matter.Sprite {
  phaserPhysics: Phaser.Physics.Matter.MatterPhysics;
  health: number;
  scene: Phaser.Scene;
  sound: Phaser.Sound.BaseSound;
  name: string;
  drops: number[];

  static preload(scene: Phaser.Scene) {
    scene.load.atlas(
      "resources",
      "assets/images/resources.png",
      "assets/images/resources_atlas.json"
    );
    scene.load.audio("tree", "assets/audio/tree.wav");
    scene.load.audio("rock", "assets/audio/rock.wav");
    scene.load.audio("bush", "assets/audio/bush.wav");
    scene.load.audio("pickup", "assets/audio/pickup.ogg");
  }

  constructor(data) {
    let { scene, resource } = data;
    super(
      scene.matter.world,
      resource.x,
      resource.y,
      "resources",
      resource.type
    );
    this.health = 5;
    this.scene = scene;
    this.phaserPhysics = new Phaser.Physics.Matter.MatterPhysics(scene);
    this.scene.add.existing(this);
    this.name = resource.type;
    this.sound = this.scene.sound.add(this.name);

    const Body = this.phaserPhysics.body;
    const Bodies = this.phaserPhysics.bodies;

    this.drops = JSON.parse(
      resource.properties.find((p) => p.name == "drops").value
    );
    let yOrigin = resource.properties.find((p) => p.name == "yOrigin").value;
    this.name = resource.type;
    this.x += this.width / 2;
    this.y -= this.height / 2;
    this.y = this.y + this.height * (yOrigin - 0.5);
    let collider = Bodies.circle(this.x, this.y, 12, {
      isSensor: false,
      label: "collider",
    });
    this.setExistingBody(collider);
    //resourceItem.setFixedRotation();
    this.setStatic(true);
    this.setOrigin(0.5, yOrigin);
  }

  get dead() {
    return this.health <= 0;
  }

  hit() {
    if (this.sound) {
      this.sound.play();
    }
    this.health--;
    console.log(`Hitting: ${this.name} Health: ${this.health}`);
    if (this.dead) {
      this.drops.forEach((drop) => {
        console.log(drop);
        new DropItem({ scene: this.scene, x: this.x, y: this.y, frame: drop });
      });
    }
  }
}
