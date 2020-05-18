import { SceneComponent, ComponentOutput } from '../SceneComponent';
import { WebGLRenderTarget, Texture } from 'three';
import { Size } from './PlaneRenderer';

export interface IPainter2d {
  paint(context2d: CanvasRenderingContext2D, size: Size): void;
}

type Inputs = {
  painter: IPainter2d | null;
  textureRes: Size;
}

type Outputs = {
  texture: Texture | null;
} & ComponentOutput;

type Events = {
  repaint: boolean;
};

class CanvasRenderer extends SceneComponent {
  private canvas: HTMLCanvasElement;
  private renderContext2D: CanvasRenderingContext2D;
  private renderTarget: WebGLRenderTarget;

  inputs: Inputs = {
    painter: null,
    textureRes: { w: 256, h: 256 },
  }

  outputs = {
    texture: null,
  } as Outputs;

  events = {
    repaint: true,
  } as Events;

  onInit() {
    const THREE = this.context.three;

    // set up canvas 2d context
    this.canvas = document.createElement('canvas');
    this.renderContext2D = this.canvas.getContext('2d');

    // create three.js objects to render
    this.renderTarget = new THREE.WebGLRenderTarget(this.inputs.textureRes.w, this.inputs.textureRes.h);
    this.renderTarget.texture.image = this.renderContext2D.canvas;

    this.resize(this.inputs.textureRes);
    this.repaint();

    this.outputs.texture = this.renderTarget.texture;
  }

  onInputsUpdated(oldInputs: Inputs) {
    if (oldInputs.textureRes.w !== this.inputs.textureRes.w ||
        oldInputs.textureRes.h !== this.inputs.textureRes.h) {
      this.resize(this.inputs.textureRes);
    }

    if (oldInputs.painter !== this.inputs.painter) {
      this.repaint();
    }
  }

  onEvent(eventType: string, eventData: unknown) {
    if (eventType === 'repaint') {
      this.repaint();
    }
  }

  onDestroy() {
    this.outputs.texture = null;
    this.renderTarget.dispose();
  }

  private resize(size: Size) {
    this.canvas.width = size.w;
    this.canvas.height = size.h;
    this.renderTarget.width = size.w;
    this.renderTarget.height = size.h;
  }

  private repaint() {
    if (this.inputs.painter) {
      this.inputs.painter.paint(this.renderContext2D, this.inputs.textureRes);
      this.renderTarget.texture.needsUpdate = true;
    }
  }

}

export interface ICanvasRenderer extends SceneComponent{
  inputs: Inputs;
  outputs: Outputs;
}

export const canvasRendererType = 'mp.canvasRenderer';
export function makeCanvasRenderer() {
  return new CanvasRenderer();
}
