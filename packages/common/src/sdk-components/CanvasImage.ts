import { SceneComponent, IPainter2d, Size, ComponentOutput } from '@mp/common';

type Inputs = {
  src: string | null;
  srcPosition: { x: number, y: number };
  srcSize: Size;
  destPosition: { x: number, y: number };
  destSize: Size;
};

type Outputs = {
  painter: IPainter2d | null;
} & ComponentOutput;

class CanvasImage extends SceneComponent implements IPainter2d {
  private image: HTMLImageElement | null = null;

  inputs: Inputs = {
    src: null,
    srcPosition: { x: 0, y: 0 },
    srcSize: { w: 64, h: 64 },
    destPosition: { x: 0, y: 0 },
    destSize: { w: 64, h: 64 },
  }

  outputs = {
    painter: null,
  } as Outputs;

  onInit() {
    this.outputs.painter = this;
    this.maybeLoadImage();
  }

  onInputsUpdated() {
    this.maybeLoadImage();
  }

  paint(context2d: CanvasRenderingContext2D, size: Size): void {
    if (!this.image) {
      return;
    }

    context2d.clearRect(0, 0, this.inputs.destSize.w, this.inputs.destSize.h);
    if (this.image.width > 0) {
      context2d.drawImage(this.image,
        this.inputs.srcPosition.x, this.inputs.srcPosition.y,
        this.inputs.srcSize.w, this.inputs.srcSize.h,
        this.inputs.destPosition.x, this.inputs.destPosition.y,
        this.inputs.destSize.w, this.inputs.destSize.h);
    }
  }

  private maybeLoadImage() {
    this.image = null;

    if (this.inputs.src !== null && this.inputs.src !== '') {
      const that = this;
      this.image = new Image();
      this.image.crossOrigin = 'anonymous';
      this.image.src = this.inputs.src;
      this.image.onload = function(event: Event) {
        that.notify('paint.ready');
      };
    }

    this.notify('paint.ready');
  }
}

export const canvasImageType = 'mp.canvasImage';
export function makeCanvasImage() {
  return new CanvasImage();
}
