import { SceneComponent, ComponentOutput, Size, IPainter2d } from '@mp/common';

const UpdateInterval = 1000;

type Outputs = {
  painter: IPainter2d | null;
} & ComponentOutput;


class MjpegPlayer extends SceneComponent implements IPainter2d {
  private image: HTMLImageElement | null = null;
  private time: number = 0;
  private nextUpdate: number = 0;

  inputs = {
    src: '',
  };

  outputs = {
    painter: null,
  } as Outputs;

  onInit() {
    this.image = new Image();
    this.image.crossOrigin = 'anonymous';
    this.image.src = this.inputs.src;
    this.outputs.painter = this;
  }

  onInputsUpdated() {
    if (this.inputs.src) {
      this.image.src = this.inputs.src;
    }
  }

  paint(context: CanvasRenderingContext2D, size: Size) {
    context.drawImage(this.image, 0, 0, size.w, size.h);
  }

  onTick(delta: number) {
    this.time += delta;
    if (this.time > this.nextUpdate) {
      this.nextUpdate = this.time + UpdateInterval;

      this.notify('paint.ready');
    }
  }
}

export const mjpegPlayerType = 'mp.mjpegPlayer';
export const makeMjpegPlayer = function() {
  return new MjpegPlayer();
}
