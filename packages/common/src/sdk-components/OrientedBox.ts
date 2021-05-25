import { MeshBasicMaterial, LineSegments, Object3D, BoxGeometry, Mesh, LineBasicMaterial, EdgesGeometry,
  AnimationMixer, AnimationClip, AnimationAction } from 'three';
import { SceneComponent, ComponentInteractionType, ISceneNode } from '../SceneComponent';

export interface IInteractionEvent {
  type: ComponentInteractionType;
  node: ISceneNode;
  component: SceneComponent;
}

interface Inputs {
  size: { x: number; y: number; z: number; },
  color: number;
  visible: boolean;
  opacity: number;
  transitionTime: number;
  lineOpacity: number;
  lineColor: number;
}

const makeMaterialOpacityClip = function(THREE: any, time: number, startOpacity: number, endOpacity: number): AnimationClip {
  const track = new THREE.NumberKeyframeTrack('.material.opacity', [0, time], [startOpacity, endOpacity]);
  return new THREE.AnimationClip(null, time, [track]);
};

const playAnimation = function(THREE: any, mixer: AnimationMixer, clip: AnimationClip, root?: any) {
  const action: AnimationAction = mixer.clipAction(clip, root);
  action.loop = THREE.LoopOnce;
  action.clampWhenFinished = true;
  action.play();
}

export class OrientedBox extends SceneComponent {
  private root: Object3D | null = null;
  private box: Mesh | null = null;
  private edges: LineSegments | null = null;
  private boxMixer: AnimationMixer | null = null;
  private clipVisible: AnimationClip | null = null;
  private clipNotVisible: AnimationClip | null = null;
  private edgesClipVisible: AnimationClip | null = null;
  private edgesClipNotVisible: AnimationClip | null = null;

  inputs: Inputs = {
    size: { x: 1, y: 1, z: 1 },
    color: 0xffff00,
    visible: true,
    opacity: 0.1,
    lineOpacity: 1,
    lineColor: 0xffffff,
    transitionTime: 0.4,
  };

  events = {
    [ComponentInteractionType.CLICK]: true,
    [ComponentInteractionType.HOVER]: true,
    [ComponentInteractionType.DRAG]: false,
  };

  onInit() {
    const THREE = this.context.three;
    this.root = new THREE.Object3D();
    this.outputs.objectRoot = this.root;
    this.outputs.collider = this.root;

    this.makeBox();

    // must be done after the box is created
    this.boxMixer = new THREE.AnimationMixer(this.box);
    this.clipVisible = makeMaterialOpacityClip(THREE, this.inputs.transitionTime, 0, this.inputs.opacity);
    this.clipNotVisible = makeMaterialOpacityClip(THREE, this.inputs.transitionTime, this.inputs.opacity, 0);
    this.edgesClipVisible = makeMaterialOpacityClip(THREE, this.inputs.transitionTime, 0, 1);
    this.edgesClipNotVisible = makeMaterialOpacityClip(THREE, this.inputs.transitionTime, 1, 0);
  }

  onEvent(interactionType: ComponentInteractionType, eventData: unknown): void {
    if (interactionType === ComponentInteractionType.CLICK) {
      this.notify(ComponentInteractionType.CLICK, {
        type: interactionType,
        node: this.context.root,
        component: this,
      });
    }
    if (interactionType === ComponentInteractionType.HOVER) {
      this.notify(ComponentInteractionType.HOVER, {
        hover: (<{hover: boolean;}>eventData).hover
      });
    }
  }

  makeBox() {
    const THREE = this.context.three;

    if (this.box) {
      this.root.remove(this.box);
      (this.box.material as MeshBasicMaterial).dispose();
      (this.box.geometry as BoxGeometry).dispose();
      this.box = null;
    }
    if (this.edges) {
      this.root.remove(this.edges);
      (this.edges.material as LineBasicMaterial).dispose();
      (this.edges.geometry as EdgesGeometry).dispose();
      this.edges = null;
    }

    const boxGeometry: BoxGeometry = new THREE.BoxGeometry(this.inputs.size.x, this.inputs.size.y, this.inputs.size.z);

    var boxMaterial: MeshBasicMaterial = new THREE.MeshBasicMaterial({
      color: this.inputs.color,
      opacity: this.inputs.opacity,
      depthWrite: false,
    });
    boxMaterial.transparent = true;
    boxMaterial.side = THREE.BackSide;
    boxMaterial.blending = THREE.AdditiveBlending;
    this.box = new THREE.Mesh(boxGeometry, boxMaterial);
    this.root.add(this.box);

    const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
    this.edges = new THREE.LineSegments(edgesGeometry, new THREE.LineBasicMaterial({
      transparent: true,
      color: this.inputs.lineColor,
      linewidth: 1,
      opacity: this.inputs.lineOpacity,
    }));
    
    // put the edges object directly in the scene graph so that they dont intercept
    // raycasts. The edges object will need to be removed if this component is destroyed.
    const obj3D = (this.context.root as any).obj3D as Object3D;
    const worldPos = new this.context.three.Vector3();
    obj3D.getWorldPosition(worldPos);
    this.edges.position.copy(worldPos);
    this.context.scene.add(this.edges);
  }

  onInputsUpdated(oldInputs: Inputs) {
    const THREE = this.context.three;

    if (oldInputs.visible !== this.inputs.visible) {
      this.boxMixer.stopAllAction();

      if (this.inputs.visible) {
        playAnimation(THREE, this.boxMixer, this.clipVisible);
        playAnimation(THREE, this.boxMixer, this.edgesClipVisible, this.edges);
      }
      else {
        playAnimation(THREE, this.boxMixer, this.clipNotVisible);
        playAnimation(THREE, this.boxMixer, this.edgesClipNotVisible, this.edges);
      }
    }

    if (oldInputs.size.x !== this.inputs.size.x ||
        oldInputs.size.y !== this.inputs.size.y ||
        oldInputs.size.z !==  this.inputs.size.z) {
      this.makeBox();
      return;
    }

    if (oldInputs.color !== this.inputs.color) {
      (this.box.material as MeshBasicMaterial).color.set(this.inputs.color);
    }

    if (oldInputs.opacity !== this.inputs.opacity) {
      (this.box.material as MeshBasicMaterial).opacity = this.inputs.opacity;
    }

    if (oldInputs.lineOpacity !== this.inputs.lineOpacity) {
      (this.edges.material as LineBasicMaterial).opacity = this.inputs.lineOpacity;
    }

    if (oldInputs.lineColor !== this.inputs.lineColor) {
      (this.edges.material as LineBasicMaterial).color = new THREE.Color(this.inputs.lineColor);
    }
  }

  onTick(delta: number) {
    this.boxMixer.update(delta/1000);
  }
}

export const orientedBoxType = 'mp.orientedBox';
export const makeOrientedBox = function() {
  return new OrientedBox();
}
