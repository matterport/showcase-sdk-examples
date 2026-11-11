import type { MpSdk } from '../../../bundle/sdk';
import { Size, IPainter2d } from '@mp/common';

const UpdateInterval = 1000;

type Outputs = {
  painter: IPainter2d | null;
};

export const mjpegPlayerType = 'mp.mjpegPlayer';
export const makeMjpegPlayer: MpSdk.Scene.IComponentFactory<Record<string, unknown>, Outputs> = () => {
  let image: HTMLImageElement | null = null;
  let time: number = 0;
  let nextUpdate: number = 0;

  const painter: IPainter2d = {
    paint(context: CanvasRenderingContext2D, size: Size) {
      context.drawImage(image, 0, 0, size.w, size.h);
    },
  };

  return {
    inputs: {
      src: '',
    },
    outputs: {
      painter: null,
    },

    onInit() {
      image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = this.inputs.src;
      this.outputs.painter = painter;
    },

    onInputsUpdated() {
      if (this.inputs.src) {
        image.src = this.inputs.src;
      }
    },

    onTick(delta) {
      time += delta;
      if (time > nextUpdate) {
        nextUpdate = time + UpdateInterval;

        this.notify('paint.ready');
      }
    },
  };
};
