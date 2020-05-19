import 'phaser';
import { SceneIds } from './SceneIds';
import { ISceneConfig } from '../interfaces';

export class GameOverScene extends Phaser.Scene {

  constructor() {
    super({ key: SceneIds.GameOver });
  }

  init(config: ISceneConfig): void {}

  preload(): void {
    this.load.setBaseURL();
    this.load.atlas('confetti', 'assets/confetti.png', 'assets/confetti.json');
    this.load.audio('cheer', 'assets/cheer.mp3');
  }

  create(): void {
    this.game.canvas.style.pointerEvents = 'none';

    const line = new Phaser.Geom.Line(-this.game.canvas.width/2+50, -this.game.canvas.height, this.game.canvas.width-50, -this.game.canvas.height);

    const particles = this.add.particles('confetti');

    const emitter = particles.createEmitter({
      frame: [ 'confetti0', 'confetti1', 'confetti2', 'confetti3', 'confetti4', 'confetti5'],
      x: this.game.canvas.width/2, y: this.game.canvas.height,
      alpha: { start: 1, end: 0.2, ease: 'Quartic.easeOut' },
      speedY: { min: 20, max: 160 },
      speedX: { min: -50, max: 50 },
      gravityY: 90,
      quantity: 5,
      emitZone: { source: line },
      blendMode: 'NORMAL',
      lifespan: 6000,
      rotate: {
        onEmit: function (particle: Phaser.GameObjects.Particles.Particle) {
          (particle as any).rotationSpeed = (Math.random() * 2) - 1.0;
          return Math.floor(Math.random() * 90); 
        },
        onUpdate: function(particle: Phaser.GameObjects.Particles.Particle) {
          return particle.angle + (particle as any).rotationSpeed;
        }
      },
      scale : {
        onEmit: function (particle: Phaser.GameObjects.Particles.Particle) {
          const offset = Math.random() > 0.5 ? 0.4 : 0.2;
          const scale = Math.random() * 0.1 + offset;
          (particle as any).computedScale = scale;
          return scale;
        },
        onUpdate: function (particle: Phaser.GameObjects.Particles.Particle) {
          return (particle as any).computedScale;
        },
      },
    });
    
    this.time.addEvent({delay: 5000, callback: function() {
      emitter.stop();
    }});

    this.sound.play('cheer', { volume: 0.2 });
  }
};
