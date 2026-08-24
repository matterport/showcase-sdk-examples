export const test: string = 'test';

export { GetSDK } from './Sdk';
export { Frame } from './components/Frame';

export * from './input';
export * from './sdk-components/Camera';
export * from './sdk-components/BoxSource';
export * from './sdk-components/CylinderSource';

// vs-app only
export * from './sdk-components/CanvasRenderer';
export * from './sdk-components/OrientedBox';
export * from './sdk-components/SecurityCamera';
export * from './sdk-components/SceneRenderer';
export * from './sdk-components/Slot';
export * from './sdk-components/PlaneRenderer';
export * from './sdk-components/VideoRenderer';
export * from './sdk-components/VideoStreamCapture';
export * from './sdk-components/NestThermostat';
export * from './sdk-components/LoadingIndicator';
export * from './sdk-components/ToggleState';
export * from './sdk-components/CanvasBorder';
export * from './sdk-components/CanvasText';
export * from './sdk-components/CanvasImage';
export * from './sdk-components/Tuner';
export * from './sdk-components/HlsLoader';
export * from './sdk-components/RoomShadow';
export * from './sdk-components/ClockPainter';
export * from './sdk-components/SphereSource';

export const assetVersion = '1.0-2-g6b74572';
export const cdnUrl = `https://static.matterport.com/showcase-sdk/examples/assets-${assetVersion}/assets`;
export const sdkKey = '2d4dfb9fd6414902b663c25a6c767cfa';
export const interfaceVersion = '3.10';
