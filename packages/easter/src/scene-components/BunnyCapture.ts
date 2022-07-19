import { Dict } from '@mp/core';
import { SceneEvents } from '../scenes/SceneEvents';
import { SceneComponent } from '@mp/common';
import { Camera, Vector3 } from 'three';
import { IGameState } from '../interfaces';
import { Events } from 'phaser';

class BunnyCaptureComponent extends SceneComponent {
  private cameraPose: any = null;
  private iframe: HTMLElement = null;
  private projectionCam = new Camera();
  private capturePoint = new Vector3();

  events = {
    captured: true,
  }

  constructor(private gameState: IGameState, private eventBus: Events.EventEmitter, private sdk: any) {
    super();
  }

  onInit() {
    this.onCameraPoseChanged = this.onCameraPoseChanged.bind(this);
    this.iframe = document.getElementById('sdk-iframe');

    this.sdk.Camera.pose.subscribe(this.onCameraPoseChanged);
  }

  onEvent(eventType: string, eventData: Dict) {
    if (eventType === 'captured' && eventData && eventData.position) {
      const bunnyPosition = eventData.position;
      const newCaptured = this.gameState.captured.value + 1;
      if (newCaptured > this.gameState.total.value) {
        return;
      }
      this.gameState.captured.value = newCaptured;

      const size = {
        w: this.iframe.clientWidth,
        h: this.iframe.clientHeight,
      };

      this.projectionCam.position.copy(this.cameraPose.position);
      this.projectionCam.projectionMatrix.fromArray(this.cameraPose.projection).transpose();
      this.projectionCam.rotation.set(this.cameraPose.rotation.x * Math.PI / 180, this.cameraPose.rotation.y * Math.PI / 180, 0, 'YXZ');
      this.projectionCam.updateMatrixWorld();

      this.capturePoint.copy(bunnyPosition).project(this.projectionCam);
      this.capturePoint.x = (this.capturePoint.x + 1) * 0.5 * size.w;
      this.capturePoint.y = -(this.capturePoint.y - 1) * 0.5 * size.h;

      this.eventBus.emit(SceneEvents.StartRabbit, this.capturePoint);

      if (newCaptured >= this.gameState.total.value) {
          const that = this;
          setTimeout(function() {
            that.eventBus.emit(SceneEvents.EndGame);
          }, 2000);
      }
    }
  }

  private onCameraPoseChanged(pose: any) {
    this.cameraPose = pose;
  }
}

export const bunnyCaptureType = 'easter.bunnycapture';

export const createBunnyCaptureClosure = function(gameState: IGameState, eventBus: Events.EventEmitter, sdk: any) {
  return function() {
    return new BunnyCaptureComponent(gameState, eventBus, sdk);
  }
}
