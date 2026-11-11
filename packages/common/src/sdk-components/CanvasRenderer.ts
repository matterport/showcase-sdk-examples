import type { MpSdk } from '../../../bundle/sdk';
import type { Texture } from 'three';
import { Size } from './PlaneRenderer';

export interface IPainter2d {
  paint(context2d: CanvasRenderingContext2D, size: Size): void;
}

type Inputs = {
  painter: IPainter2d | null;
  textureRes: Size;
};

type Outputs = {
  texture: Texture | null;
};

export interface ICanvasRenderer {
  inputs: Inputs;
  outputs: Outputs;
}

export const canvasRendererType = 'mp.canvasRenderer';
export const makeCanvasRenderer: MpSdk.Scene.IComponentFactory<Inputs, Outputs> = () => {
  let canvas: HTMLCanvasElement;
  let renderContext2D: CanvasRenderingContext2D;

  const resize = (size: Size) => {
    canvas.width = size.w;
    canvas.height = size.h;
  };

  const repaint = (painter: IPainter2d | null, textureRes: Size, texture: Texture | null) => {
    if (!painter || !texture) return;
    painter.paint(renderContext2D, textureRes);
    texture.needsUpdate = true;
  };

  return {
    inputs: {
      painter: null,
      textureRes: { w: 256, h: 256 },
    },
    outputs: {
      texture: null,
    },
    events: {
      repaint: true,
    },

    onInit() {
      const THREE = this.context.three;
      canvas = document.createElement('canvas');
      renderContext2D = canvas.getContext('2d');
      this.outputs.texture = new THREE.CanvasTexture(canvas);
      resize(this.inputs.textureRes);
      repaint(this.inputs.painter, this.inputs.textureRes, this.outputs.texture);
    },

    onInputsUpdated(oldInputs) {
      if (oldInputs.textureRes.w !== this.inputs.textureRes.w || oldInputs.textureRes.h !== this.inputs.textureRes.h) {
        resize(this.inputs.textureRes);
      }
      if (oldInputs.painter !== this.inputs.painter) {
        repaint(this.inputs.painter, this.inputs.textureRes, this.outputs.texture);
      }
    },

    onEvent(eventType, _eventData) {
      if (eventType === 'repaint') {
        repaint(this.inputs.painter, this.inputs.textureRes, this.outputs.texture);
      }
    },

    onDestroy() {
      this.outputs.texture?.dispose();
      this.outputs.texture = null;
    },
  };
};
