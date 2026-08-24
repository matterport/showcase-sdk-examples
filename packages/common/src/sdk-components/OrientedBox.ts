import type { MpSdk } from '../../../bundle/sdk';
import type * as THREEType from 'three';
import type {
  MeshBasicMaterial,
  LineSegments,
  Object3D,
  BufferGeometry,
  Mesh,
  LineBasicMaterial,
  AnimationMixer,
  AnimationClip,
  AnimationAction,
} from 'three';

export interface IInteractionEvent {
  type: string;
  node: MpSdk.Scene.INode;
  component: MpSdk.Scene.IComponent;
}

type Inputs = {
  size: { x: number; y: number; z: number };
  color: number;
  visible: boolean;
  opacity: number;
  transitionTime: number;
  lineOpacity: number;
  lineColor: number;
};

const makeMaterialOpacityClip = function (
  THREE: typeof THREEType,
  time: number,
  startOpacity: number,
  endOpacity: number
): AnimationClip {
  const track = new THREE.NumberKeyframeTrack('.material.opacity', [0, time], [startOpacity, endOpacity]);
  return new THREE.AnimationClip(null, time, [track]);
};

const playAnimation = function (THREE: typeof THREEType, mixer: AnimationMixer, clip: AnimationClip, root?: Object3D) {
  const action: AnimationAction = mixer.clipAction(clip, root);
  action.loop = THREE.LoopOnce;
  action.clampWhenFinished = true;
  action.play();
};

export const orientedBoxType = 'mp.orientedBox';
export const makeOrientedBox = (sdk: MpSdk): MpSdk.Scene.IComponentFactory<Inputs, Record<string, unknown>> => () => {
  let root: Object3D | null = null;
  let box: Mesh<BufferGeometry, MeshBasicMaterial> | null = null;
  let edges: LineSegments<BufferGeometry, LineBasicMaterial> | null = null;
  let boxMixer: AnimationMixer | null = null;
  let clipVisible: AnimationClip | null = null;
  let clipNotVisible: AnimationClip | null = null;
  let edgesClipVisible: AnimationClip | null = null;
  let edgesClipNotVisible: AnimationClip | null = null;

  const makeBox = (self: MpSdk.Scene.IComponentThis<Inputs, Record<string, unknown>>) => {
    const THREE = self.context.three;

    if (box) {
      root.remove(box);
      box.material.dispose();
      box.geometry.dispose();
      box = null;
    }
    if (edges) {
      root.remove(edges);
      edges.material.dispose();
      edges.geometry.dispose();
      edges = null;
    }

    const boxGeometry = new THREE.BoxGeometry(self.inputs.size.x, self.inputs.size.y, self.inputs.size.z);

    const boxMaterial = new THREE.MeshBasicMaterial({
      color: self.inputs.color,
      opacity: self.inputs.opacity,
      depthWrite: false,
    });
    boxMaterial.transparent = true;
    boxMaterial.side = THREE.BackSide;
    boxMaterial.blending = THREE.AdditiveBlending;
    box = new THREE.Mesh(boxGeometry, boxMaterial);
    root.add(box);

    const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      transparent: true,
      color: self.inputs.lineColor,
      linewidth: 1,
      opacity: self.inputs.lineOpacity,
    });
    edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);

    // put the edges object directly in the scene graph so that they dont intercept
    // raycasts. The edges object will need to be removed if this component is destroyed.
    // NOTE: `obj3D` is an undocumented runtime property on INode — the SDK does not
    // expose it in its type declarations, so we must use a type assertion here.
    // @deprecated context.root not in sdk.d.ts
    const ctxRoot: MpSdk.Scene.INode = (self.context as any).root;
    const obj3D = (ctxRoot as unknown as { obj3D: Object3D }).obj3D;
    const worldPos = new self.context.three.Vector3();
    obj3D.getWorldPosition(worldPos);
    edges.position.copy(worldPos);
    self.context.scene.add(edges);
  };

  return {
    inputs: {
      size: { x: 1, y: 1, z: 1 },
      color: 0xffff00,
      visible: true,
      opacity: 0.1,
      lineOpacity: 1,
      lineColor: 0xffffff,
      transitionTime: 0.4,
    },

    events: {
      [sdk.Scene.InteractionType.CLICK]: true,
      [sdk.Scene.InteractionType.HOVER]: true,
      [sdk.Scene.InteractionType.DRAG]: false,
    },

    onInit() {
      const THREE = this.context.three;
      root = new THREE.Object3D();
      this.outputs.objectRoot = root;
      this.outputs.collider = root;

      makeBox(this);

      // must be done after the box is created
      boxMixer = new THREE.AnimationMixer(box);
      clipVisible = makeMaterialOpacityClip(THREE, this.inputs.transitionTime, 0, this.inputs.opacity);
      clipNotVisible = makeMaterialOpacityClip(THREE, this.inputs.transitionTime, this.inputs.opacity, 0);
      edgesClipVisible = makeMaterialOpacityClip(THREE, this.inputs.transitionTime, 0, 1);
      edgesClipNotVisible = makeMaterialOpacityClip(THREE, this.inputs.transitionTime, 1, 0);
    },

    onEvent(interactionType, eventData) {
      if (interactionType === sdk.Scene.InteractionType.CLICK) {
        // @deprecated context.root not in sdk.d.ts
        const ctxRoot: MpSdk.Scene.INode = (this.context as any).root;
        this.notify(sdk.Scene.InteractionType.CLICK, {
          type: interactionType,
          node: ctxRoot,
          component: this,
        });
      }
      if (interactionType === sdk.Scene.InteractionType.HOVER) {
        const data = eventData as { hover: boolean };
        this.notify(sdk.Scene.InteractionType.HOVER, {
          hover: data.hover,
        });
      }
    },

    onInputsUpdated(oldInputs) {
      const THREE = this.context.three;

      if (oldInputs.visible !== this.inputs.visible) {
        boxMixer.stopAllAction();

        if (this.inputs.visible) {
          playAnimation(THREE, boxMixer, clipVisible);
          playAnimation(THREE, boxMixer, edgesClipVisible, edges);
        } else {
          playAnimation(THREE, boxMixer, clipNotVisible);
          playAnimation(THREE, boxMixer, edgesClipNotVisible, edges);
        }
      }

      if (
        oldInputs.size.x !== this.inputs.size.x ||
        oldInputs.size.y !== this.inputs.size.y ||
        oldInputs.size.z !== this.inputs.size.z
      ) {
        makeBox(this);
        return;
      }

      if (oldInputs.color !== this.inputs.color) {
        box.material.color.set(this.inputs.color);
      }

      if (oldInputs.opacity !== this.inputs.opacity) {
        box.material.opacity = this.inputs.opacity;
      }

      if (oldInputs.lineOpacity !== this.inputs.lineOpacity) {
        edges.material.opacity = this.inputs.lineOpacity;
      }

      if (oldInputs.lineColor !== this.inputs.lineColor) {
        edges.material.color = new THREE.Color(this.inputs.lineColor);
      }
    },

    onTick(delta) {
      boxMixer.update(delta / 1000);
    },
  };
};

