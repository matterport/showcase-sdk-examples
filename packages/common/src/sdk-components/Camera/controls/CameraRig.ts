import type { Object3D, Camera, Vector3 } from 'three';
import type * as THREEType from 'three';

export type CameraRig = Object3D & {
  camera: Camera;
  setFocus(focalPoint: Vector3): void;
  clearFocus(): void;
  customLookAt(point: Vector3): void;
};

/**
 * Factory for a CameraRig — a camera with an extra pivot (for orbit/flight controls).
 * Factory rather than class so the returned object extends the bundle's THREE.Object3D.
 */
export function makeCameraRig(camera: Camera, THREE: typeof THREEType): CameraRig {
  class CameraRigImpl extends THREE.Object3D {
    private readonly WORLD_UP = new THREE.Vector3(0, 1, 0);
    private tempVec = new THREE.Vector3();
    private tempQuat = new THREE.Quaternion();
    constructor(public camera: Camera) {
      super();
      this.add(camera);
    }

    setFocus(focalPoint: Vector3) {
      // reset the transforms to do calculations in world-space
      this.clearFocus();
      const camWorld = new THREE.Vector3();
      this.camera.getWorldPosition(camWorld);
      const focalRadius = camWorld.distanceTo(focalPoint);

      // when focusing, set the base's orientation ...
      this.customLookAt(focalPoint);
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

    customLookAt(point: Vector3) {
      // THREE.js's `lookAt` functions are lacking
      // THREE.js's `lookAt` branches between two different behaviors based on an `isCamera` and `isLight` boolean that is part of `Camera` and `Light`.
      // since this is a "camera", but only extends `Object3D`, AND because we support upside-down orientations, we have to use the underlying `Matrix4.lookAt`
      this.getWorldPosition(this.tempVec);
      this.getWorldQuaternion(this.tempQuat);

      // get our local up and compare to world up ...
      const up = this.WORLD_UP.clone().applyQuaternion(this.tempQuat);
      const upDot = up.dot(this.WORLD_UP);
      // ... copy WORLD_UP to remove any roll from the camera ...
      up.copy(this.WORLD_UP);
      // ... and if we're upside down, negate up to maintain being upside-down
      if (upDot < 0) {
        up.copy(this.WORLD_UP).negate();
      }
      this.matrixWorld.lookAt(this.tempVec, point, up);
      this.matrixWorld.decompose(this.position, this.quaternion, this.tempVec); // decompose to avoid THREE.js blowing away the values encoded in our matrix
    }

    updateMatrixWorld() {
      super.updateMatrixWorld();
      this.camera.updateMatrixWorld();
    }
  }

  return new CameraRigImpl(camera);
}
