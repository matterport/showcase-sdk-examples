import { BehaviorSubject } from 'rxjs';
import { ISdk } from './Sdk';
import { Vector3, Quaternion, Matrix4, Euler } from 'three';
import { initComponents, ComponentInteractionType, sphereSourceType } from '@mp/common';
import { gridType, makeGrid } from './Grid';
import { cameraInputType, CameraInputEvent } from '@mp/common/src/sdk-components/Camera';
import { IScene, CameraPose } from './interfaces';
import { SceneComponent, ISceneNode } from '@mp/common';
import { splineCameraType, makeSplineCamera } from './SplineCamera';
import { closeupViewType, makeCloseUpView } from './CloseupView';
import { boxSourceType } from '@mp/common/src/sdk-components/BoxSource';

export const makeScene = (sdk: any): IScene => {
  return new Scene(sdk);
};

class Scene implements IScene {
  public widget: SceneComponent|null = null;
  public cameraInput: SceneComponent|null = null;
  public sensor: any = null;

  constructor(private sdk: ISdk){
    this.setup = this.setup.bind(this);
    sdk.onChanged(this.setup);
  }

  private _objects: ISceneNode[] = [];
  private objectsSubject = new BehaviorSubject<ISceneNode[]>([]);
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
  
  private async setup(sdk: any) {
    sdk.Camera.pose.subscribe((pose: any) => {
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

    await Promise.all([
      sdk.Scene.register(gridType, makeGrid),
      sdk.Scene.register(splineCameraType, makeSplineCamera),
      sdk.Scene.register(closeupViewType, makeCloseUpView),
      initComponents(sdk),
    ]);
    this.sensor = await sdk.Sensor.createSensor(sdk.Sensor.SensorType.CAMERA);
    this.sensor.showDebug(true);
  
    const node = await sdk.Scene.createNode();
    this.widget = node.addComponent('mp.transformControls');
    node.start();
    await this.createCameraControl(sdk);

    const grid = await sdk.Scene.createNode();
    grid.name = 'Ground Plane';
    grid.addComponent(gridType);
    grid.start();
  }

  private async createCameraControl(theSdk: any) {
    // camera override only works in dollhouse, so wait until we're in that mode
    await theSdk.Mode.current.waitUntil(
      (mode: any) => mode === theSdk.Mode.Mode.DOLLHOUSE
    );
    const cameraNode = await theSdk.Scene.createNode();
    const cameraPose = await theSdk.Camera.getPose();
    this.cameraInput = cameraNode.addComponent(cameraInputType);
    const poseMatrix = new Matrix4();
    poseMatrix.fromArray(cameraPose.projection)
    this.cameraInput.inputs.startPose = {
      position: new Vector3(cameraPose.position.x, cameraPose.position.y, cameraPose.position.z),
      quaternion: new Quaternion().setFromEuler(new Euler(
        cameraPose.rotation.x * Math.PI / 180,
        cameraPose.rotation.y * Math.PI / 180,
        0,
        'YXZ')),
      projection: poseMatrix,
    };
    const cameraControl = cameraNode.addComponent('mp.camera', {
      enabled: true,
    });
    cameraControl.bind('camera', this.cameraInput, 'camera');
    const input = cameraNode.addComponent('mp.input', {
      userNavigationEnabled: false,
      unfiltered: false,
    }) as SceneComponent;
    this.cameraInput.bindEvent(CameraInputEvent.DragBegin, input, ComponentInteractionType.DRAG_BEGIN);
    this.cameraInput.bindEvent(CameraInputEvent.Drag, input, ComponentInteractionType.DRAG);
    this.cameraInput.bindEvent(CameraInputEvent.DragEnd, input, ComponentInteractionType.DRAG_END);
    this.cameraInput.bindEvent(CameraInputEvent.Key, input, ComponentInteractionType.KEY);
    this.cameraInput.bindEvent(CameraInputEvent.Scroll, input, ComponentInteractionType.SCROLL);

    cameraNode.start();
  }

  public async deserialize(serialized: string) {
    const nodes: ISceneNode[] = await this.sdk.sdk.Scene.deserialize(serialized);

    const added: ISceneNode[] = [];
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

  public addObject(node: ISceneNode): void {
    this._objects.push(node);
    this.objectsSubject.next(this._objects);
  }

  public removeObject(node: ISceneNode): void {
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
    this.sdk.sdk.Sensor.createSensor(this.sdk.sdk.Sensor.SensorType.CAMERA).then((sensor: any) => {
      this.sensor = sensor;
    });
  }
}
