import { ICameraController } from "./ICameraController";
import { Axis } from "./Axis";
import { Vector3 } from "three";

type KeyedMap<E extends {}, V = any> = {
  [key in Extract<E[keyof E], number | string>]: V;
};

export abstract class Controls implements ICameraController {
  private accelerationMap: KeyedMap<typeof Axis, number> = {
    [Axis.X]: 0,
    [Axis.Y]: 0,
    [Axis.Z]: 0,
  };
  private angularAccelerationMap: KeyedMap<typeof Axis, number> = {
    [Axis.X]: 0,
    [Axis.Y]: 0,
    [Axis.Z]: 0,
  };

  private acceleration = new Vector3();
  private angularAcceleration = new Vector3();

  private preAccelVel = new Vector3();
  protected velocity = new Vector3();
  protected angularVelocity = new Vector3();

  private friction = 13;

  constructor(private drag: number, private angularDrag: number) { }

  setAngularVelocity(axis: Axis, velocity: number) {
    switch(axis) {
      case Axis.X:
        this.angularVelocity.x = velocity;
        break;
      case Axis.Y:
        this.angularVelocity.y = velocity;
        break;
      case Axis.Z:
        this.angularVelocity.z = velocity;
        break;
    }
  }

  setVelocity(axis: Axis, velocity: number): void {
    switch(axis) {
      case Axis.X:
        this.velocity.x = velocity;
        break;
      case Axis.Y:
        this.velocity.y = velocity;
        break;
      case Axis.Z:
        this.velocity.z = velocity;
        break;
    }
  }
 
  accelerate(axis: Axis, force: number) {
    this.accelerationMap[axis] = force;
  }

  accelerateAround(axis: Axis, torque: number) {
    this.angularAccelerationMap[axis] = torque;
  }

  haltAcceleration() {
    this.accelerationMap[Axis.X] = 0;
    this.accelerationMap[Axis.Y] = 0;
    this.accelerationMap[Axis.Z] = 0;
    this.acceleration.set(0, 0, 0);
  }

  haltAngularAcceleration() {
    this.angularAccelerationMap[Axis.X] = 0;
    this.angularAccelerationMap[Axis.Y] = 0;
    this.angularAccelerationMap[Axis.Z] = 0;
    this.angularAcceleration.set(0, 0, 0);
  }

  halt() {
    this.haltAcceleration();
    this.haltAngularAcceleration();

    this.velocity.set(0, 0, 0);
    this.angularVelocity.set(0, 0, 0);
  }

  tick(deltaMsec: number) {
    const deltaSec = deltaMsec / 1000;
    this.acceleration.set(this.accelerationMap[Axis.X], this.accelerationMap[Axis.Y], this.accelerationMap[Axis.Z]);
    this.angularAcceleration.set(this.angularAccelerationMap[Axis.X], this.angularAccelerationMap[Axis.Y], this.angularAccelerationMap[Axis.Z]);

    this.updateVel(this.velocity, this.acceleration, this.drag, this.friction, deltaSec);
    this.updateVel(this.angularVelocity, this.angularAcceleration, this.angularDrag, this.friction, deltaSec);
  }

  private updateVel(velVec: Vector3, accelVec: Vector3, dragFactor: number, friction: number, deltaSec: number) {
    this.preAccelVel.copy(velVec);
    const velMagSq = this.preAccelVel.lengthSq();
    const dragMag = (0.5 * velMagSq * dragFactor + friction) * deltaSec;
    velVec.addScaledVector(accelVec, deltaSec);
    velVec.addScaledVector(this.preAccelVel, (velMagSq < 0 ? Math.max(dragMag, 0) : Math.min(-dragMag, 0)));

    if (velVec.lengthSq() < 1e-9) {
      velVec.setScalar(0);
    }
  }
}
