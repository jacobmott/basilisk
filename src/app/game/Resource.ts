import Phaser from "phaser";
import MatterEntity from "./MatterEntity";

export default class Resource extends MatterEntity {
  phaserPhysics: Phaser.Physics.Matter.MatterPhysics;
  health: number;
  scene: Phaser.Scene;
  sound: Phaser.Sound.BaseSound;
  name: string;

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
    let drops = JSON.parse(
      resource.properties.find((p) => p.name == "drops").value
    );
    let depth = resource.properties.find((p) => p.name == "depth").value;
    super({
      scene,
      x: resource.x,
      y: resource.y,
      texture: "resources",
      frame: resource.type,
      drops,
      depth,
      health: 5,
      name: resource.type,
    });
    this.scene = scene;
    this.phaserPhysics = new Phaser.Physics.Matter.MatterPhysics(scene);

    const Bodies = this.phaserPhysics.bodies;
    let yOrigin = resource.properties.find((p) => p.name == "yOrigin").value;
    this.name = resource.type;
    this.y = this.y + this.height * (yOrigin - 0.5);
    let collider = Bodies.circle(this.x, this.y, 12, {
      isSensor: false,
      label: "collider",
    });
    this.setExistingBody(collider);
    this.setStatic(true);
    this.setOrigin(0.5, yOrigin);
  }
}
