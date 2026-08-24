import type { MpSdk } from '../../../bundle/sdk';
import type { Texture, Mesh, MeshBasicMaterial, BufferGeometry, Object3D } from 'three';

export type Size = { w: number; h: number };

type Inputs = {
  texture: Texture | null;
  aspect: number;
  transparent: boolean;
  visible: boolean;
  opacity: number;
  polygonOffset: boolean;
  polygonOffsetFactor: number;
  polygonOffsetUnits: number;
  localScale: { x: number; y: number; z: number };
  localPosition: { x: number; y: number; z: number };
};

export interface IPlaneRenderer {
  inputs: Inputs;
}

export const planeRendererType = 'mp.planeRenderer';
export const makePlaneRenderer = (sdk: MpSdk): MpSdk.Scene.IComponentFactory<Inputs> => () => {
  let mesh: Mesh<BufferGeometry, MeshBasicMaterial>;
  let pivotNode: Object3D;

  return {
    inputs: {
      texture: null,
      aspect: 1,
      transparent: true,
      visible: true,
      opacity: 1,
      polygonOffset: false,
      polygonOffsetFactor: 0,
      polygonOffsetUnits: 0,
      localScale: { x: 1, y: 1, z: 1 },
      localPosition: { x: 0, y: 0, z: 0 },
    },

    outputs: {},

    events: {
      [sdk.Scene.InteractionType.CLICK]: true,
    },

    emits: {
      [sdk.Scene.InteractionType.CLICK]: true,
      [sdk.Scene.InteractionType.HOVER]: true,
    },

    onInit() {
      const THREE = this.context.three;

      pivotNode = new THREE.Group();

      mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.0, 1.0),
        new THREE.MeshBasicMaterial({
          transparent: this.inputs.transparent,
          map: this.inputs.texture,
          opacity: this.inputs.opacity,
          polygonOffset: this.inputs.polygonOffset,
          polygonOffsetFactor: this.inputs.polygonOffsetFactor,
          polygonOffsetUnits: this.inputs.polygonOffsetUnits,
        })
      );
      mesh.scale.set(
        this.inputs.localScale.x,
        this.inputs.localScale.y / this.inputs.aspect,
        this.inputs.localScale.z
      );
      mesh.position.set(this.inputs.localPosition.x, this.inputs.localPosition.y, this.inputs.localPosition.z);
      mesh.updateMatrixWorld();
      pivotNode.add(mesh);
      this.outputs.objectRoot = pivotNode;
      this.outputs.collider = pivotNode;
      mesh.visible = this.inputs.visible;
    },

    onEvent(eventType, eventData) {
      this.notify(eventType, eventData);
    },

    onInputsUpdated(oldInputs) {
      if (oldInputs.transparent !== this.inputs.transparent) {
        mesh.material.transparent = this.inputs.transparent;
      }

      if (oldInputs.texture !== this.inputs.texture) {
        mesh.material.map = this.inputs.texture;
        mesh.material.needsUpdate = true;
      }

      if (oldInputs.visible !== this.inputs.visible) {
        mesh.visible = this.inputs.visible;
      }

      if (oldInputs.polygonOffset !== this.inputs.polygonOffset) {
        mesh.material.polygonOffset = this.inputs.polygonOffset;
        mesh.material.polygonOffsetFactor = this.inputs.polygonOffsetFactor;
        mesh.material.polygonOffsetUnits = this.inputs.polygonOffsetUnits;
      }

      mesh.scale.set(
        this.inputs.localScale.x,
        this.inputs.localScale.y / this.inputs.aspect,
        this.inputs.localScale.z
      );
      mesh.position.set(this.inputs.localPosition.x, this.inputs.localPosition.y, this.inputs.localPosition.z);
    },

    onDestroy() {
      this.outputs.collider = null;
      this.outputs.objectRoot = null;

      mesh.material.dispose();
      mesh.geometry.dispose();
    },
  };
};
