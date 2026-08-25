import type { MpSdk } from '../../../bundle/sdk';
import type {
  Object3D,
  AnimationMixer,
  AnimationAction,
  AnimationClip,
  Material,
  Mesh,
  Texture,
  LineSegments,
  BufferGeometry,
} from 'three';
import { IPainter2d } from './CanvasRenderer';
import { Size } from './PlaneRenderer';

const HoverEvent = 'hover';
const UnhoverEvent = 'unhover';
const RepaintEvent = 'repaint';

type Inputs = {
  loadingState: string;
  texture: Texture | null;
  updateInterval: number;
};

type Outputs = {
  painter: IPainter2d | null;
  visible: boolean;
};

export const nestThermostatType = 'mp.nestThermostat';
export const makeNestThermostat: MpSdk.Scene.IComponentFactory<Inputs, Outputs> = () => {
  let daeComponent: MpSdk.Scene.IComponent | null = null;
  let mixer: AnimationMixer | null = null;
  let onEnterClip: AnimationClip | null = null;
  let mesh: Mesh<BufferGeometry, Material> | null = null;
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
      loadingState: 'Idle',
      texture: null,
      updateInterval: 1000,
    },

    outputs: {
      painter: null,
      visible: false,
    },

    events: {
      [HoverEvent]: true,
      [UnhoverEvent]: true,
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
        if (component.componentType === 'mp.daeLoader') {
          daeComponent = component;
        } else if (component.componentType === 'mp.planeRenderer') {
          planeRendererRoot = component.outputs.objectRoot;
          planeRendererRoot.translateZ(0.05);
          planeRendererRoot.translateY(0.4);
          planeRendererRoot.scale.set(0.5, 0.5, 0.5);
        }
      }

      this.outputs.painter = painter;

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
      const THREE = this.context.three;
      if (this.inputs.loadingState === 'Loaded') {
        const lines: LineSegments[] = [];
        daeComponent.outputs.objectRoot.traverse((obj: Object3D) => {
          // we dont want line segments, track them and remove them.
          if (obj.type === 'LineSegments') {
            lines.push(obj as LineSegments);
          } else if (obj.type === 'Mesh') {
            mesh = obj as Mesh<BufferGeometry, Material>;

            const material = mesh.material;
            if (material && material.name === '_5b76dbe388862300126c1e14') {
              const newMaterial = new THREE.MeshBasicMaterial({ map: this.inputs.texture });
              mesh.material = newMaterial;
            }
          }
        });

        // remove the line segments.
        lines.forEach((line: LineSegments) => {
          line.parent.remove(line);
        });
      }
    },

    onEvent(eventType, eventData) {
      const THREE = this.context.three;
      if (eventType === HoverEvent) {
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
