import { SceneComponent, ComponentOutput } from '../SceneComponent';
import { Texture, WebGLRenderTarget, WebGLRenderer } from 'three';
import { Size } from './PlaneRenderer';

export interface IPainter3d {
  paint(renderer: WebGLRenderer): void;
}

type Inputs = {
  painter: IPainter3d;
  textureRes: Size;
};

type Outputs = {
  texture: Texture | null;
} & ComponentOutput;

class SceneRenderer extends SceneComponent {
  private renderer: WebGLRenderer;
  private renderTarget: WebGLRenderTarget;

  inputs: Inputs = {
    painter: null,
    textureRes: { w: 512, h: 512 },
  }

  outputs = {
    texture: null,
  } as Outputs;

  onInit() {
    const THREE = this.context.three;
    this.renderer = this.context.renderer;

    // create three.js objects to render
    this.renderTarget = new THREE.WebGLRenderTarget(this.inputs.textureRes.w, this.inputs.textureRes.h);

    this.outputs.texture = this.renderTarget.texture;
  }

  onInputsUpdated(oldInputs: Inputs) {
    if (this.inputs.painter) {
      const prevTarget = this.renderer.getRenderTarget();
      this.renderer.setRenderTarget(this.renderTarget);
      this.inputs.painter.paint(this.renderer);
      this.renderer.setRenderTarget(prevTarget);
    }
  }

  onDestroy() {
    this.outputs.texture = null;
    this.renderTarget.dispose();
  }

}

export interface ISceneRenderer extends SceneComponent {
  inputs: Inputs;
  outputs: Outputs;
}

export const sceneRendererType = 'mp.sceneRenderer';
export function makeSceneRenderer() {
  return new SceneRenderer();
}
