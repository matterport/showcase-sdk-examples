import { Object3D, Camera, Vector3, Quaternion } from "three";

const WORLD_UP = new Vector3(0, 1, 0);
/**
 * A camera with an extra pivot (rig)
 */
export class CameraRig extends Object3D {
  private tempVec = new Vector3();
  private tempQuat = new Quaternion();
  constructor(public camera: Camera) {
    super();
    this.add(camera);
  }

  setFocus(focalPoint: Vector3) {
    // reset the transforms to do calculations in world-space
    this.clearFocus();
    const camWorld = new Vector3();
    this.camera.getWorldPosition(camWorld);
    const focalRadius = camWorld.distanceTo(focalPoint);

    // when focusing, set the base's orientation ...
    this.lookAt(focalPoint);
    // ... remove any rotation from the camera itself ...
    this.camera.quaternion.set(0, 0, 0, 1);
    // ... and set the rig base at the focal point
    this.position.copy(focalPoint);

    // maintain the camera's distance to the focal point by offsetting it by the focal distance
    this.camera.position.set(0, 0, focalRadius);

    // update all of our matrices
    this.updateMatrixWorld();
  }

  clearFocus() {
    // when no longer focusing, set the rig base to the camera position and set the camera offset to 0
    this.camera.getWorldPosition(this.position);
    this.camera.position.set(0, 0, 0);
    this.updateMatrixWorld();
  }

  lookAt(point: Vector3) {
    // THREE.js's `lookAt` functions are lacking
    // THREE.js's `lookAt` branches between two different behaviors based on an `isCamera` and `isLight` boolean that is part of `Camera` and `Light`.
    // since this is a "camera", but only extends `Object3D`, AND because we support upside-down orientations, we have to use the underlying `Matrix4.lookAt`
    this.getWorldPosition(this.tempVec);
    this.getWorldQuaternion(this.tempQuat);

    // get our local up and compare to world up ...
    const up = new Vector3(0, 1, 0).applyQuaternion(this.tempQuat);
    const upDot = up.dot(WORLD_UP);
    // ... copy WORLD_UP to remove any roll from the camera ...
    up.copy(WORLD_UP);
    // ... and if we're upside down, negate up to maintain being upside-down
    if (upDot < 0) {
      up.copy(WORLD_UP).negate();
    }
    this.matrixWorld.lookAt(this.tempVec, point, up);
    this.matrixWorld.decompose(this.position, this.quaternion, this.tempVec); // decompose to avoid THREE.js blowing away the values encoded in our matrix
  }

  updateMatrixWorld() {
    super.updateMatrixWorld();
    this.camera.updateMatrixWorld();
  }

}
