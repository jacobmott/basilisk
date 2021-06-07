import Phaser from "phaser";

export default class DropItem extends Phaser.Physics.Matter.Sprite {
  phaserPhysics: Phaser.Physics.Matter.MatterPhysics;
  sound: Phaser.Sound.BaseSound;

  constructor(data) {
    let { scene, x, y, frame } = data;
    super(scene.matter.world, x, y, "items", frame);
    this.scene = scene;
    this.scene.add.existing(this);
    this.phaserPhysics = new Phaser.Physics.Matter.MatterPhysics(scene);

    const Body = this.phaserPhysics.body;
    const Bodies = this.phaserPhysics.bodies;
    let collider = Bodies.circle(this.x, this.y, 12, {
      isSensor: false,
      label: "collider",
    });
    this.setExistingBody(collider);
    this.setFrictionAir(1);
    this.setScale(0.6);
    //resourceItem.setFixedRotation();
    //this.setStatic(true);
    this.sound = this.scene.sound.add("pickup");
  }

  pickup() {
    this.destroy();
    this.sound.play();
    return true;
  }
}
