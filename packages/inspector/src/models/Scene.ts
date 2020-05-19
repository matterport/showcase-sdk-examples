import { Vector3, Quaternion, Object3D } from 'three';

export class SceneNode {
  private intervalId: number = -1;
  constructor(private node: ISceneNode) {}
  
  public start() {
    this.intervalId = setInterval(() => {
      this.position.set(this.node.position.x, this.node.position.y, this.node.position.z);
      this.rotation.set(this.node.quaternion.x, this.node.quaternion.y, this.node.quaternion.z, this.node.quaternion.w);
      this.scale.set(this.node.scale.x, this.node.scale.y, this.node.scale.z);
    });
  }

  public stop() {
    if (this.intervalId !== -1) {
      clearInterval(this.intervalId);
      this.intervalId = -1;
    }
  }

  position: Vector3 = new Vector3();
  rotation: Quaternion = new Quaternion();
  scale: Vector3 = new Vector3();
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

export interface ISceneComponent {
  inputs?: { [key: string]: any };
  outputs?: { [key: string]: any };
}
