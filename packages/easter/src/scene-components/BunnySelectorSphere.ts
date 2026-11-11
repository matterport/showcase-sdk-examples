import type { MpSdk } from '../../../bundle/sdk';
import type { Object3D, MeshBasicMaterial, SphereGeometry, PlaneGeometry, Vector3, WebGLRenderTarget, Mesh } from 'three';
import { SceneEvents } from '../scenes/SceneEvents';
import { Events } from 'phaser';

type Inputs = {
  size: number;
  color: number;
  lineColor: number;
  hoverOpacity: number;
};

const HINT_DURATION = 3000;
let caughtMarker: WebGLRenderTarget | undefined;

function createCaughtMarker(renderTargetFactory: typeof WebGLRenderTarget) {
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
  caughtMarker = new renderTargetFactory(renderTargetSize, renderTargetSize);
  caughtMarker.texture.image = renderContext2D.canvas;
  caughtMarker.texture.needsUpdate = true;
}

export const bunnySelectorSphereType = 'easter.bunnyselectorsphere';

export const createBunnySelectorClosure = (eventBus: Events.EventEmitter, sdk: MpSdk): MpSdk.Scene.IComponentFactory<Inputs, Record<string, unknown>> =>
  () => {
    let cameraPose: MpSdk.Camera.Pose = null;
    let cameraDirty = true;
    const opacity = 0;
    const hoverOpacity = 0.75;
    let root: Object3D | null = null;
    let sphere: Mesh<SphereGeometry, MeshBasicMaterial> | null = null;
    let checkPlane: Mesh<PlaneGeometry, MeshBasicMaterial> | null = null;
    let sphereWP: Vector3;
    let markerVisible = false;
    let hovered = false;
    let caught = false;
    let cameraSub: { cancel(): void } | null = null;
    let hintActiveTime = 0;

    const setAlwaysOnTop = (onTop: boolean) => {
      const sphereMat = sphere.material;
      sphereMat.depthTest = !onTop;
      sphereMat.depthWrite = !onTop;

      const planeMat = checkPlane.material;
      planeMat.depthTest = !onTop;
      planeMat.depthWrite = !onTop;
    };

    const onCameraPoseChanged = (pose: MpSdk.Camera.Pose) => {
      cameraPose = pose;
      cameraDirty = true;
    };

    const onHintActivated = () => {
      hintActiveTime = Date.now();
    };

    return {
      inputs: {
        size: 1.0,
        color: 0xffff00,
        lineColor: 0x000000,
        hoverOpacity: 0.8,
      },

      events: {
        [sdk.Scene.InteractionType.CLICK]: true,
        [sdk.Scene.InteractionType.HOVER]: true,
        [sdk.Scene.InteractionType.DRAG]: false,
      },

      emits: {
        [sdk.Scene.InteractionType.CLICK]: true,
      },

      onInit() {
        const THREE = this.context.three;
        sphereWP = new THREE.Vector3();
        if (!caughtMarker) {
          createCaughtMarker(THREE.WebGLRenderTarget);
        }
        root = new THREE.Object3D();
        this.outputs.objectRoot = root;
        this.outputs.collider = root;

        if (sphere) {
          root.remove(sphere);
          (sphere.material).dispose();
          (sphere.geometry).dispose();
          sphere = null;
        }

        const sphereGeometry = new THREE.SphereGeometry(0.5 * this.inputs.size, 12, 10);

        const sphereMaterial = new THREE.MeshBasicMaterial({
          transparent: true,
          color: this.inputs.color,
          opacity: opacity,
          depthTest: false,
          depthWrite: false,
        });

        sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        root.add(sphere);

        const planeSize = 0.5 * this.inputs.size;
        checkPlane = new THREE.Mesh(
          new THREE.PlaneGeometry(planeSize, planeSize),
          new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            color: 0x00ff00,
            map: caughtMarker.texture,
            side: THREE.DoubleSide,
            depthTest: false,
            depthWrite: false,
          })
        );
        checkPlane.position.z = this.inputs.size;
        sphere.renderOrder = 10;
        checkPlane.renderOrder = 11;

        root.add(checkPlane);

        cameraSub = sdk.Camera.pose.subscribe(onCameraPoseChanged);
        eventBus.addListener(SceneEvents.DisplayHint, onHintActivated);
      },

      onEvent(eventType, eventData) {
        const data = eventData as { hover?: boolean };
        if (!caught) {
          if (eventType === sdk.Scene.InteractionType.CLICK) {
            sphere.getWorldPosition(sphereWP);
            this.notify(eventType, {
              position: sphereWP,
            });
            caught = true;
            // show check after click
            const planeMat = checkPlane.material;
            planeMat.opacity = hoverOpacity;
            // if the bunny was captured, we don't need the "hint" alwasys on top
            setAlwaysOnTop(false);
          }
          if (eventType === sdk.Scene.InteractionType.HOVER) {
            hovered = data.hover;
          }
        }
      },

      onTick() {
        if (cameraDirty && cameraPose) {
          const target = cameraPose.position;
          root.lookAt(target.x, target.y, target.z);
          cameraDirty = false;
        }

        const hintActive = hintActiveTime + HINT_DURATION > Date.now();
        const newMarkerVisible = hovered || hintActive;
        if (markerVisible !== newMarkerVisible) {
          const sphereMat = sphere.material;
          sphereMat.opacity = newMarkerVisible ? hoverOpacity : opacity;

          const planeMat = checkPlane.material;
          planeMat.opacity = caught && newMarkerVisible ? hoverOpacity : 0;
        }
        if (!caught && hintActive) {
          setAlwaysOnTop(true);
        }
        markerVisible = newMarkerVisible;
      },

      onDestroy() {
        if (sphere) {
          sphere.geometry.dispose();
          (sphere.material).dispose();
        }
        cameraSub.cancel();
        eventBus.removeListener(SceneEvents.DisplayHint, onHintActivated);
      },
    };
  };
