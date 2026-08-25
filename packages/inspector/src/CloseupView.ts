import type { MpSdk } from '../../bundle/sdk';
import type { PerspectiveCamera, Object3D, Vector3, Quaternion, Matrix4 } from 'three';
import TWEEN from '@tweenjs/tween.js';

type Position = {
  x: number;
  y: number;
  z: number;
};

type Pose = {
  position: Vector3;
  rotation: Quaternion;
  projection: Matrix4;
};

enum Event {
  OnAccessGranted = 'ONACCESSGRANTED',
  OnAccessRevoked = 'ONACCESSREVOKED',
}

type Inputs = {
  target: MpSdk.Scene.INode;
  duration: number;
};

type Outputs = {
  camera: null | PerspectiveCamera;
};

export const makeCloseUpView: MpSdk.Scene.IComponentFactory<Inputs, Outputs> = () => {
  let camera: PerspectiveCamera;
  let time = 0;
  const position: Position = {
    x: 0,
    y: 0,
    z: 0,
  };
  let tween: any;
  let quaternionTween: any;
  const quaternionTime = {
    t: 0,
  };
  let posComplete = false;
  let quatComplete = false;

  return {
    inputs: {
      target: null,
      duration: 1,
    },

    outputs: {
      camera: null,
    },

    events: {
      [Event.OnAccessGranted]: true,
      [Event.OnAccessRevoked]: true,
    },

    onInit() {
      camera = new this.context.three.PerspectiveCamera();
      this.outputs.camera = camera;
    },

    onTick(delta) {
      time += delta;

      let matrixChanged = false;
      if (tween && !posComplete) {
        tween.update(time);
        camera.position.set(position.x, position.y, position.z);
        matrixChanged = true;
      }

      if (quaternionTween && !quatComplete) {
        quaternionTween.update(time);
        matrixChanged = true;
      }

      if (matrixChanged) {
        camera.updateMatrixWorld();
      }
    },

    onEvent(eventType, eventData) {
      const data = eventData as { pose: Pose };
      switch (eventType) {
        case Event.OnAccessGranted: {
          const THREE = this.context.three;
          const startPose = data.pose;
          // NOTE: obj3D is an undocumented runtime property on INode — the SDK does not
          // expose getWorldDirection or setFromObject on INode, so we must use obj3D here.
          const obj3D = (this.inputs.target as unknown as { obj3D: Object3D }).obj3D;
          const forward = new THREE.Vector3();
          obj3D.getWorldDirection(forward);

          const boundingBox = new THREE.Box3().setFromObject(obj3D);
          const size = new THREE.Vector3();
          boundingBox.getSize(size);
          const sphere = new THREE.Sphere();
          boundingBox.getBoundingSphere(sphere);

          const z = sphere.radius * 2 / 2 / Math.tan(Math.PI * 70 / 360);

          forward.multiplyScalar(z);

          const targetPosition = new THREE.Vector3().copy(this.inputs.target.position);
          targetPosition.add(forward);

          const m = new THREE.Matrix4();
          m.lookAt(targetPosition, this.inputs.target.position, new THREE.Vector3(0, 1, 0));

          const q = new THREE.Quaternion();
          q.setFromRotationMatrix(m);

          const target = {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
          };

          camera.position.copy(startPose.position);
          camera.quaternion.copy(startPose.rotation);
          camera.projectionMatrix.copy(startPose.projection);
          camera.updateMatrixWorld();
          position.x = startPose.position.x;
          position.y = startPose.position.y;
          position.z = startPose.position.z;

          tween = new TWEEN.Tween<Position>(position)
            .to(target)
            .easing(TWEEN.Easing.Cubic.InOut)
            .duration(this.inputs.duration * 1000)
            .onComplete(() => {
              posComplete = true;
            })
            .start(0);

          const dummy = new THREE.PerspectiveCamera();
          const qStart = new THREE.Quaternion();
          const qEnd = new THREE.Quaternion();

          // tween
          quaternionTween = new TWEEN.Tween(quaternionTime)
            .to({ t: 1.0 }, this.inputs.duration * 1000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onStart(() => {
              dummy.position.copy(camera.position);
              dummy.lookAt(new THREE.Vector3().set(target.x, target.y, target.z));
              qStart.copy(camera.quaternion);
              qEnd.copy(q);
            })
            .onUpdate((obj, tm) => {
              camera.quaternion.copy(qStart);
              camera.quaternion.slerp(qEnd, tm);
            })
            .onComplete(() => {
              camera.quaternion.copy(qEnd);
              quatComplete = true;
            })
            .start(0);
          break;
        }
        case Event.OnAccessRevoked:
          break;
      }
    },
  };
};

export const closeupViewType = 'closeupView';
