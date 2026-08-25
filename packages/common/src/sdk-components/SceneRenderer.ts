import type { MpSdk } from '../../../bundle/sdk';
import type { Texture, WebGLRenderTarget, WebGLRenderer } from 'three';
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
};

export interface ISceneRenderer {
  inputs: Inputs;
  outputs: Outputs;
}

export const sceneRendererType = 'mp.sceneRenderer';
export const makeSceneRenderer: MpSdk.Scene.IComponentFactory<Inputs, Outputs> = () => {
  let renderer: WebGLRenderer;
  let renderTarget: WebGLRenderTarget;

  return {
    inputs: {
      painter: null,
      textureRes: { w: 512, h: 512 },
    },
    outputs: {
      texture: null,
    },

    onInit() {
      const THREE = this.context.three;
      renderer = this.context.renderer;

      // create three.js objects to render
      renderTarget = new THREE.WebGLRenderTarget(this.inputs.textureRes.w, this.inputs.textureRes.h);

      this.outputs.texture = renderTarget.texture;
    },

    onInputsUpdated(oldInputs) {
      if (this.inputs.painter) {
        const prevTarget = renderer.getRenderTarget();
        renderer.setRenderTarget(renderTarget);
        this.inputs.painter.paint(renderer);
        renderer.setRenderTarget(prevTarget);
      }
    },

    onDestroy() {
      this.outputs.texture = null;
      renderTarget.dispose();
    },
  };
};
