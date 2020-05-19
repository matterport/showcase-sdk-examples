import { Dict } from "@mp/core";
import { SceneComponent, ComponentInteractionType, ComponentOutput } from "@mp/common";
import { Object3D, MeshBasicMaterial, SphereGeometry, Vector3, WebGLRenderTarget } from "three";
import { Mesh } from "three";
import { SceneEvents } from "../scenes/SceneEvents";
import { Events } from "phaser";

interface Inputs {
  size: number,
  color: number;
  lineColor: number;
  hoverOpacity: number;
}

type Outputs = {

} & ComponentOutput;

class BunnySelector extends SceneComponent {
  private static caughtMarker: WebGLRenderTarget;
  private cameraPose: any = null;
  private cameraDirty = true;
  private opacity = 0;
  private hoverOpacity = 0.75;
  private root: Object3D|null = null;
  private sphere: Mesh|null = null;
  private checkPlane: Mesh|null = null;
  private sphereWP = new Vector3();
  private markerVisible = false;
  private hovered = false;
  private caught = false;
  private cameraSub: { cancel(): void }|null = null;
  private hintActiveTime = 0;
  private static hintDuration = 3000;

  inputs: Inputs = {
    size: 1.0,
    color: 0xffff00,
    lineColor: 0x000000,
    hoverOpacity: 0.8,
  };

  outputs = {} as Outputs;

  events = {
    [ComponentInteractionType.CLICK]: true,
    [ComponentInteractionType.HOVER]: true,
    [ComponentInteractionType.DRAG]: false,
  };

  constructor(private eventBus: Events.EventEmitter, private sdk: any) {
    super();
  }

  onInit() {
    const THREE = this.context.three;
    if (!BunnySelector.caughtMarker) {
      BunnySelector.createCaughtMarker(THREE.WebGLRenderTarget);
    }
    this.root = new THREE.Object3D();
    this.outputs.objectRoot = this.root;
    this.outputs.collider = this.root;

    this.makeSphere();

    this.onCameraPoseChanged = this.onCameraPoseChanged.bind(this);
    this.onHintActivated = this.onHintActivated.bind(this);
    this.cameraSub = this.sdk.Camera.pose.subscribe(this.onCameraPoseChanged);
    this.eventBus.addListener(SceneEvents.DisplayHint, this.onHintActivated);
  }

  onEvent(eventType: string, eventData: Dict): void {
    if (!this.caught) {
      if (eventType === ComponentInteractionType.CLICK) {
        this.sphere.getWorldPosition(this.sphereWP);
        this.notify(eventType, {
          position: this.sphereWP,
        });
        this.caught = true;
        // show check after click
        const planeMat = this.checkPlane.material as MeshBasicMaterial;
        planeMat.opacity = this.hoverOpacity;
        // if the bunny was captured, we don't need the "hint" alwasys on top
        this.setAlwaysOnTop(false);

      }
      if (eventType === ComponentInteractionType.HOVER) {
        this.hovered = eventData.hover
      }
    }
  }

  onTick() {
    if (this.cameraDirty && this.cameraPose) {
      const target = this.cameraPose.position;
      this.root.lookAt(target.x, target.y, target.z);
      this.cameraDirty = false;
    }

    const hintActive = this.hintActiveTime + BunnySelector.hintDuration > Date.now();
    const markerVisible = this.hovered || hintActive;
    if (this.markerVisible !== markerVisible) {
      const sphereMat = this.sphere.material as MeshBasicMaterial;
      sphereMat.opacity = markerVisible ? this.hoverOpacity : this.opacity;

      const planeMat = this.checkPlane.material as MeshBasicMaterial;
      planeMat.opacity = this.caught && markerVisible ? this.hoverOpacity : 0;
    }
    if (!this.caught && hintActive) {
      this.setAlwaysOnTop(true);
    }
    this.markerVisible = markerVisible;
  }

  onDestroy() {
    if (this.sphere) {
      this.sphere.geometry.dispose();
      (this.sphere.material as MeshBasicMaterial).dispose();
    }
    this.cameraSub.cancel();
    this.eventBus.removeListener(SceneEvents.DisplayHint, this.onHintActivated);
  }

  private makeSphere() {
    const THREE = this.context.three;

    if (this.sphere) {
      this.root.remove(this.sphere);
      (this.sphere.material as MeshBasicMaterial).dispose();
      (this.sphere.geometry as SphereGeometry).dispose();
      this.sphere = null;
    }

    const sphereGeometry = new THREE.SphereGeometry(0.5 * this.inputs.size, 12, 10);

    var sphereMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      color: this.inputs.color,
      opacity: this.opacity,
      depthTest: false,
      depthWrite: false,
    });

    this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.root.add(this.sphere);

    const planeSize = 0.5 * this.inputs.size;
    this.checkPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(planeSize, planeSize),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        color: 0x00ff00,
        map: BunnySelector.caughtMarker.texture,
        side: THREE.DoubleSide,
        depthTest: false,
        depthWrite: false,
      }));
    this.checkPlane.position.z = this.inputs.size;
    this.sphere.renderOrder = 10;
    this.checkPlane.renderOrder = 11;

    this.root.add(this.checkPlane);
  }

  private static createCaughtMarker(renderTargetFactory: typeof WebGLRenderTarget) {
    const renderTargetSize = 64;
    const canvas = document.createElement('canvas');
    const renderContext2D = canvas.getContext('2d');
    canvas.width = renderTargetSize;
    canvas.height = renderTargetSize;


    renderContext2D.textAlign = 'center';
    renderContext2D.textBaseline = 'middle';
    renderContext2D.fillStyle = '#fff';
    renderContext2D.font = renderTargetSize + 'px Roboto';
    renderContext2D.fillText('✓', 0.5 * renderTargetSize, 0.5 * renderTargetSize);

    // create three.js objects to render
    this.caughtMarker = new renderTargetFactory(renderTargetSize, renderTargetSize);
    this.caughtMarker.texture.image = renderContext2D.canvas;
    this.caughtMarker.texture.needsUpdate = true;
  }

  private onCameraPoseChanged(pose: any) {
    this.cameraPose = pose;
    this.cameraDirty = true;
  }

  private onHintActivated() {
    this.hintActiveTime = Date.now();
  }

  private setAlwaysOnTop(onTop: boolean) {
    const sphereMat = this.sphere.material as MeshBasicMaterial;
    sphereMat.depthTest = !onTop;
    sphereMat.depthWrite = !onTop;

    const planeMat = this.checkPlane.material as MeshBasicMaterial;
    planeMat.depthTest = !onTop;
    planeMat.depthWrite = !onTop;
  }
}

export const bunnySelectorSphereType = 'easter.bunnyselectorsphere';

export const createBunnySelectorClosure = function(eventBus: Events.EventEmitter, sdk: any) {
  return function() {
    return new BunnySelector(eventBus, sdk);
  };
}
