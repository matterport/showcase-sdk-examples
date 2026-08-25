import { BehaviorSubject } from 'rxjs';
import { ISdk } from './Sdk';
import type * as THREEType from 'three';
import {
  sphereSourceType, boxSourceType,
  cameraInputType, makeCameraInput, CameraInputEvent,
  makeBoxSource, makePlaneRenderer, makeCanvasRenderer,
  makeNestThermostat, makeSphereSource, makeCylinderSource,
} from '@mp/common';
import { gridType, makeGrid } from './Grid';
import type { MpSdk } from '../../bundle/sdk';
import { IScene, CameraPose } from './interfaces';
import { splineCameraType, makeSplineCamera } from './SplineCamera';
import { closeupViewType, makeCloseUpView } from './CloseupView';

export const makeScene = (sdk: ISdk): IScene => {
  return new Scene(sdk);
};

class Scene implements IScene {
  public widget: MpSdk.Scene.IComponent|null = null;
  public cameraInput: MpSdk.Scene.IComponent|null = null;
  public sensor: MpSdk.Sensor.ISensor = null;
  public sceneObject: MpSdk.Scene.IObject = null;
  private _three: typeof THREEType = null;

  public get three(): typeof THREEType {
    return this._three;
  }

  constructor(private sdk: ISdk){
    this.setup = this.setup.bind(this);
    sdk.onChanged(this.setup);
  }

  private _objects: MpSdk.Scene.INode[] = [];
  private objectsSubject = new BehaviorSubject<MpSdk.Scene.INode[]>([]);
  public get objects() {
    return this.objectsSubject;
  }

  private _cameraPose: CameraPose = {
    position: { x:0, y:0, z:0 },
    rotation: { x: 0, y: 0 },
    projection: [],
  };
  private cameraPoseSubject = new BehaviorSubject<CameraPose>(this._cameraPose);
  public get cameraPose() {
    return this.cameraPoseSubject;
  }

  private async setup(sdk: MpSdk) {
    sdk.Camera.pose.subscribe((pose) => {
      this.cameraPoseSubject.next({
        position: {
          x: pose.position.x,
          y: pose.position.y,
          z: pose.position.z,
        },
        rotation: {
          x: pose.rotation.x,
          y: pose.rotation.y,
        },
        projection: pose.projection,
      });
    });

    await sdk.Scene.configure((_renderer: unknown, three: typeof THREEType) => {
      this._three = three;
    });

    await Promise.all([
      sdk.Scene.register(gridType, makeGrid),
      sdk.Scene.register(splineCameraType, makeSplineCamera),
      sdk.Scene.register(closeupViewType, makeCloseUpView),
      sdk.Scene.register('mp.planeRenderer', makePlaneRenderer(sdk)),
      sdk.Scene.register('mp.canvasRenderer', makeCanvasRenderer),
      sdk.Scene.register('mp.nestThermostat', makeNestThermostat),
      sdk.Scene.register(cameraInputType, makeCameraInput),
      sdk.Scene.register(sphereSourceType, makeSphereSource(sdk)),
      sdk.Scene.register(boxSourceType, makeBoxSource(sdk)),
      sdk.Scene.register('mp.cylinderSource', makeCylinderSource(sdk)),
    ]);
    this.sensor = await sdk.Sensor.createSensor(sdk.Sensor.SensorType.CAMERA);
    this.sensor.showDebug(true);

    [this.sceneObject] = await sdk.Scene.createObjects(1);

    const node = this.sceneObject.addNode();
    this.widget = node.addComponent('mp.transformControls');
    node.start();
    await this.createCameraControl(sdk);

    const grid = this.sceneObject.addNode();
    grid.name = 'Ground Plane';
    grid.addComponent(gridType);
    grid.start();
  }

