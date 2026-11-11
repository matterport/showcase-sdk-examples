import type { CameraRig } from './CameraRig';
import { Controls } from './ControlBase';
import type { Vector3, Euler, Quaternion } from 'three';
import type * as THREEType from 'three';

export class FreeControls extends Controls {
  private localVelocity: Vector3;
  private localRotation: Euler;
  private localOrientation: Quaternion;
  private THREE: typeof THREEType;

  constructor(private cameraRig: CameraRig, THREE: typeof THREEType) {
    super(0.5, 2, THREE);
    this.THREE = THREE;
    this.localVelocity = new THREE.Vector3();
    this.localRotation = new THREE.Euler();
    this.localOrientation = new THREE.Quaternion();
  }

  tick(deltaMsec: number) {
    super.tick(deltaMsec);

    this.localVelocity.copy(this.velocity).applyQuaternion(this.cameraRig.quaternion);
    this.cameraRig.position.add(this.localVelocity);

    this.localRotation.set(this.angularVelocity.x, this.angularVelocity.y, this.angularVelocity.z, 'YXZ');
    this.localOrientation.setFromEuler(this.localRotation);
    this.cameraRig.quaternion.multiply(this.localOrientation);

    // remove roll
    const euler = new this.THREE.Euler(0, 0, 0, 'YXZ').setFromQuaternion(this.cameraRig.quaternion);
    euler.z = 0;
    this.cameraRig.quaternion.setFromEuler(euler);
  }
}
