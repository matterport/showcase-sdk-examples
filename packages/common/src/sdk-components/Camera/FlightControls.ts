import { CameraRig } from "./CameraRig";
import { Controls } from "./ControlBase";
import { Quaternion, Euler, Vector3 } from "three";

/**
 * A control scheme that has a focal point. Often referred to orbit controls
 * Controls:
 *   accelerate around the x, y, z axes of the rig base
 *   accelerate the camera away/toward the rig base
 */
export class FlightControls extends Controls {
  private localVelocity = new Vector3();
  private pivotRotation = new Euler();
  private pivotOrientation = new Quaternion();

  constructor(private cameraRig: CameraRig) {
    super(0.5, 1);
  }

  tick(deltaMsec: number) {
    super.tick(deltaMsec);

    // don't allow the camera to move linearly, except away/toward the rig base
    this.localVelocity.set(0, 0, this.velocity.z);
    // don't let the position go negative, beyond the focal point by clamping the velocity
    this.localVelocity.z = Math.max(this.localVelocity.z, -this.cameraRig.camera.position.z);

    this.cameraRig.camera.position.add(this.localVelocity);

    this.pivotRotation.set(-this.angularVelocity.x, -this.angularVelocity.y, 0, 'YXZ');
    this.pivotOrientation.setFromEuler(this.pivotRotation);
    this.cameraRig.quaternion.multiplyQuaternions(this.cameraRig.quaternion, this.pivotOrientation);
    
    // remove roll
    const euler = new Euler(0,0,0,'YXZ').setFromQuaternion(this.cameraRig.quaternion);
    euler.z = 0;
    this.cameraRig.quaternion.setFromEuler(euler);
  }
}
