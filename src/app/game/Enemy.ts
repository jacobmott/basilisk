import Phaser from "phaser";
import MatterEntity from "./MatterEntity";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import Player from "./Player";

export default class Enemy extends MatterEntity {
  attacking: Player;
  phaserPhysics: Phaser.Physics.Matter.MatterPhysics;
  attackTimer: any;
  lastTime: number;
  speed: number;

  constructor(data) {
    let { scene, enemy } = data;
    let drops = JSON.parse(
      enemy.properties.find((p) => p.name == "drops").value
    );
    let health = enemy.properties.find((p) => p.name == "health").value;
    super({
      scene,
      x: enemy.x,
      y: enemy.y,
      texture: "enemies",
      frame: `${enemy.name}_idle_1`,
      drops,
      health,
      name: enemy.name,
    });
    this.lastTime = 0;
    this.speed = 140;
    this.scene = scene;
    this.attackTimer = null;
    this.phaserPhysics = new Phaser.Physics.Matter.MatterPhysics(scene);
    const Body = this.phaserPhysics.body;
    const Bodies = this.phaserPhysics.bodies;
    let enemyCollider = Bodies.circle(this.x, this.y, 12, {
      isSensor: false,
      label: "enemyCollider",
    });
    let enemySensor = Bodies.circle(this.x, this.y, 80, {
      isSensor: true,
      label: "enemySensor",
    });
    const compoundBody = Body.create({
      parts: [enemyCollider, enemySensor],
      frictionAir: 0.35,
    });
    this.setExistingBody(compoundBody);
    this.setFixedRotation();

    scene.matterCollision.addOnCollideStart({
      objectA: [enemySensor],
      callback: (other) => {
        if (
          other.gameObjectB &&
          other.gameObjectB instanceof Player &&
          other.gameObjectB.name == "player"
        ) {
          this.attacking = other.gameObjectB;
        }
      },
      context: this.scene,
    });
  }

  static preload(scene) {
    scene.load.atlas(
      "enemies",
      "assets/images/enemies.png",
      "assets/images/enemies_atlas.json"
    );
    scene.load.animation("enemies_anim", "assets/images/enemies_anim.json");
    scene.load.audio("ent", "assets/audio/ent.wav");
    scene.load.audio("bear", "assets/audio/bear.wav");
    scene.load.audio("wolf", "assets/audio/wolf.wav");
  }

  update(time: number) {
    if (this.dead) {
      return;
    }

    if (this.lastTime == 0) {
      this.lastTime = time;
    }
    let deltaTime = time - this.lastTime;
    this.lastTime = time;

    if (this.attacking) {
      let direction = this.attacking.position.subtract(this.position);

      if (direction.length() > 24) {
        let v = direction.normalize();
        let currentVelocity = new Phaser.Math.Vector2();
        currentVelocity.x = direction.x;
        currentVelocity.y = direction.y;
        currentVelocity.scale(this.speed);
        currentVelocity.scale(deltaTime);
        this.setVelocity(currentVelocity.x, currentVelocity.y);
        //player no longer in range, no need to attack
        if (this.attackTimer) {
          clearInterval(this.attackTimer);
          this.attackTimer = null;
        }
      } else {
        if (this.attackTimer == null) {
          this.attackTimer = setInterval(
            this.attack,
            500,
            this.attacking,
            this
          );
        }
      }
    }
    this.setFlipX(this.velocity.x < 0);
    if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
      this.anims.play(`${this.name}_walk`, true);
    } else {
      this.anims.play(`${this.name}_idle`, true);
    }
  }

  attack(target: Player, ref: Enemy) {
    if (target.dead || ref.dead) {
      clearInterval(ref.attackTimer);
      ref.attackTimer = null;
      return;
    }
    target.hit();
  }
}
