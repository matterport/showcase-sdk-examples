import { Scene, GameObjects, Math, Scenes } from 'phaser';
import { SceneIds } from './SceneIds';
import { ISceneConfig } from '../interfaces';
import { SceneEvents } from './SceneEvents';

// from tutorial
// https://www.freecodecamp.org/news/how-to-build-a-simple-game-in-the-browser-with-phaser-3-and-typescript-bdc94719135/

export class GameScene extends Scene {
  private config: ISceneConfig = null;
  private rabbit: GameObjects.Sprite = null;
  private path: { x: number[], y: number[], scale: number[] } = { x: [], y: [], scale: [] };
  private increment: number = 0.01;
  private i: number = 0;
  private whooshPlayed: boolean = false;
  private backgroundSound: Phaser.Sound.BaseSound|null = null;

  constructor() {
    super({ key: SceneIds.Game });

    this.onRabbitTrigger = this.onRabbitTrigger.bind(this);
  }

  init(config: ISceneConfig): void {
    this.config = config;
    console.log(this.config);

    this.config.eventBus.addListener(SceneEvents.StartRabbit, this.onRabbitTrigger);
  }

  private spawnRabbit(point: {x: number, y: number}) {
    if (this.rabbit) {
      if (!this.whooshPlayed) {
        this.sound.play('mouth_pop', { volume: 0.1 });
        this.config.eventBus.emit(SceneEvents.CaptureComplete);
      }

      this.rabbit.destroy();
      this.rabbit = null;
    }

    const targetX = this.game.canvas.width - 100;
    const targetY = 112;

    // compute path
    this.path.x = [point.x];
    this.path.x.push(point.x + ((targetX - point.x) * 0.25));
    this.path.x.push(targetX);

    this.path.y = [point.y];
    this.path.y.push(50);
    this.path.y.push(targetY);

    this.path.scale = [1];
    this.path.scale.push(0.6);
    this.path.scale.push(0.2);

    this.i = 0;
    this.whooshPlayed = false;

    this.rabbit = this.add.sprite(point.x, point.y, 'rabbit');
    this.rabbit.scaleX = 0.5;
    this.rabbit.scaleY = 0.5;
    this.anims.create({
      key: 'running',
      frames: this.anims.generateFrameNumbers('rabbit', { start: 0, end: 7 }),
      frameRate: 15,
      repeat: -1,
      showOnStart: false,
      hideOnComplete: true,
    });

    this.rabbit.anims.play('running');
    this.sound.play('captured', { volume: 0.1 });
  }

  private onRabbitTrigger(point: { x: number, y: number }) {
    this.spawnRabbit(point);
  }

  preload(): void {
    this.load.setBaseURL();
    this.load.spritesheet('rabbit', 'assets/rabbit.png', { frameWidth: 200, frameHeight: 238 });
    this.load.audio('captured', 'assets/capture_sound.wav');
    this.load.audio('tada', 'assets/tada.mp3');
    this.load.audio('mouth_pop', 'assets/mouth_pop.wav');
    this.load.audio('background-music', 'assets/background-music.mp3');
  }

  create(): void {
    this.game.canvas.style.pointerEvents = 'none';
    this.backgroundSound = this.sound.add('background-music');
    this.backgroundSound.play({ loop: true, volume: 0.1 });

    const that = this;
    this.scene.systems.events.on('shutdown', function(systems: Scenes.Systems){
      if (systems.scene === that) {
        that.backgroundSound.stop();
        that.backgroundSound = null;
      }
    });
  }

  update(time: number, delta: number): void {
    if (this.rabbit) {
      const posX = Math.Interpolation.CatmullRom(this.path.x, this.i);
      const posY = Math.Interpolation.CatmullRom(this.path.y, this.i);
      const scale = Math.Interpolation.Linear(this.path.scale, this.i);

      this.rabbit.x = posX;
      this.rabbit.y = posY;
      this.rabbit.scaleX = scale;
      this.rabbit.scaleY = scale;
      this.i = this.i + this.increment;

      if (!this.whooshPlayed && this.i > 0.8) {
        this.whooshPlayed = true;
        this.sound.play('mouth_pop', { volume: 0.1 });
        this.config.eventBus.emit(SceneEvents.CaptureComplete);
      }

      if (this.i > 1.0) {
        this.rabbit.destroy();
        this.rabbit = null;
      }
    }
  }
}
