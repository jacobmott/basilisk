import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import Phaser from "phaser";
import MainScene from "./MainScene";
import Resource from "./Resource";
import MatterEntity from "./MatterEntity";

export default class Player extends MatterEntity {
  readonly speed: number;
  inputKeys: any;
  phaserPhysics: Phaser.Physics.Matter.MatterPhysics;
  spriteWeapon: Phaser.GameObjects.Sprite;
  weaponRotation: number;
  scene: MainScene;
  //this is either a resource or a sprite
  touching: (Resource | Phaser.GameObjects.Sprite)[];
  resourceTouching: Resource[];

  constructor(data) {
    let { scene, x, y, texture, frame } = data;
    //super(scene.matter.world, x, y, texture, frame);
    super({...data,health:2,drops:[],name:'player'});
    this.speed = 2.5;
    this.touching = [];
    this.resourceTouching = [];
    this.scene = scene;
    this.weaponRotation = 0;
    this.spriteWeapon = new Phaser.GameObjects.Sprite(
      scene,
      20,
      20,
      "items",
      162
    );
    this.spriteWeapon.setScale(0.8);
    this.spriteWeapon.setOrigin(0.25, 0.75);

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
    this.scene.add.existing(this.spriteWeapon);

    this.CreateMiningCollisions(playerSensor);
    this.CreatePickupCollisions(playerCollider);

    this.scene.input.on("pointermove", (pointer) =>
      this.setFlipX(pointer.worldX < this.x)
    );
  }

  static preload(scene: MainScene) {
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
    scene.load.spritesheet("items", "assets/images/items.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    scene.load.audio('player','assets/audio/damage.wav');
  }

  CreateMiningCollisions(playerSensor: MatterJS.BodyType) {
    this.scene.matterCollision.addOnCollideStart({
      objectA: [playerSensor],
      callback: (other) => {
        if (other.bodyB.isSensor) return;
        this.touching.push(other.gameObjectB);
        console.log(this.touching.length, other.gameObjectB.name);
      },
      context: this.scene,
    });

    this.scene.matterCollision.addOnCollideEnd({
      objectA: [playerSensor],
      callback: (other) => {
        this.touching = this.touching.filter(
          (gameObject) => gameObject != other.gameObjectB
        );
        console.log(this.touching.length);
      },
      context: this.scene,
    });
  }

  CreatePickupCollisions(playerCollider: MatterJS.BodyType) {
    this.scene.matterCollision.addOnCollideStart({
      objectA: [playerCollider],
      callback: (other) => {
        if (other.gameObjectB && other.gameObjectB.pickup)
          other.gameObjectB.pickup();
      },
      context: this.scene,
    });

    this.scene.matterCollision.addOnCollideEnd({
      objectA: [playerCollider],
      callback: (other) => {
        if (other.gameObjectB && other.gameObjectB.pickup)
          other.gameObjectB.pickup();
      },
      context: this.scene,
    });
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
    this.spriteWeapon.setPosition(this.x, this.y);
    this.weaponRotate();
  }

  weaponRotate() {
    let pointer = this.scene.input.activePointer;
    if (pointer.isDown) {
      this.weaponRotation += 6;
    } else {
      this.weaponRotation += 0;
    }
    if (this.weaponRotation > 100) {
      this.whackStuff();
      this.weaponRotation = 0;
    }
    if (this.flipX) {
      this.spriteWeapon.setAngle(-this.weaponRotation - 90);
    } else {
      this.spriteWeapon.setAngle(this.weaponRotation);
    }
  }

  whackStuff() {
    //filter out only game objects that support the hit function
    this.resourceTouching = <Resource[]>(
      this.touching.filter(
        (gameObject) => gameObject instanceof Resource && !gameObject.dead
      )
    );
    this.resourceTouching.forEach((gameObject) => {
      gameObject.hit();
      if (gameObject.dead) {
        gameObject.destroy();
      }
    });
  }
}
