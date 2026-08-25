import type { MpSdk } from '../../../bundle/sdk';
import { Size, IPainter2d } from '@mp/common';

type Inputs = {
  position: { x: number; y: number };
  size: Size;
  radius: number;
};

type Outputs = {
  painter: IPainter2d | null;
};

function paintBorder(context2d: CanvasRenderingContext2D, inputs: Inputs) {
  const x = inputs.position.x;
  const y = inputs.position.y;
  const radius = inputs.radius;
  const r = x + inputs.size.w;
  const b = y + inputs.size.h;

  context2d.shadowBlur = 10;
  context2d.shadowColor = 'black';
  context2d.beginPath();
  context2d.strokeStyle = 'black';
  context2d.lineWidth = 50;
  context2d.moveTo(x + radius, y);
  context2d.lineTo(r - radius, y);
  context2d.quadraticCurveTo(r, y, r, y + radius);
  context2d.lineTo(r, y + inputs.size.h - radius);
  context2d.quadraticCurveTo(r, b, r - radius, b);
  context2d.lineTo(x + radius, b);
  context2d.quadraticCurveTo(x, b, x, b - radius);
  context2d.lineTo(x, y + radius);
  context2d.quadraticCurveTo(x, y, x + radius, y);
  context2d.stroke();
}

export const canvasBorderType = 'mp.canvasBorder';
export const makeCanvasBorder: MpSdk.Scene.IComponentFactory<Inputs, Outputs> = () => {
  return {
    inputs: {
      position: { x: 0, y: 0 },
      size: { h: 100, w: 100 },
      radius: 10,
    },
    outputs: {
      painter: null,
    },

    onInit() {
      this.outputs.painter = {
        paint: (context2d: CanvasRenderingContext2D, _size: Size) => paintBorder(context2d, this.inputs),
      };
    },

    onInputsUpdated() {
      this.notify('paint.ready');
    },
  };
};
