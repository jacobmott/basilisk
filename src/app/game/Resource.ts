import Phaser from "phaser";

export default class Resource extends Phaser.Physics.Matter.Sprite {
  phaserPhysics: Phaser.Physics.Matter.MatterPhysics;

  static preload(scene: Phaser.Scene) {
    scene.load.atlas(
      "resources",
      "assets/images/resources.png",
      "assets/images/resources_atlas.json"
    );
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
    this.phaserPhysics = new Phaser.Physics.Matter.MatterPhysics(scene);
    this.scene.add.existing(this);

    const Body = this.phaserPhysics.body;
    const Bodies = this.phaserPhysics.bodies;

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
}
