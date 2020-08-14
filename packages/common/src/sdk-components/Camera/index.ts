import { SceneComponent, ComponentOutput, DragBeginEvent, DragEvent, KeyEvent, KeyState, ScrollEvent } from "../../SceneComponent";
import { Vector3, Quaternion, Camera, Matrix4 } from "three";
import { CameraInputMap, Keys, HasControls } from "./InputMap";
import { CameraRig } from "./CameraRig";
import { ICameraController } from "./ICameraController";
import { ControlMode } from "./ControlMode";
import { FreeControls } from "./FreeControls";
import { FlightControls } from "./FlightControls";
import { Axis } from "./Axis";

type CameraPose = {
  position: Vector3;
  quaternion: Quaternion;
  projection: Matrix4;
};

type Outputs = {
  camera: null | Camera;
} & ComponentOutput;

export enum CameraInputEvent {
  DragBegin = 'DRAG_BEGIN',
  Drag = 'DRAG',
  DragEnd = 'DRAG_END',
  Key = 'KEY',
  Scroll = 'SCROLL',
};

type Events = {
  [CameraInputEvent.DragBegin]: boolean,
  [CameraInputEvent.Drag]: boolean,
  [CameraInputEvent.DragEnd]: boolean,
  [CameraInputEvent.Key]: boolean,
  [CameraInputEvent.Scroll]: boolean,
};

class CameraInput extends SceneComponent {
  private camera: Camera;
  private cameraRig: CameraRig;
  private controlMap: CameraInputMap;
  private activeControls: ICameraController;
  private controls: ICameraController[] = [];

  inputs = {
    startPose: null as null | CameraPose,
    focus: null as null | Vector3,
    suppressClick: false,
  };

  outputs = {
    camera: null as null | Camera,
  } as Outputs;

  events: Events = {
    [CameraInputEvent.DragBegin]: true,
    [CameraInputEvent.Drag]: true,
    [CameraInputEvent.DragEnd]: true,
    [CameraInputEvent.Key]: true,
    [CameraInputEvent.Scroll]: true,
  };
  
  constructor() {
    super();
    class Controls implements HasControls {
      constructor(private cameraInput: CameraInput) {}
      get controls() {
        return this.cameraInput.activeControls;
      }
    }

    this.controlMap = new CameraInputMap({
      [Keys.W]:     [Axis.Z, 'accelerate',       -1],
      [Keys.A]:     [Axis.X, 'accelerate',       -1],
      [Keys.S]:     [Axis.Z, 'accelerate',        1],
      [Keys.D]:     [Axis.X, 'accelerate',        1],
      [Keys.SPACE]: [Axis.Y, 'accelerate',        1],
      [Keys.SHIFT]: [Axis.Y, 'accelerate',       -1],
      [Keys.LEFT]:  [Axis.Y, 'accelerateAround',  1],
      [Keys.RIGHT]: [Axis.Y, 'accelerateAround', -1],
      [Keys.UP]:    [Axis.X, 'accelerateAround',  1],
      [Keys.DOWN]:  [Axis.X, 'accelerateAround', -1],
      [Keys.Q]:     [Axis.Z, 'accelerateAround',  1],
      [Keys.E]:     [Axis.Z, 'accelerateAround', -1],
    }, new Controls(this));
  }

  onInit() {
    this.camera = new this.context.three.PerspectiveCamera();
    this.cameraRig = new CameraRig(this.camera);

    if (this.inputs.startPose) {
      this.cameraRig.position.copy(this.inputs.startPose.position);
      this.cameraRig.quaternion.copy(this.inputs.startPose.quaternion);
      this.camera.projectionMatrix.copy(this.inputs.startPose.projection);
      this.cameraRig.updateMatrixWorld();
    }

    this.controls[ControlMode.FREE] = new FreeControls(this.cameraRig);
    this.controls[ControlMode.FLIGHT] = new FlightControls(this.cameraRig);
    this.activeControls = this.controls[ControlMode.FREE];
    this.changeFocus(this.inputs.focus);

    this.outputs.camera = this.camera;
  }

  onInputsUpdated(oldInputs: this['inputs']) {
    // if the focus switched from null or to null OR the focus changed to a new vector
    if (this.inputs.focus && (!oldInputs.focus || !this.inputs.focus.equals(oldInputs.focus))) {
      this.changeFocus(this.inputs.focus);
    }
    if (!this.inputs.focus && !!oldInputs.focus) {
      this.changeFocus(null);
    }
  }

  onEvent(eventType: string, eventData: unknown) {
    switch(eventType) {
      case CameraInputEvent.DragBegin:
        {
          const event = eventData as DragBeginEvent;
          this.controlMap.onMouseDown(event.position.x, event.position.y);
        }
        break;
      case CameraInputEvent.Drag:
        {
          const event = eventData as DragEvent;
          this.controlMap.onMouseMove(event.delta.x, event.delta.y);
        }
        break;
      case CameraInputEvent.DragEnd:
        {
          this.controlMap.onMouseUp();
        }
        break;
      case CameraInputEvent.Key:
        {
          const event = eventData as KeyEvent;
          if (event.state === KeyState.DOWN) {
            this.controlMap.onKeyDown(event.key);  
          }
          else {
            this.controlMap.onKeyUp(event.key);
          }
        }
        break;
      case CameraInputEvent.Scroll:
        {
          const event = eventData as ScrollEvent;
          this.controlMap.onScroll(event.delta.y);
        }
        break;
    }
  }

  onTick(deltaMSec: number) {
    this.activeControls.tick(deltaMSec);
    this.cameraRig.updateMatrixWorld();
  }

  private changeFocus(focus: Vector3 | null) {
    this.activeControls.halt();
    if (!focus) {
      this.cameraRig.clearFocus();
      this.activeControls = this.controls[ControlMode.FREE];
    } else {
      this.cameraRig.setFocus(this.inputs.focus)
      this.activeControls = this.controls[ControlMode.FLIGHT];
    }
  }
}

export const cameraInputType = 'camera.input';
export function makeCameraInput() {
  return new CameraInput();
}
