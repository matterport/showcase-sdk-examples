import { SceneComponent, ComponentOutput } from '../SceneComponent';
import { Object3D, AnimationMixer, AnimationAction, LoopOnce, AnimationClip, Mesh, Texture, MeshLambertMaterial, LineSegments } from 'three';
import { IPainter2d } from './CanvasRenderer';
import { PlaneRenderer, Size } from './PlaneRenderer';

const HoverEvent = 'hover';
const UnhoverEvent = 'unhover';
const RepaintEvent = 'repaint';

type Inputs = {
  loadingState: string;
  texture: Texture | null;
  updateInterval: number;
}

type Outputs = {
  painter: IPainter2d | null;
  visible: boolean;
} & ComponentOutput;


class NestThermostat extends SceneComponent implements IPainter2d {
  private daeComponent: SceneComponent;
  private mixer: AnimationMixer | null = null;
  private onEnterClip: AnimationClip | null = null;
  private mesh: Mesh | null = null;
  private currentTime: number = 0;
  private nextUpdate: number = 0;
  private temperature: number = 0;
  private tempChangeRange: number = 5;

  inputs: Inputs = {
    loadingState: 'Idle',
    texture: null,
    updateInterval: 1000,
  }

  outputs = {
    painter: null,
    visible: false,
  } as Outputs;

  events = {
    [HoverEvent]: true,
    [UnhoverEvent]: true,
  };

  onInit() {
    const root = this.context.root;
    const THREE = this.context.three;

    let planeRenderer: PlaneRenderer;
    for (const component of root.componentIterator()) {
      if (component.componentType === 'mp.daeLoader') {
        this.daeComponent = component;
      }
      else if (component.componentType === 'mp.planeRenderer') {
        planeRenderer = component as PlaneRenderer;
        planeRenderer.outputs.objectRoot.translateZ(0.05);
        planeRenderer.outputs.objectRoot.translateY(0.4);
        planeRenderer.outputs.objectRoot.scale.set(0.5, 0.5, 0.5);
      }
    }


    this.outputs.painter = this;

    this.mixer = new THREE.AnimationMixer(planeRenderer.outputs.objectRoot);

    const tm = 0.2;
    const positionTrack = new THREE.VectorKeyframeTrack('.scale', [0, tm], [
      0, 0, 0,
      0.5, 0.5, 0.5
    ], THREE.InterpolateSmooth);
    this.onEnterClip = new THREE.AnimationClip(null, tm, [positionTrack]);
  }

  onInputsUpdated() {
    const THREE = this.context.three;
    if (this.inputs.loadingState === 'Loaded') {
      const lines: LineSegments[] = [];
      this.daeComponent.outputs.objectRoot.traverse((obj: Object3D) => {
        // we dont want line segments, track them and remove them.
        if (obj.type === 'LineSegments') {
          lines.push(obj as LineSegments);
        }
        else if (obj.type === 'Mesh') {
          this.mesh = obj as Mesh;

          const material = this.mesh.material as MeshLambertMaterial;
          if (material && material.name === '_5b76dbe388862300126c1e14') {
            const newMaterial = new THREE.MeshBasicMaterial({ map: this.inputs.texture });
            this.mesh.material = newMaterial;
          }
        }
      });

      // remove the line segments.
      lines.forEach((line: LineSegments) => {
        line.parent.remove(line);
      });
    }
  }

  onEvent(eventType: string, eventData: unknown): void {
    if (eventType === HoverEvent) {
      const data: any = eventData;
      if (data.hover) {
        this.outputs.visible = true;
        const onEnterAction: AnimationAction = this.mixer.clipAction(this.onEnterClip);
        onEnterAction.stop();
        onEnterAction.loop = LoopOnce;
        onEnterAction.clampWhenFinished = true;
        onEnterAction.play();
      }
      else {
        this.outputs.visible = false;
      }
    }
  }

  paint(context2d: CanvasRenderingContext2D, size: Size): void {
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
    context2d.fillText(`${this.temperature}`, x-115, y+75);
  }

  onTick(delta: number) {
    this.currentTime += delta;

    if (this.mixer) {
      this.mixer.update(delta/1000);
    }

    if (this.currentTime > this.nextUpdate) {
      this.nextUpdate += this.inputs.updateInterval;

      this.temperature += (Math.random() * this.tempChangeRange);
      this.temperature = Math.trunc(this.temperature);

      if (this.temperature > 99) {
        this.temperature = 99;
        this.tempChangeRange = -this.tempChangeRange;
      }
      if (this.temperature < 10) {
        this.temperature = 10;
        this.tempChangeRange = -this.tempChangeRange;
      }

      this.notify(RepaintEvent);
    }
  }
}

export const nestThermostatType = 'mp.nestThermostat';
export const makeNestThermostat = function() {
  return new NestThermostat();
}
