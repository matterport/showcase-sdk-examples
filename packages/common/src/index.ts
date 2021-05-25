export const test: string = 'test';

export { GetSDK } from './Sdk';
export { Frame } from './components/Frame';
export * from './SceneComponent';
export * from './sdk-components/CanvasRenderer';
export * from './sdk-components/OrientedBox';
export * from './sdk-components/SecurityCamera';
export * from './sdk-components/SceneRenderer';
export * from './sdk-components/Slot';
export * from './sdk-components/PlaneRenderer';
export * from './sdk-components/VideoRenderer';
export * from './sdk-components/VideoStreamCapture';
export * from './sdk-components/NestThermostat';
export * from './sdk-components/RoomShadow';
export * from './sdk-components/ClockPainter';
export * from './sdk-components/SphereSource';

import { orientedBoxType, makeOrientedBox } from './sdk-components/OrientedBox';
import { slotType, makeSlot } from './sdk-components/Slot';
import { securityCameraType, makeSecurityCamera } from './sdk-components/SecurityCamera';
import { loadingIndicatorType, makeLoadingIndicator } from './sdk-components/LoadingIndicator';
import { planeRendererType, makePlaneRenderer } from './sdk-components/PlaneRenderer';
import { canvasRendererType, makeCanvasRenderer } from './sdk-components/CanvasRenderer';
import { sceneRendererType, makeSceneRenderer }  from './sdk-components/SceneRenderer';
import { videoRendererType, makeVideoRenderer } from './sdk-components/VideoRenderer';
import { videoStreamCaptureType, makeVideoStreamCapture } from './sdk-components/VideoStreamCapture';
import { nestThermostatType, makeNestThermostat } from './sdk-components/NestThermostat';
import { roomShadowType, makeRoomShadow }  from './sdk-components/RoomShadow';
import { clockPainterType, makeClockPainter } from './sdk-components/ClockPainter';
import { scenePainterType, makeScenePainter } from './sdk-components/ScenePainter';
import { tunerType, makeTuner } from './sdk-components/Tuner';
import { hlsLoaderType, makeHlsLoader } from './sdk-components/HlsLoader';
import { mjpegPlayerType, makeMjpegPlayer } from './sdk-components/MjpegPlayer';
import { toggleStateType, makeToggleState } from './sdk-components/ToggleState';
import { canvasBorderType, makeCanvasBorder } from './sdk-components/CanvasBorder';
import { canvasTextType, makeCanvasText } from './sdk-components/CanvasText';
import { canvasImageType, makeCanvasImage } from './sdk-components/CanvasImage';
import { cameraInputType, makeCameraInput } from './sdk-components/Camera';
import { makeSphereSource, sphereSourceType } from './sdk-components/SphereSource';
import { boxSourceType, makeBoxSource } from './sdk-components/BoxSource';
import { cylinderSourceType, makeCylinderSource } from './sdk-components/CylinderSource';

export const initComponents = async (sdk: any) => {
  await Promise.all([
    sdk.Scene.register(orientedBoxType, makeOrientedBox),
    sdk.Scene.register(slotType, makeSlot),
    sdk.Scene.register(securityCameraType, makeSecurityCamera),
    sdk.Scene.register(loadingIndicatorType, makeLoadingIndicator),
    sdk.Scene.register(planeRendererType, makePlaneRenderer),
    sdk.Scene.register(canvasRendererType, makeCanvasRenderer),
    sdk.Scene.register(sceneRendererType, makeSceneRenderer),
    sdk.Scene.register(videoRendererType, makeVideoRenderer),
    sdk.Scene.register(videoStreamCaptureType, makeVideoStreamCapture),
    sdk.Scene.register(nestThermostatType, makeNestThermostat),
    sdk.Scene.register(roomShadowType, makeRoomShadow),
    sdk.Scene.register(clockPainterType, makeClockPainter),
    sdk.Scene.register(scenePainterType, makeScenePainter),
    sdk.Scene.register(tunerType, makeTuner),
    sdk.Scene.register(hlsLoaderType, makeHlsLoader),
    sdk.Scene.register(mjpegPlayerType, makeMjpegPlayer),
    sdk.Scene.register(toggleStateType, makeToggleState),
    sdk.Scene.register(canvasBorderType, makeCanvasBorder),
    sdk.Scene.register(canvasTextType, makeCanvasText),
    sdk.Scene.register(canvasImageType, makeCanvasImage),
    sdk.Scene.register(cameraInputType, makeCameraInput),
    sdk.Scene.register(sphereSourceType, makeSphereSource(sdk)),
    sdk.Scene.register(boxSourceType, makeBoxSource(sdk)),
    sdk.Scene.register(cylinderSourceType, makeCylinderSource(sdk)),
  ]);
}

export const assetVersion = '1.0-2-g6b74572';
export const cdnUrl = `https://static.matterport.com/showcase-sdk/examples/assets-${assetVersion}/assets`;
export const sdkKey = '2d4dfb9fd6414902b663c25a6c767cfa';
export const interfaceVersion = '3.10';
