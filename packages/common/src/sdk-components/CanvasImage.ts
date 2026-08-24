import type { MpSdk } from '../../../bundle/sdk';
import { IPainter2d, Size } from '@mp/common';

type Inputs = {
  src: string | null;
  srcPosition: { x: number; y: number };
  srcSize: Size;
  destPosition: { x: number; y: number };
  destSize: Size;
};

type Outputs = {
  painter: IPainter2d | null;
};

function paintImage(context2d: CanvasRenderingContext2D, image: HTMLImageElement | null, inputs: Inputs) {
  if (!image) {
    return;
  }

  context2d.clearRect(0, 0, inputs.destSize.w, inputs.destSize.h);
  if (image.width > 0) {
    context2d.drawImage(
      image,
      inputs.srcPosition.x,
      inputs.srcPosition.y,
      inputs.srcSize.w,
      inputs.srcSize.h,
      inputs.destPosition.x,
      inputs.destPosition.y,
      inputs.destSize.w,
      inputs.destSize.h
    );
  }
}

export const canvasImageType = 'mp.canvasImage';
export const makeCanvasImage: MpSdk.Scene.IComponentFactory<Inputs, Outputs> = () => {
  let image: HTMLImageElement | null = null;

  const maybeLoadImage = (self: MpSdk.Scene.IComponentThis<Inputs, Outputs>) => {
    image = null;

    if (self.inputs.src !== null && self.inputs.src !== '') {
      image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = self.inputs.src;
      image.onload = function (_event: Event) {
        self.notify('paint.ready');
      };
    }

    self.notify('paint.ready');
  };

  return {
    inputs: {
      src: null,
      srcPosition: { x: 0, y: 0 },
      srcSize: { w: 64, h: 64 },
      destPosition: { x: 0, y: 0 },
      destSize: { w: 64, h: 64 },
    },

    outputs: {
      painter: null,
    },

    emits: {
      'paint.ready': true,
    },

    onInit() {
      this.outputs.painter = {
        paint: (context2d: CanvasRenderingContext2D, _size: Size) => paintImage(context2d, image, this.inputs),
      };
      maybeLoadImage(this);
    },

    onInputsUpdated() {
      maybeLoadImage(this);
    },
  };
};
