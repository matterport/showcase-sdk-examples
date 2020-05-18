import { SceneComponent, IPainter2d, Size, ComponentOutput, ComponentInteractionType } from '@mp/common';

type Outputs = {
  painter: IPainter2d | null;
} & ComponentOutput;

class ClockPainterComponent extends SceneComponent {
  private digitalPainter: IPainter2d;
  private analogPainter: IPainter2d;
  private activePainter: IPainter2d;
  private currentTick: number = 0;
  private lastUpdate: number = 0;
  private readonly updateFreq: number = 500;

  outputs = {
    painter: null,
  } as Outputs;

  onInit() {
    this.digitalPainter = new DigitalClockPainter();
    this.analogPainter = new AnalogClockPainter();
    this.activePainter = this.analogPainter;
    this.outputs.painter = this.analogPainter;
  }

  onTick(delta: number) {
    this.currentTick += delta;
    // only update the clock every half second
    if (this.lastUpdate + this.updateFreq > this.currentTick) return;
    this.lastUpdate = this.currentTick;

    this.notify('paint.ready');
  }

  onEvent(eventType: string) {
    if (eventType === ComponentInteractionType.CLICK) {
      if (this.activePainter === this.digitalPainter) {
        this.activePainter = this.analogPainter;
      } else {
        this.activePainter = this.digitalPainter;
      }
    }
    this.outputs.painter = this.activePainter;
    this.notify('paint.ready');
  }

}

class DigitalClockPainter implements IPainter2d {
  paint(context: CanvasRenderingContext2D, size: Size) {
    context.clearRect(0, 0, size.w, size.h);
    context.fillStyle = 'rgb(158, 47, 40)';
    context.font = '60px sans-serif';
    context.textBaseline = 'middle';
    context.textAlign = 'center';

    const now = new Date();
    const hours = now.getHours();
    const mins  = now.getMinutes();
    const secs  = now.getSeconds();
    const formattedHours = hours;
    const formattedMins  = mins < 10 ? '0' + mins : mins;
    const formattedSecs  = secs < 10 ? '0' + secs : secs;
    context.fillText(`${formattedHours}:${formattedMins}:${formattedSecs}`, size.w / 2, size.h / 2);
  }
}

class AnalogClockPainter implements IPainter2d {
  paint(context: CanvasRenderingContext2D, size: Size) {
    context.clearRect(0, 0, size.w, size.h);

    // face
    context.strokeStyle = 'black';
    context.fillStyle = 'white';
    context.lineWidth = 3;
    const cx = 0.5 * size.w;
    const cy = 0.5 * size.h;
    const r = 0.5 * (Math.min(size.w, size.h) - 3);
    context.beginPath();
    context.arc(cx, cy, r, 0, 2 * Math.PI);
    context.fill();
    context.stroke();

    // numbers
    context.fillStyle = 'black';
    context.font = '25px sans-serif'
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    for (let i = 12; i; --i) {
      const theta = 2 * Math.PI * i / 12 - 0.5 * Math.PI;
      const rx = 0.85 * r * Math.cos(theta);
      const ry = 0.85 * r * Math.sin(theta);
      const nx = rx + cx;
      const ny = ry + cy;

      context.fillText(i.toString(), nx, ny);
    }

    const now = new Date();
    const hours = now.getHours() % 12;
    const mins  = now.getMinutes();
    const secs  = now.getSeconds();

    // second hand
    const secAngle = 2 * Math.PI * secs / 60 - 0.5 * Math.PI;
    const sx = 0.85 * r * Math.cos(secAngle);
    const sy = 0.85 * r * Math.sin(secAngle);
    context.strokeStyle = 'red';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(cx, cy);
    context.lineTo(cx + sx, cy + sy);
    context.stroke();

    // minute hand
    const minAngle = 2 * Math.PI * (mins + secs / 60) / 60 - 0.5 * Math.PI;
    const mx = 0.75 * r * Math.cos(minAngle);
    const my = 0.75 * r * Math.sin(minAngle);
    context.strokeStyle = 'blue';
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(cx, cy);
    context.lineTo(cx + mx, cy + my);
    context.stroke();

    // hour hand
    const hourAngle = 2 * Math.PI * (hours + mins / 60) / 12 - 0.5 * Math.PI;
    const hx = 0.6 * r * Math.cos(hourAngle);
    const hy = 0.6 * r * Math.sin(hourAngle);
    context.strokeStyle = 'green';
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(cx, cy);
    context.lineTo(cx + hx, cy + hy);
    context.stroke();
  }
}

export interface IClockPainter extends SceneComponent {
  outputs: Outputs;
}

export const clockPainterType = 'mp.clockPainter';
export function makeClockPainter() {
  return new ClockPainterComponent();
}
