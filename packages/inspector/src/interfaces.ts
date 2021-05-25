import { ISdk } from './Sdk';
import { BehaviorSubject } from 'rxjs';
import { SceneComponent, ISceneNode, IVector2, IVector3 } from '@mp/common';

export interface IContext {
  scene: IScene;
  sdk: ISdk;
  frameOverlay: BehaviorSubject<IDialogUser|null>;
}

export interface IMenuCommand<T> {
  dialogUser(): IDialogUser|null;
  execute(): Promise<T>;
}

export interface IScene {
  readonly objects: BehaviorSubject<ISceneNode[]>;
  readonly cameraPose: BehaviorSubject<CameraPose>;
  readonly widget: SceneComponent|null;
  readonly cameraInput: SceneComponent|null;
  readonly sensor: any;

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
  addObject(node: ISceneNode): void;
  removeObject(node: ISceneNode): void;
  
  /**
   * Restores the inspector to the it's default state by removing all non-inspector scene nodes.
   */
  reset(): void;
}

export type CameraPose = {
  position: IVector3;
  rotation: IVector2;
  projection: number[];
};

export interface IDialogUser {
  jsx(): JSX.Element;
  onComplete(url: string): void;
  onCancelled(): void;
}

export type MenuCommandFactory = (selection: ISceneNode[]) => IMenuCommand<void>;
