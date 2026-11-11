import type { MpSdk } from '../../../bundle/sdk';
import type {
  Object3D,
  AnimationMixer,
  AnimationAction,
  AnimationClip,
  CircleGeometry,
  CylinderGeometry,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Texture,
} from 'three';
import { IPainter2d } from './CanvasRenderer';
import { Size } from './PlaneRenderer';

const RepaintEvent = 'repaint';

// back face flush with the wall at z = 0, centred 6.8 cm above the node origin
const BezelRadius = 0.066;
const BezelDepth = 0.048;
const FaceRadius = 0.0614;
const FaceOffset = 0.001;
const BodyCenter = { x: 0.005, y: 0.068, z: BezelDepth / 2 };

type Inputs = {
  texture: Texture | null;
  updateInterval: number;
};

type Outputs = {
  painter: IPainter2d | null;
  visible: boolean;
  objectRoot?: Object3D;
  collider?: Object3D;
};

export const thermostatType = 'mp.thermostat';
export const makeThermostat = (sdk: MpSdk): MpSdk.Scene.IComponentFactory<Inputs, Outputs> => () => {
  let mixer: AnimationMixer | null = null;
  let onEnterClip: AnimationClip | null = null;
  let bezelGeometry: CylinderGeometry | null = null;
  let bezelMaterial: MeshStandardMaterial | null = null;
  let faceGeometry: CircleGeometry | null = null;
  let faceMaterial: MeshBasicMaterial | null = null;
  let currentTime: number = 0;
  let nextUpdate: number = 0;
  let temperature: number = 0;
  let tempChangeRange: number = 5;

  const painter: IPainter2d = {
    paint(context2d: CanvasRenderingContext2D, _size: Size): void {
      const x = 490;
      const y = 490;

      context2d.fillStyle = 'black';
      context2d.beginPath();
      context2d.arc(x, y, 400, 0, Math.PI * 2);
      context2d.fill();

      context2d.fillStyle = '#CF5300';
      context2d.beginPath();
      context2d.arc(x, y, 300, 0, Math.PI * 2);
      context2d.fill();

      context2d.beginPath();
      context2d.strokeStyle = 'orange';
      context2d.arc(x, y, 240, 0.75 * Math.PI, 0.25 * Math.PI);
      context2d.lineCap = 'butt';
      context2d.lineWidth = 80;
      context2d.stroke();

      context2d.fillStyle = 'white';
      context2d.font = '220px Arial';
      context2d.fillText(`${temperature}`, x - 115, y + 75);
    },
  };

  return {
    inputs: {
      texture: null,
      updateInterval: 1000,
    },

    outputs: {
      painter: null,
      visible: false,
    },

    events: {
      [sdk.Scene.InteractionType.HOVER]: true,
    },

    emits: {
      [RepaintEvent]: true,
    },

    onInit() {
      // @deprecated context.root not in sdk.d.ts
      const root: MpSdk.Scene.INode = (this.context as any).root;
      const THREE = this.context.three;

      let planeRendererRoot: Object3D | null = null;
      for (const component of root.componentIterator()) {
        if (component.componentType === 'mp.planeRenderer') {
          planeRendererRoot = component.outputs.objectRoot;
          planeRendererRoot.translateZ(0.05);
          planeRendererRoot.translateY(0.4);
          planeRendererRoot.scale.set(0.5, 0.5, 0.5);
        }
      }

      this.outputs.painter = painter;

      // the body's +Z axis is the node's front
      const body = new THREE.Group();
      body.position.set(BodyCenter.x, BodyCenter.y, BodyCenter.z);
      bezelGeometry = new THREE.CylinderGeometry(BezelRadius, BezelRadius, BezelDepth, 48).rotateX(Math.PI / 2);
      bezelMaterial = new THREE.MeshStandardMaterial({ color: 0x8a8d91, metalness: 0.6, roughness: 0.4 });
      body.add(new THREE.Mesh(bezelGeometry, bezelMaterial));

      faceGeometry = new THREE.CircleGeometry(FaceRadius, 48);
      faceMaterial = new THREE.MeshBasicMaterial({ map: this.inputs.texture });
      const face = new THREE.Mesh(faceGeometry, faceMaterial);
      face.position.z = BezelDepth / 2 + FaceOffset;
      body.add(face);

      this.outputs.objectRoot = body;
      this.outputs.collider = body;

      mixer = new THREE.AnimationMixer(planeRendererRoot);

      const tm = 0.2;
      const positionTrack = new THREE.VectorKeyframeTrack(
        '.scale',
        [0, tm],
        [0, 0, 0, 0.5, 0.5, 0.5],
        THREE.InterpolateSmooth
      );
      onEnterClip = new THREE.AnimationClip(null, tm, [positionTrack]);
    },

    onInputsUpdated() {
      faceMaterial.map = this.inputs.texture;
      faceMaterial.needsUpdate = true;
    },

    onEvent(eventType, eventData) {
      const THREE = this.context.three;
      if (eventType === sdk.Scene.InteractionType.HOVER) {
        const data = eventData as { hover: boolean };
        if (data.hover) {
          this.outputs.visible = true;
          const onEnterAction: AnimationAction = mixer.clipAction(onEnterClip);
          onEnterAction.stop();
          onEnterAction.loop = THREE.LoopOnce;
          onEnterAction.clampWhenFinished = true;
          onEnterAction.play();
        } else {
          this.outputs.visible = false;
        }
      }
    },

    onDestroy() {
      bezelGeometry.dispose();
      bezelMaterial.dispose();
      faceGeometry.dispose();
      faceMaterial.dispose();
    },

    onTick(delta) {
      currentTime += delta;

      if (mixer) {
        mixer.update(delta / 1000);
      }

      if (currentTime > nextUpdate) {
        nextUpdate += this.inputs.updateInterval;

        temperature += Math.random() * tempChangeRange;
        temperature = Math.trunc(temperature);

        if (temperature > 99) {
          temperature = 99;
          tempChangeRange = -tempChangeRange;
        }
        if (temperature < 10) {
          temperature = 10;
          tempChangeRange = -tempChangeRange;
        }

        this.notify(RepaintEvent);
      }
    },
  };
};
