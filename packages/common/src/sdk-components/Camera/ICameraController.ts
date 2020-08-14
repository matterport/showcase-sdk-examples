import { Axis } from "./Axis";

export interface ICameraController {
  setAngularVelocity(axis: Axis, velocity: number): void;
  setVelocity(axis: Axis, velocity: number): void;
  accelerate(axis: Axis, force: number): void;
  accelerateAround(axis: Axis, torque: number): void;

  haltAcceleration(): void;
  haltAngularAcceleration(): void;

  halt(): void;

  tick(deltaT: number): void;
}
