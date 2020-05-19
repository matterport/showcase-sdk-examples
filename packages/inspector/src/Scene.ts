import { BehaviorSubject } from 'rxjs';
import { ISdk } from './Sdk';
import { Vector3, Quaternion, Object3D } from 'three';

export interface IComponentDefinition {
  type: string;
  name?: string;
  inputs?: { [key: string]: any };
  position: number[];
  rotation: number[];
  scale: number[];
}

export interface ISceneComponent {
  inputs?: { [key: string]: any };
  outputs?: { [key: string]: any };
}

export interface ISceneNode {
  name: string;
  readonly position: Vector3;
  readonly quaternion: Quaternion;
  readonly scale: Vector3;
  addComponent(type: string, initial?: { [key: string]: any }): void;
  start(): void;
  stop(): void;
  // need a way for external things to connect to the scene nodes Object3D.
  // For now, directly exposing obj3D.
  obj3D: Object3D;
}

export interface IScene {
  readonly objects: BehaviorSubject<ISceneNode[]>;
  deserialize(serialized: string): Promise<void>;
  serialize(): Promise<string>;
}

export const makeScene = (sdk: any): IScene => {
  return new Scene(sdk);
};

class Scene implements IScene {
  constructor(private sdk: ISdk){}

  private _objects: ISceneNode[] = [];
  private objectsSubject = new BehaviorSubject<ISceneNode[]>([]);
  public get objects() {
    return this.objectsSubject;
  }

  public async deserialize(serialized: string) {
    const nodes: any[] = await this.sdk.sdk.Scene.deserialize(serialized);

    const toRemove = this._objects.splice(0);
    for (const remove of toRemove) {
      remove.stop();
    }

    const added: ISceneNode[] = [];
    for (const node of nodes) {
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
}
