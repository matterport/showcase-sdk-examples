import { CameraRig } from "./CameraRig";
import { Controls } from "./ControlBase";
import { Vector3, Euler, Quaternion } from "three";

export class FreeControls extends Controls {
  private localVelocity = new Vector3();
  private localRotation = new Euler();
  private localOrientation = new Quaternion();

  constructor(private cameraRig: CameraRig) {
    super(0.5, 2);
  }

  tick(deltaMsec: number) {
    super.tick(deltaMsec);

    this.localVelocity.copy(this.velocity).applyQuaternion(this.cameraRig.quaternion);
    this.cameraRig.position.add(this.localVelocity);

    this.localRotation.set(this.angularVelocity.x, this.angularVelocity.y, this.angularVelocity.z, 'YXZ');
    this.localOrientation.setFromEuler(this.localRotation);
    this.cameraRig.quaternion.multiply(this.localOrientation);

    // remove roll
    const euler = new Euler(0,0,0,'YXZ').setFromQuaternion(this.cameraRig.quaternion);
    euler.z = 0;
    this.cameraRig.quaternion.setFromEuler(euler);
  }
}
