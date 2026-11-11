import type { MpSdk } from '../../../bundle/sdk';
import { SceneEvents } from '../scenes/SceneEvents';
import type { PerspectiveCamera, Vector3 } from 'three';
import { IGameState } from '../interfaces';
import { Events } from 'phaser';

export const bunnyCaptureType = 'easter.bunnycapture';

export const createBunnyCaptureClosure = (gameState: IGameState, eventBus: Events.EventEmitter, sdk: MpSdk): MpSdk.Scene.IComponentFactory =>
  () => {
    let cameraPose: MpSdk.Camera.Pose = null;
    let iframe: HTMLElement = null;
    let projectionCam: PerspectiveCamera;
    let capturePoint: Vector3;

    const onCameraPoseChanged = (pose: MpSdk.Camera.Pose) => {
      cameraPose = pose;
    };

    return {
      events: {
        captured: true,
      },

      onInit() {
        const THREE = this.context.three;
        projectionCam = new THREE.PerspectiveCamera();
        capturePoint = new THREE.Vector3();
        iframe = document.getElementById('sdk-iframe');
        sdk.Camera.pose.subscribe(onCameraPoseChanged);
      },

      onEvent(eventType, eventData) {
        const data = eventData as { position?: { x: number; y: number; z: number } };
        if (eventType === 'captured' && data?.position) {
          const bunnyPosition = data.position;
          const newCaptured = gameState.captured + 1;
          if (newCaptured > gameState.total) {
            return;
          }
          gameState.captured = newCaptured;

          const size = {
            w: iframe.clientWidth,
            h: iframe.clientHeight,
          };

          projectionCam.position.copy(cameraPose.position);
          projectionCam.projectionMatrix.fromArray(cameraPose.projection).transpose();
          projectionCam.rotation.set(
            (cameraPose.rotation.x * Math.PI) / 180,
            (cameraPose.rotation.y * Math.PI) / 180,
            0,
            'YXZ'
          );
          projectionCam.updateMatrixWorld();

          capturePoint.copy(bunnyPosition).project(projectionCam);
          capturePoint.x = (capturePoint.x + 1) * 0.5 * size.w;
          capturePoint.y = -(capturePoint.y - 1) * 0.5 * size.h;

          eventBus.emit(SceneEvents.StartRabbit, capturePoint);

          if (newCaptured >= gameState.total) {
            setTimeout(function () {
              eventBus.emit(SceneEvents.EndGame);
            }, 2000);
          }
        }
      },
    };
  };
