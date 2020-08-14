import { Axis } from "./Axis";
import { ICameraController } from "./ICameraController";

export enum Keys {
  W = 87,
  A = 65,
  S = 83,
  D = 68,
  Q = 81,
  E = 69,
  LEFT = 37,
  RIGHT = 39,
  UP = 38,
  DOWN = 40,
  SHIFT = 16,
  SPACE = 32,
}

export interface HasControls {
  controls: ICameraController;
}

export class CameraInputMap {
  private keyDownMap: Indexable<boolean> = {};
  constructor(private controlMap: Indexable<[Axis, keyof ICameraController, number]>, private controller: HasControls) {}

  onKeyDown(keyCode: number): boolean {
    const inputMap = this.controlMap[keyCode];
    if (inputMap) {
      const [axis, accFunc, dir] = inputMap;
      const speed = 1.5;
      this.controller.controls[accFunc](axis, dir * speed);
      this.keyDownMap[keyCode] = true;
      return true;
    }
    return false;
  }

  onKeyUp(keyCode: number): boolean {
    const inputMap = this.controlMap[keyCode];
    if (inputMap) {
      const [axis, accFunc] = inputMap;
      this.controller.controls[accFunc](axis, 0);
      this.keyDownMap[keyCode] = false;
      return true;
    }
    return false;
  }

  onMouseDown(x: number, y: number) {
  }

  onMouseMove(deltaX: number, deltaY: number) {
    this.controller.controls.setAngularVelocity(Axis.X, -deltaY * 3.0);
    this.controller.controls.setAngularVelocity(Axis.Y, deltaX * 3.0);
  }

  onMouseUp() {
    // this.controller.controls.setAngularVelocity(Axis.X, 0);
    // this.controller.controls.setAngularVelocity(Axis.Y, 0);
  }

  onScroll(deltaY: number) {
    this.controller.controls.setVelocity(Axis.Z, deltaY * 0.01);
  }
}

type Indexable<T> = {
  [key: number]: T | undefined;
}
