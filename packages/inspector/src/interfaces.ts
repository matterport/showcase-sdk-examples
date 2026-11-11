import type { MpSdk } from '../../bundle/sdk';
import type * as THREEType from 'three';
import { ISdk } from './Sdk';
import { BehaviorSubject } from 'rxjs';


export interface IAppContext {
  scene: IScene;
  sdk: ISdk;
  frameOverlay: BehaviorSubject<IDialogUser|null>;
}

export interface IMenuCommand<T> {
  dialogUser(): IDialogUser|null;
  execute(): Promise<T>;
}

export interface IScene {
  readonly objects: BehaviorSubject<MpSdk.Scene.INode[]>;
  readonly cameraPose: BehaviorSubject<CameraPose>;
  readonly widget: MpSdk.Scene.IComponent|null;
  readonly cameraInput: MpSdk.Scene.IComponent|null;
  readonly sensor: MpSdk.Sensor.ISensor;
  readonly sceneObject: MpSdk.Scene.IObject;
  readonly three: typeof THREEType;

  /**
   * This function deserializes the provided string into scene nodes.
   * Additionally, it starts the scene nodes right away.
   * @param serialized serialized scene objects
   */
  deserialize(serialized: string): Promise<void>;

  /**
   * Serialize the entire scene to a string.
   */
  serialize(): Promise<string>;
  addObject(node: MpSdk.Scene.INode): void;
  removeObject(node: MpSdk.Scene.INode): void;

  /**
   * Returns a position 2m in front of the camera along its horizontal forward
   * direction (ignoring pitch), at the camera's current height.
   */
  getSpawnPosition(): Promise<MpSdk.Vector3>;

  /**
   * Restores the inspector to the it's default state by removing all non-inspector scene nodes.
   */
  reset(): void;
}

export type CameraPose = {
  position: MpSdk.Vector3;
  rotation: MpSdk.Vector2;
  projection: number[] | Float32Array;
};

export interface IDialogUser {
  jsx(): JSX.Element;
  onComplete(url: string): void;
  onCancelled(): void;
}

export type MenuCommandFactory = (selection: MpSdk.Scene.INode[]) => IMenuCommand<void>;
