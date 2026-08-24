import type { MpSdk } from '../../../../bundle/sdk';
import type { DragBeginEvent, DragEvent, KeyEvent, ScrollEvent } from '../../input';
import { Keys, KeyState } from '../../input';
import type { Camera, Matrix4, Quaternion, Vector3 } from 'three';
import { CameraInputMap, HasControls } from './InputMap';
import { Axis, CameraRig, ControlMode, FlightControls, FreeControls, ICameraController, makeCameraRig } from './controls';

export * from './controls';

type CameraPose = {
  position: Vector3;
  quaternion: Quaternion;
  projection: Matrix4;
};

type Inputs = {
  startPose: CameraPose | null;
  focus: Vector3 | null;
  suppressClick: boolean;
};

type Outputs = {
  camera: null | Camera;
};

export enum CameraInputEvent {
  DragBegin = 'DRAG_BEGIN',
  Drag = 'DRAG',
  DragEnd = 'DRAG_END',
  Key = 'KEY',
  Scroll = 'SCROLL',
}

export const cameraInputType = 'camera.input';
export const makeCameraInput: MpSdk.Scene.IComponentFactory<Inputs, Outputs> = () => {
  let camera: Camera;
  let cameraRig: CameraRig;
  let activeControls: ICameraController;
  const controls: ICameraController[] = [];

  const controlsHolder: HasControls = {
    get controls() {
      return activeControls;
    },
  };

  const controlMap = new CameraInputMap(
    {
      [Keys.W]: [Axis.Z, 'accelerate', -1],
      [Keys.A]: [Axis.X, 'accelerate', -1],
      [Keys.S]: [Axis.Z, 'accelerate', 1],
      [Keys.D]: [Axis.X, 'accelerate', 1],
      [Keys.SPACE]: [Axis.Y, 'accelerate', 1],
      [Keys.SHIFT]: [Axis.Y, 'accelerate', -1],
      [Keys.LEFT]: [Axis.Y, 'accelerateAround', 1],
      [Keys.RIGHT]: [Axis.Y, 'accelerateAround', -1],
      [Keys.UP]: [Axis.X, 'accelerateAround', 1],
      [Keys.DOWN]: [Axis.X, 'accelerateAround', -1],
      [Keys.Q]: [Axis.Z, 'accelerateAround', 1],
      [Keys.E]: [Axis.Z, 'accelerateAround', -1],
    },
    controlsHolder
  );

  const changeFocus = (inputs: Inputs, focus: Vector3 | null) => {
    activeControls.halt();
    if (!focus) {
      cameraRig.clearFocus();
      activeControls = controls[ControlMode.FREE];
    } else {
      cameraRig.setFocus(inputs.focus);
      activeControls = controls[ControlMode.FLIGHT];
    }
  };

  return {
    inputs: {
      startPose: null,
      focus: null,
      suppressClick: false,
    },

    outputs: {
      camera: null,
    },

    events: {
      [CameraInputEvent.DragBegin]: true,
      [CameraInputEvent.Drag]: true,
      [CameraInputEvent.DragEnd]: true,
      [CameraInputEvent.Key]: true,
      [CameraInputEvent.Scroll]: true,
    },

    onInit() {
      const THREE = this.context.three;
      camera = new THREE.PerspectiveCamera();
      cameraRig = makeCameraRig(camera, THREE);

      if (this.inputs.startPose) {
        cameraRig.position.copy(this.inputs.startPose.position);
        cameraRig.quaternion.copy(this.inputs.startPose.quaternion);
        camera.projectionMatrix.copy(this.inputs.startPose.projection);
        cameraRig.updateMatrixWorld();
      }

      controls[ControlMode.FREE] = new FreeControls(cameraRig, THREE);
      controls[ControlMode.FLIGHT] = new FlightControls(cameraRig, THREE);
      activeControls = controls[ControlMode.FREE];
      changeFocus(this.inputs, this.inputs.focus);

      this.outputs.camera = camera;
    },

    onInputsUpdated(oldInputs) {
      // Allow re-syncing the camera rig when the pose is updated externally,
      // e.g. when re-entering dollhouse mode after the SDK camera was in control.
      if (this.inputs.startPose && this.inputs.startPose !== oldInputs.startPose) {
        cameraRig.position.copy(this.inputs.startPose.position);
        cameraRig.quaternion.copy(this.inputs.startPose.quaternion);
        camera.projectionMatrix.copy(this.inputs.startPose.projection);
        cameraRig.updateMatrixWorld();
        activeControls.halt();
      }

      // if the focus switched from null or to null OR the focus changed to a new vector
      if (this.inputs.focus && (!oldInputs.focus || !this.inputs.focus.equals(oldInputs.focus))) {
        changeFocus(this.inputs, this.inputs.focus);
      }
      if (!this.inputs.focus && !!oldInputs.focus) {
        changeFocus(this.inputs, null);
      }
    },

    onEvent(eventType, eventData) {
      switch (eventType) {
        case CameraInputEvent.DragBegin:
          {
            const event = eventData as DragBeginEvent;
            controlMap.onMouseDown(event.position.x, event.position.y);
          }
          break;
        case CameraInputEvent.Drag:
          {
            const event = eventData as DragEvent;
            controlMap.onMouseMove(event.delta.x, event.delta.y);
          }
          break;
        case CameraInputEvent.DragEnd:
          {
            controlMap.onMouseUp();
          }
          break;
        case CameraInputEvent.Key:
          {
            const event = eventData as KeyEvent;
            if (event.state === KeyState.DOWN) {
              controlMap.onKeyDown(event.key);
            } else {
              controlMap.onKeyUp(event.key);
            }
          }
          break;
        case CameraInputEvent.Scroll:
          {
            const event = eventData as ScrollEvent;
            controlMap.onScroll(event.delta.y);
          }
          break;
      }
    },

    onTick(deltaMSec) {
      activeControls.tick(deltaMSec);
      cameraRig.updateMatrixWorld();
    },
  };
};
