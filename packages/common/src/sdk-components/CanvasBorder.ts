import { SceneComponent, ComponentOutput, Size, IPainter2d } from '@mp/common';

type Inputs = {
  position: { x: number, y: number };
  size: Size;
  radius: number;
};

type Outputs = {
  painter: IPainter2d | null;
} & ComponentOutput;

class CanvasBorder extends SceneComponent implements IPainter2d {
  inputs: Inputs = {
    position: { x: 0, y: 0 },
    size: { h: 100, w: 100 },
    radius: 10,
  };

  outputs = {
    painter: null,
  } as Outputs;

  onInit() {
    this.outputs.painter = this;
  }

  onInputsUpdated() {
    this.notify('paint.ready');
  }

  paint(context2d: CanvasRenderingContext2D, size: Size): void {
    const x = this.inputs.position.x;
    const y = this.inputs.position.y;
    const radius = this.inputs.radius;
    var r = x + this.inputs.size.w;
    var b = y + this.inputs.size.h;

    context2d.shadowBlur = 10;
    context2d.shadowColor = 'black';
    context2d.beginPath();
    context2d.strokeStyle = 'black';
    context2d.lineWidth = 50;
    context2d.moveTo(x + radius, y);
    context2d.lineTo(r - radius, y);
    context2d.quadraticCurveTo(r, y, r, y + radius);
    context2d.lineTo(r, y + this.inputs.size.h - radius);
    context2d.quadraticCurveTo(r, b, r-radius, b);
    context2d.lineTo(x + radius, b);
    context2d.quadraticCurveTo(x, b, x, b - radius);
    context2d.lineTo(x, y + radius);
    context2d.quadraticCurveTo(x, y, x + radius, y);
    context2d.stroke();
  }
}

export const canvasBorderType = 'mp.canvasBorder';
export function makeCanvasBorder() {
  return new CanvasBorder();
}
