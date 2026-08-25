import type { MpSdk } from '../../../bundle/sdk';
import { Size, IPainter2d } from '@mp/common';

type Inputs = {
  position: { x: number; y: number };
  size: Size;
  radius: number;
  text: string;
  font: string;
  textWidth: number;
};

type Outputs = {
  painter: IPainter2d | null;
};

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

function paintText(context2d: CanvasRenderingContext2D, inputs: Inputs) {
  context2d.strokeStyle = 'black';
  context2d.fillStyle = 'black';
  context2d.font = inputs.font;
  context2d.textAlign = 'left';
  context2d.textBaseline = 'top';
  wrapText(context2d, inputs.text, inputs.position.x, inputs.position.y, inputs.textWidth, 30);
}

export const canvasTextType = 'mp.canvasText';
export const makeCanvasText: MpSdk.Scene.IComponentFactory<Inputs, Outputs> = () => {
  return {
    inputs: {
      position: { x: 0, y: 0 },
      size: { h: 100, w: 100 },
      radius: 1,
      text: 'Placeholder',
      font: 'normal bold 80px sans-serif',
      textWidth: 100,
    },
    outputs: {
      painter: null,
    },

    onInit() {
      this.outputs.painter = {
        paint: (context2d: CanvasRenderingContext2D, _size: Size) => paintText(context2d, this.inputs),
      };
    },

    onInputsUpdated() {
      this.notify('paint.ready');
    },
  };
};