  /**
   * Sets up a custom camera that replaces the default camera in DOLLHOUSE mode.
   * Uses a CameraInput component for WASD/mouse orbit controls, and an mp.input component
   * to capture user interactions. The two are wired together via bindPath.
   *
   * The custom camera is only active in DOLLHOUSE mode. When leaving dollhouse, control
   * is handed back to the default camera. On re-entry, the current camera pose
   * is captured so the custom camera picks up where the default camera left off.
   *
   * A right-click drag in floorplan mode can seamlessly transition into dollhouse without
   * a formal Mode.transition. To prevent the custom camera from hijacking a drag already
   * in progress, we spy on drag events and defer the takeover until the drag ends.
   */
  private async createCameraControl(sdk: MpSdk) {
    const THREE = this.three;
    // camera override only works in dollhouse, so wait until we're in that mode
    await sdk.Mode.current.waitUntil(
      (mode: string) => mode === sdk.Mode.Mode.DOLLHOUSE
    );
    const cameraNode = this.sceneObject.addNode();
    const cameraPose = await sdk.Camera.getPose();
    this.cameraInput = cameraNode.addComponent(cameraInputType);
    // SDK pose uses row-major projection and degrees — convert to THREE.js conventions
    this.cameraInput.inputs.startPose = {
      position: new THREE.Vector3(cameraPose.position.x, cameraPose.position.y, cameraPose.position.z),
      quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(
        cameraPose.rotation.x * Math.PI / 180,
        cameraPose.rotation.y * Math.PI / 180,
        0,
        'YXZ')),
      projection: new THREE.Matrix4().fromArray(cameraPose.projection).transpose(),
    };
    const cameraControl = cameraNode.addComponent('mp.camera', {
      enabled: true,
    });
    this.sceneObject.bindPath(
      this.sceneObject.addInputPath(cameraControl, 'camera'),
      this.sceneObject.addOutputPath(this.cameraInput, 'camera'),
    );
    // mp.input captures mouse/keyboard and emits interaction events.
    // userNavigationEnabled=false disables the default camera when our custom one is active.
    const input = cameraNode.addComponent('mp.input', {
      userNavigationEnabled: false,
      unfiltered: false,
    });
    // Route interaction events from mp.input → CameraInput
    this.sceneObject.bindPath(
      this.sceneObject.addEventPath(this.cameraInput, CameraInputEvent.DragBegin),
      this.sceneObject.addEmitPath(input, sdk.Scene.InteractionType.DRAG_BEGIN),
    );
    this.sceneObject.bindPath(
      this.sceneObject.addEventPath(this.cameraInput, CameraInputEvent.Drag),
      this.sceneObject.addEmitPath(input, sdk.Scene.InteractionType.DRAG),
    );
    this.sceneObject.bindPath(
      this.sceneObject.addEventPath(this.cameraInput, CameraInputEvent.DragEnd),
      this.sceneObject.addEmitPath(input, sdk.Scene.InteractionType.DRAG_END),
    );
    this.sceneObject.bindPath(
      this.sceneObject.addEventPath(this.cameraInput, CameraInputEvent.Key),
      this.sceneObject.addEmitPath(input, sdk.Scene.InteractionType.KEY),
    );
    this.sceneObject.bindPath(
      this.sceneObject.addEventPath(this.cameraInput, CameraInputEvent.Scroll),
      this.sceneObject.addEmitPath(input, sdk.Scene.InteractionType.SCROLL),
    );

    cameraNode.start();

    // Track drag state so we don't take over mid-drag.
    // A right-click drag in floorplan can trigger a seamless transition to dollhouse
    // without going through Mode.transition — if we enable the custom camera while the
    // user is still dragging, it intercepts the ongoing drag and causes erratic zooming.
    let dragging = false;
    let onDragEnd: (() => void) | null = null;
    const dragBeginSpy = {
      id: 'cameraControl-dragBegin',
      path: this.sceneObject.addEmitPath(input, sdk.Scene.InteractionType.DRAG_BEGIN),
      onEvent: () => { dragging = true; },
    };
    const dragEndSpy = {
      id: 'cameraControl-dragEnd',
      path: this.sceneObject.addEmitPath(input, sdk.Scene.InteractionType.DRAG_END),
      onEvent: () => {
        dragging = false;
        if (onDragEnd) {
          onDragEnd();
          onDragEnd = null;
        }
      },
    };
    this.sceneObject.spyOnEvent(dragBeginSpy);
    this.sceneObject.spyOnEvent(dragEndSpy);

