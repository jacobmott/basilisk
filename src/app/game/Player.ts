import Phaser from "phaser";

export default class Player extends Phaser.Physics.Matter.Sprite {
  readonly speed: number;
  inputKeys: any;
  phaserPhysics: Phaser.Physics.Matter.MatterPhysics;

  constructor(data) {
    let { scene, x, y, texture, frame } = data;
    super(scene.matter.world, x, y, texture, frame);
    this.speed = 2.5;

    this.phaserPhysics = new Phaser.Physics.Matter.MatterPhysics(scene);
    const Body = this.phaserPhysics.body;
    const Bodies = this.phaserPhysics.bodies;
    let playerCollider = Bodies.circle(this.x, this.y, 12, {
      isSensor: false,
      label: "playerCollider",
    });
    let playerSensor = Bodies.circle(this.x, this.y, 24, {
      isSensor: true,
      label: "playerSensor",
    });
    const compoundBody = Body.create({
      parts: [playerCollider, playerSensor],
      frictionAir: 0.35,
    });
    this.setExistingBody(compoundBody);
    this.setFixedRotation();
  }

  static preload(scene: Phaser.Scene) {
    //make sure that the key here when loading the atlas, matches the key specified in townsfolk_female_anim.json animation file,
    //otherwise the animations wont be able to find/access the loaded spritesheet
    scene.load.atlas(
      "townsfolk_female",
      "assets/images/townsfolk_female.png",
      "assets/images/townsfolk_female_atlas.json"
    );
    scene.load.animation(
      "townsfolk_female_anim",
      "assets/images/townsfolk_female_anim.json"
    );
  }

  update(time: integer) {
    let currentVelocity = new Phaser.Math.Vector2();
    if (this.inputKeys.left.isDown) {
      currentVelocity.x = -1;
    } else if (this.inputKeys.right.isDown) {
      currentVelocity.x = 1;
    }
    if (this.inputKeys.up.isDown) {
      currentVelocity.y = -1;
    } else if (this.inputKeys.down.isDown) {
      currentVelocity.y = 1;
    }
    currentVelocity.normalize();
    currentVelocity.scale(this.speed);
    this.setVelocity(currentVelocity.x, currentVelocity.y);
    if (
      Math.abs(currentVelocity.x) > 0.1 ||
      Math.abs(currentVelocity.y) > 0.1
    ) {
      this.play("walk", true);
    } else {
      this.play("idle", true);
    }
  }
}
