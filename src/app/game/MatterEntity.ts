import DropItem from "./DropItem";
import Resource from "./Resource";

export default class MatterEntity extends Phaser.Physics.Matter.Sprite {
  health: number;
  drops: Resource[];
  sound: Phaser.Sound.BaseSound;
  _position: Phaser.Math.Vector2;

  constructor(data) {
    let { name, scene, x, y, health, drops, texture, frame, depth } = data;
    super(scene.matter.world, x, y, texture, frame);
    this.x += this.width / 2;
    this.y -= this.height / 2;
    this.depth = depth || 1;
    this.name = name;
    this.health = health;
    this.drops = drops;
    this._position = new Phaser.Math.Vector2(this.x, this.y);
    if (this.name) {
      this.sound = this.scene.sound.add(this.name);
    }
    this.scene.add.existing(this);
  }

  get position() {
    this._position.set(this.x, this.y);
    return this._position;
  }

  get velocity() {
    return this.body.velocity;
  }

  get dead() {
    return this.health <= 0;
  }

  onDeath() {}

  hit() {
    if (this.sound) {
      this.sound.play();
    }
    this.health--;
    console.log(`Hitting: ${this.name} Health: ${this.health}`);
    if (this.dead) {
      this.onDeath();
      this.drops.forEach((drop) => {
        console.log(drop);
        new DropItem({ scene: this.scene, x: this.x, y: this.y, frame: drop });
      });
    }
  }
}
