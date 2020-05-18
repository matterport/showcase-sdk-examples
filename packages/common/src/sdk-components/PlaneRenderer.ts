import { SceneComponent, ComponentInteractionType } from '../SceneComponent';
import { Texture, Mesh, MeshBasicMaterial, Object3D } from 'three';

export type Size = { w: number; h: number; };

type Inputs = {
  texture: Texture | null;
  aspect: number;
  transparent: boolean;
  visible: boolean;
  opacity: number;
  polygonOffset: boolean;
  polygonOffsetFactor: number;
  polygonOffsetUnits: number;
  localScale: {x: number; y: number; z: number; };
  localPosition: {x: number; y: number; z: number; };
}

export class PlaneRenderer extends SceneComponent implements IPlaneRenderer {
  private mesh: Mesh;
  private pivotNode: Object3D;

  inputs: Inputs = {
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
  }

  events = {
    [ComponentInteractionType.CLICK]: true,
  };

  onInit() {
    const THREE = this.context.three;

    this.pivotNode = new THREE.Group();

    this.mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1.0, 1.0),
      new THREE.MeshBasicMaterial({
        transparent: this.inputs.transparent,
        map: this.inputs.texture,
        opacity: this.inputs.opacity,
        polygonOffset: this.inputs.polygonOffset,
        polygonOffsetFactor: this.inputs.polygonOffsetFactor,
        polygonOffsetUnits: this.inputs.polygonOffsetUnits,
      }));
    this.mesh.scale.set(this.inputs.localScale.x, this.inputs.localScale.y / this.inputs.aspect, this.inputs.localScale.z);
    this.mesh.position.set(this.inputs.localPosition.x, this.inputs.localPosition.y, this.inputs.localPosition.z);
    this.mesh.updateMatrixWorld();
    this.pivotNode.add(this.mesh);

    this.outputs.objectRoot = this.pivotNode;
    this.outputs.collider = this.pivotNode;
    this.mesh.visible = this.inputs.visible;
  }

  onEvent(eventType: string, eventData: unknown) {
    this.notify(eventType, eventData);
  }

  onInputsUpdated(oldInputs: Inputs) {
    if (oldInputs.transparent !== this.inputs.transparent) {
      (this.mesh.material as MeshBasicMaterial).transparent = this.inputs.transparent;
    }

    if (oldInputs.texture !== this.inputs.texture) {
      const material = this.mesh.material as MeshBasicMaterial;
      material.map = this.inputs.texture;
      material.needsUpdate = true;
    }

    if (oldInputs.visible !== this.inputs.visible) {
      this.mesh.visible = this.inputs.visible;
    }

    if (oldInputs.polygonOffset !== this.inputs.polygonOffset) {
      const material = this.mesh.material as MeshBasicMaterial;
      material.polygonOffset = this.inputs.polygonOffset;
      material.polygonOffsetFactor = this.inputs.polygonOffsetFactor;
      material.polygonOffsetUnits = this.inputs.polygonOffsetUnits;
    }

    this.mesh.scale.set(this.inputs.localScale.x, this.inputs.localScale.y / this.inputs.aspect, this.inputs.localScale.z);
    this.mesh.position.set(this.inputs.localPosition.x, this.inputs.localPosition.y, this.inputs.localPosition.z);
  }

  onDestroy() {
    this.outputs.collider = null;
    this.outputs.objectRoot = null;

    (this.mesh.material as MeshBasicMaterial).dispose();
    this.mesh.geometry.dispose();
  }

}

export interface IPlaneRenderer extends SceneComponent {
  inputs: Inputs;
}

export const planeRendererType = 'mp.planeRenderer';
export function makePlaneRenderer() {
  return new PlaneRenderer();
}
