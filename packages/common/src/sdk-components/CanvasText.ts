import { SceneComponent, ComponentOutput, Size, IPainter2d } from '@mp/common';

type Inputs = {
  position: { x: number; y: number; },
  size: Size;
  radius: number;
  text: string;
  font: string;
  textWidth: number;
};

type Outputs = {
  painter: IPainter2d | null;
} & ComponentOutput;

class CanvasText extends SceneComponent implements IPainter2d {
  inputs: Inputs = {
    position: { x: 0, y: 0 },
    size: { h: 100, w: 100 },
    radius: 1,
    text: 'Placeholder',
    font: 'normal bold 80px sans-serif',
    textWidth: 100,
  }

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
    context2d.strokeStyle = 'black';
    context2d.fillStyle = 'black';
    context2d.font = this.inputs.font;
    context2d.textAlign = 'left';
    context2d.textBaseline = 'top';
    wrapText(context2d, this.inputs.text, this.inputs.position.x, this.inputs.position.y, this.inputs.textWidth, 30);
  }
}

function wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number,
  maxWidth: number, lineHeight: number) {
  var words = text.split(' ');
  var line = '';

  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    }
    else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

export const canvasTextType = 'mp.canvasText';
export function makeCanvasText() {
  return new CanvasText();
}
