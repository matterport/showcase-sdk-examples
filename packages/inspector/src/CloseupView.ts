import { SceneComponent, ComponentOutput, ISceneNode } from '@mp/common';
import { Camera, Object3D, Vector3, Quaternion, Matrix4 } from 'three';
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
  target: ISceneNode;
  duration: number;
};

type Outputs = {
  camera: null | Camera;
} & ComponentOutput;

type Events = {
  [Event.OnAccessGranted]: boolean;
  [Event.OnAccessRevoked]: boolean;
};

class CloseupView extends SceneComponent {
  private camera: Camera;
  private time = 0;
  private position: Position = {
    x: 0,
    y: 0,
    z: 0,
  };
  private tween: any;
  private quaternionTween: any;
  private quaternionTime = {
    t: 0,
  };
  private posComplete = false;
  private quatComplete = false;

  inputs: Inputs = {
    target: null,
    duration: 1,
  };

  outputs = {
    camera: null as null | Camera,
  } as Outputs;

  events = {
    [Event.OnAccessGranted]: true,
    [Event.OnAccessRevoked]: true,
  } as Events;

  onInit() {
    this.camera = new this.context.three.PerspectiveCamera();
    this.outputs.camera = this.camera;
  }

  onTick(delta: number) {
    this.time += delta;

    let matrixChanged = false;
    if (this.tween && !this.posComplete) {
      this.tween.update(this.time);
      this.camera.position.set(this.position.x, this.position.y, this.position.z);
      matrixChanged = true;
    }

    if (this.quaternionTween && !this.quatComplete) {
      this.quaternionTween.update(this.time);
      matrixChanged = true;
    }

    if (matrixChanged) {
      this.camera.updateMatrixWorld();
    }
  }

  private setupCameraAnimation(startPose: Pose) {
    const THREE = this.context.three;
    const obj3D = (this.inputs.target as any).obj3D as Object3D;
    const forward = new THREE.Vector3();
    obj3D.getWorldDirection(forward);

    const boundingBox = new THREE.Box3().setFromObject(obj3D);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    const sphere = new THREE.Sphere();
    boundingBox.getBoundingSphere(sphere);

    const z = sphere.radius * 2 / 2 / Math.tan(Math.PI * 70 / 360);

    forward.multiplyScalar(z);

    const targetPosition = new THREE.Vector3().copy(obj3D.position);
    targetPosition.add(forward);

    const m = new THREE.Matrix4();
    m.lookAt(targetPosition, obj3D.position, new THREE.Vector3(0, 1, 0));

    const q = new THREE.Quaternion();
    q.setFromRotationMatrix(m);

    const target = {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
    };

    this.camera.position.copy(startPose.position);
    this.camera.quaternion.copy(startPose.rotation);
    this.camera.projectionMatrix.copy(startPose.projection);
    this.camera.updateMatrixWorld();
    this.position.x = startPose.position.x;
    this.position.y = startPose.position.y;
    this.position.z = startPose.position.z;

    this.tween = new TWEEN.Tween<Position>(this.position)
      .to(target)
      .easing(TWEEN.Easing.Cubic.InOut)
      .duration(this.inputs.duration * 1000)
      .onComplete(() => {
        this.posComplete = true;
      })
      .start(0);

    const dummy = new THREE.Camera();
    const qStart = new THREE.Quaternion();
    const qEnd = new THREE.Quaternion();

    // tween
    this.quaternionTween = new TWEEN.Tween(this.quaternionTime)
      .to({ t: 1.0 }, this.inputs.duration * 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onStart(() =>  {
        dummy.position.copy( this.camera.position );
        dummy.lookAt( new Vector3().set(target.x, target.y, target.z) );
        qStart.copy(this.camera.quaternion);
        qEnd.copy(q);
      })
      .onUpdate((obj, tm) => {
        this.camera.quaternion.copy(qStart);
        this.camera.quaternion.slerp(qEnd, tm);
      })
      .onComplete(() => {
        this.camera.quaternion.copy(qEnd);
        this.quatComplete = true;
      })
      .start(0);
  }

  onEvent(eventType: string, eventData: unknown) {
    const data = eventData as any;
    switch(eventType) {
      case Event.OnAccessGranted:
        this.setupCameraAnimation(data.pose);
        break;
      case Event.OnAccessRevoked:
        break;
    }
  }
}

export const makeCloseUpView = () => {
  return new CloseupView();
};

export const closeupViewType = 'closeupView';