    sdk.Mode.current.subscribe(async (mode) => {
      const inDollhouse = mode === sdk.Mode.Mode.DOLLHOUSE;
      if (!inDollhouse) {
        // Hand control back to the SDK's default camera
        cameraControl.inputs.enabled = false;
        input.inputs.userNavigationEnabled = true;
        return;
      }
      // Defer takeover until any in-progress drag completes
      if (dragging) {
        await new Promise<void>((resolve) => { onDragEnd = resolve; });
      }
      // Recapture the camera's current pose so we pick up where it left off
      const pose = await sdk.Camera.pose.waitUntil((p) => !!p);
      this.cameraInput.inputs.startPose = {
        position: new THREE.Vector3(pose.position.x, pose.position.y, pose.position.z),
        quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(
          pose.rotation.x * Math.PI / 180,
          pose.rotation.y * Math.PI / 180,
          0,
          'YXZ')),
        projection: new THREE.Matrix4().fromArray(pose.projection).transpose(),
      };
      cameraControl.inputs.enabled = true;
      input.inputs.userNavigationEnabled = false;
    });
  }

  public async deserialize(serialized: string) {
    const sceneObject = await this.sdk.sdk.Scene.deserialize(serialized);
    const nodes: MpSdk.Scene.INode[] = [...sceneObject.nodeIterator()];

    const added: MpSdk.Scene.INode[] = [];
    for (const node of nodes) {
      for (const component of node.componentIterator()) {
        // If the component is a source component, then set inputs.sensor
        if (component.componentType === sphereSourceType || component.componentType === boxSourceType) {
          component.inputs.sensor = this.sensor;
        }
      }
      node.start();
      added.push(node);
    }

    if (added.length > 0) {
      this._objects = this._objects.concat(added);
      this.objectsSubject.next(this._objects);
    }
  }

  public async serialize(): Promise<string>  {
    return await this.sdk.sdk.Scene.serialize(this._objects);
  }

  /**
   * Returns a position for spawning new objects.
   * In INSIDE mode, places the object 2m in front of the camera along its
   * horizontal forward direction (ignoring pitch), at the camera's current
   * height so it appears in view. In other modes (DOLLHOUSE, FLOORPLAN),
   * returns the origin.
   */
  public async getSpawnPosition(): Promise<MpSdk.Vector3> {
    const sdk = this.sdk.sdk;
    const mode = await sdk.Mode.current.waitUntil((m) => !!m);
    if (mode !== sdk.Mode.Mode.INSIDE) {
      return { x: 0, y: 0, z: 0 };
    }
    const pose = await sdk.Camera.pose.waitUntil((p) => !!p);
    const yaw = pose.rotation.y * Math.PI / 180;
    return {
      x: pose.position.x - Math.sin(yaw) * 2,
      y: pose.position.y,
      z: pose.position.z - Math.cos(yaw) * 2,
    };
  }

  public addObject(node: MpSdk.Scene.INode): void {
    this._objects.push(node);
    this.objectsSubject.next(this._objects);
  }

  public removeObject(node: MpSdk.Scene.INode): void {
    const searchIndex = this._objects.findIndex((item) => item === node);
    if (searchIndex !== -1) {
      this._objects.splice(searchIndex, 1);
      this.objectsSubject.next(this._objects);
    }
  }

  public reset(): void {
    for (const obj of this._objects) {
      obj.stop();
    }
    this._objects = [];
    this.objectsSubject.next(this._objects);
    this.sensor.dispose();
    this.sdk.sdk.Sensor.createSensor(this.sdk.sdk.Sensor.SensorType.CAMERA).then((sensor) => {
      this.sensor = sensor;
    });
  }
}
