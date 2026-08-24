import type { MpSdk } from '../../bundle/sdk';
import {
  cdnUrl,
  slotType,
  orientedBoxType,
  securityCameraType,
  nestThermostatType,
  planeRendererType,
  canvasRendererType,
  videoRendererType,
  videoStreamCaptureType,
  loadingIndicatorType,
  toggleStateType,
  canvasBorderType,
  canvasTextType,
  canvasImageType,
  tunerType,
  hlsLoaderType,
} from '@mp/common';
import type * as THREEjs from 'three';

const PLACEHOLDER_SCALE: MpSdk.Vector3 = { x: 0.02, y: 0.02, z: 0.02 };

export class Scene {
  private _sceneObject: MpSdk.Scene.IObject = null;
  public get sceneObject() {
    return this._sceneObject;
  }
  constructor(private sdk: MpSdk, private THREE: typeof THREEjs) {}

  /**
   * Load the scene for a given model.
   *
   * @param sid sid of the model, used to lookup the scene.
   * @param callback an optional callback which is called once for each scene node created.
   */
  public async load(sid: string, callback: (node: MpSdk.Scene.INode) => void = null) {
    if (!supportedSids.has(sid)) {
      return;
    }

    [this._sceneObject] = await this.sdk.Scene.createObjects(1);
    const obj = this._sceneObject;

    this.buildSlot({
      name: 'slot_1',
      position: { x: -0.4511, y: 0.57, z: -0.355 },
      slotSize: { x: 2.2, y: 1, z: 1 },
    });
    this.buildSlot({
      name: 'slot_2',
      position: { x: 1.23, y: 0.353, z: -0.31 },
      slotSize: { x: 0.7, y: 0.6, z: 0.7 },
    });
    this.buildSlot({
      name: 'slot_3',
      position: { x: 1.11, y: 0.55, z: 1.48 },
      slotSize: { x: 1, y: 1, z: 1 },
    });
    this.buildSlot({
      name: 'slot_4',
      position: { x: -0.6, y: 0.31, z: 1.3 },
      slotSize: { x: 1.7, y: 0.5, z: 1.2 },
    });

    this.buildSecurityCamera(obj);
    this.buildLights(obj);
    this.buildNestThermostat(obj);
    this.buildWebcam(obj);
    this.buildVideo(obj);

    if (callback) {
      for (const node of obj.nodeIterator()) {
        callback(node);
      }
    }
    this._sceneObject.start();
  }

  private buildSlot(config: {
    name: string;
    position: MpSdk.Vector3;
    slotSize: MpSdk.Vector3;
  }) {
    const obj = this._sceneObject;
    const node = obj.addNode();
    node.name = config.name;
    node.position.set(config.position.x, config.position.y, config.position.z);

    const indicatorScale = Math.min(config.slotSize.x, config.slotSize.y, config.slotSize.z);

    node.addComponent(slotType, { size: config.slotSize });
    node.addComponent(orientedBoxType);
    node.addComponent(this.sdk.Scene.Component.GLTF_LOADER);
    const objLoader = node.addComponent(this.sdk.Scene.Component.OBJ_LOADER, {
      url: cdnUrl + '/models/mp-logo/brand.obj',
      localScale: PLACEHOLDER_SCALE,
      localRotation: { x: 0, y: 0, z: 0 },
      localPosition: { x: 0, y: -indicatorScale * 0.2, z: 0 },
    });
    const loadingIndicator = node.addComponent(loadingIndicatorType, {
      size: { x: indicatorScale, y: indicatorScale, z: indicatorScale },
    });

    obj.bindPath(obj.addInputPath(loadingIndicator, 'logo'), obj.addOutputPath(objLoader, 'objectRoot'));
  }

  private buildSecurityCamera(obj: MpSdk.Scene.IObject) {
    const node = obj.addNode();
    node.name = 'security_camera';
    node.position.set(2.8, 2.4, 10.71);
    node.quaternion.copy(
      new this.THREE.Quaternion().setFromEuler(new this.THREE.Euler(0, -22 * Math.PI / 180, 0))
    );

    node.addComponent(this.sdk.Scene.Component.GLTF_LOADER, {
      url: cdnUrl + '/models/camera-1/scene.gltf',
      localScale: { x: 0.0008, y: 0.0008, z: 0.0008 },
      localRotation: { x: 0, y: 90, z: 0 },
    });
    node.addComponent(securityCameraType, {
      nearPlane: 0.1,
      farPlane: 10,
      horizontalFOV: 52,
      aspect: 1.7777777777777777,
      localPosition: { x: 0, y: 0.18, z: -0.3 },
      localRotation: { x: -15, y: 0, z: 0 },
      color: 0x00FF00,
      panPeriod: 5,
      panAngle: -45,
    });
  }

  private buildLights(obj: MpSdk.Scene.IObject) {
    const node = obj.addNode();
    node.name = 'lights';

    node.addComponent(this.sdk.Scene.Component.AMBIENT_LIGHT, {
      color: { r: 1.0, g: 1.0, b: 1.0 },
      intensity: 3,
    });
    // castShadow was in the original JSON but is not in the typed SDK interface
    node.addComponent(this.sdk.Scene.Component.DIRECTIONAL_LIGHT, {
      intensity: 2,
      position: { x: 0, y: 2, z: -1 },
      target: { x: 0, y: -1, z: 2 },
      debug: false,
    });
    node.addComponent(this.sdk.Scene.Component.DIRECTIONAL_LIGHT, {
      intensity: 0.5,
      position: { x: 0, y: 2, z: 8 },
      target: { x: 0, y: 0, z: 2 },
      debug: false,
    });
  }

  private buildNestThermostat(obj: MpSdk.Scene.IObject) {
    const node = obj.addNode();
    node.name = 'nest';
    node.position.set(-3.22, 1.371, 3.7805);
    node.quaternion.copy(
      new this.THREE.Quaternion().setFromEuler(new this.THREE.Euler(0, 180 * Math.PI / 180, 0))
    );

    const daeLoader = node.addComponent(this.sdk.Scene.Component.DAE_LOADER, {
      url: cdnUrl + '/models/iot/nest-1/model.dae',
      localScale: { x: 0.04, y: 0.04, z: 0.04 },
      localRotation: { x: 0, y: 0, z: 0 },
    });
    const planeRenderer = node.addComponent(planeRendererType);
    const canvasRenderer = node.addComponent(canvasRendererType, {
      textureRes: { w: 1024, h: 1024 },
    });
    const nestThermostat = node.addComponent(nestThermostatType);

    obj.bindPath(obj.addInputPath(nestThermostat, 'loadingState'), obj.addOutputPath(daeLoader, 'loadingState'));
    obj.bindPath(obj.addInputPath(planeRenderer, 'texture'), obj.addOutputPath(canvasRenderer, 'texture'));
    obj.bindPath(obj.addInputPath(canvasRenderer, 'painter'), obj.addOutputPath(nestThermostat, 'painter'));
    obj.bindPath(obj.addInputPath(nestThermostat, 'texture'), obj.addOutputPath(canvasRenderer, 'texture'));
    obj.bindPath(obj.addInputPath(planeRenderer, 'visible'), obj.addOutputPath(nestThermostat, 'visible'));

    obj.bindPath(obj.addEventPath(nestThermostat, 'hover'), obj.addEmitPath(daeLoader, this.sdk.Scene.InteractionType.HOVER));
    obj.bindPath(obj.addEventPath(canvasRenderer, 'repaint'), obj.addEmitPath(nestThermostat, 'repaint'));
  }

  private buildWebcam(obj: MpSdk.Scene.IObject) {
    const node = obj.addNode();
    node.name = 'webcam';
    node.position.set(-4.65, 1.5, -0.1);
    node.quaternion.copy(
      new this.THREE.Quaternion().setFromEuler(new this.THREE.Euler(0, 90 * Math.PI / 180, 0))
    );
    node.scale.set(1.2, 1.2, 1.2);

    const videoPlane = node.addComponent(planeRendererType, { transparent: false });
    const videoRenderer = node.addComponent(videoRendererType);
    const videoStream = node.addComponent(videoStreamCaptureType, { deviceId: 0 });
    const toggle = node.addComponent(toggleStateType, { initialState: false });

    const borderPlane = node.addComponent(planeRendererType, {
      transparent: true,
      opacity: 0.8,
    });
    const borderCanvas = node.addComponent(canvasRendererType, {
      textureRes: { w: 1024, h: 1024 },
    });
    const border = node.addComponent(canvasBorderType, {
      position: { x: 0, y: 0 },
      size: { h: 1024, w: 1024 },
      radius: 50,
    });

    const textPlane = node.addComponent(planeRendererType, {
      transparent: true,
      opacity: 0.8,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    });
    const textCanvas = node.addComponent(canvasRendererType, {
      textureRes: { w: 256, h: 256 },
    });
    const text = node.addComponent(canvasTextType, {
      size: { h: 256, w: 256 },
      text: 'Click to enable webcam.',
      font: 'normal bold 30px sans-serif',
      position: { x: 70, y: 70, z: 0 },
      textWidth: 200,
    });

    // Video stream -> video renderer -> video plane
    obj.bindPath(obj.addInputPath(videoRenderer, 'src'), obj.addOutputPath(videoStream, 'stream'));
    obj.bindPath(obj.addInputPath(videoPlane, 'texture'), obj.addOutputPath(videoRenderer, 'texture'));
    obj.bindPath(obj.addInputPath(videoStream, 'enabled'), obj.addOutputPath(toggle, 'state'));
    obj.bindPath(obj.addInputPath(videoPlane, 'aspect'), obj.addOutputPath(videoStream, 'aspect'));

    // Border overlay
    obj.bindPath(obj.addInputPath(borderCanvas, 'painter'), obj.addOutputPath(border, 'painter'));
    obj.bindPath(obj.addInputPath(borderPlane, 'texture'), obj.addOutputPath(borderCanvas, 'texture'));
    obj.bindPath(obj.addInputPath(borderPlane, 'aspect'), obj.addOutputPath(videoStream, 'aspect'));

    // "Click to enable" text overlay (visible when toggled off)
    obj.bindPath(obj.addInputPath(textCanvas, 'painter'), obj.addOutputPath(text, 'painter'));
    obj.bindPath(obj.addInputPath(textPlane, 'texture'), obj.addOutputPath(textCanvas, 'texture'));
    obj.bindPath(obj.addInputPath(textPlane, 'visible'), obj.addOutputPath(toggle, 'negated'));
    obj.bindPath(obj.addInputPath(textPlane, 'aspect'), obj.addOutputPath(videoStream, 'aspect'));

    // Click on video plane toggles webcam
    obj.bindPath(obj.addEventPath(toggle, 'toggle'), obj.addEmitPath(videoPlane, this.sdk.Scene.InteractionType.CLICK));
  }

  private buildVideo(obj: MpSdk.Scene.IObject) {
    const node = obj.addNode();
    node.name = 'video';
    node.position.set(-3.0, 2.3, 6.7);
    node.quaternion.copy(
      new this.THREE.Quaternion().setFromEuler(new this.THREE.Euler(0, 90 * Math.PI / 180, 0))
    );
    node.scale.set(1.75, 1.75, 1.75);

    const tuner = node.addComponent(tunerType, {
      urls: [
        'https://video2archives.earthcam.com/archives/_definst_/MP4:permanent/14162/2019/07/22/1300.mp4/chunklist_w1401431259.m3u8',
        'https://www.bloomberg.com/media-manifest/streams/us.m3u8',
      ],
    });
    const hlsLoader = node.addComponent(hlsLoaderType);
    const videoRenderer = node.addComponent(videoRendererType);
    const videoPlane = node.addComponent(planeRendererType, {
      transparent: false,
      localScale: { x: 0.6, y: 0.6, z: 0.6 },
      localPosition: { x: 0, y: 0, z: 0 },
    });
    const toggle = node.addComponent(toggleStateType, { initialState: false });

    const borderPlane = node.addComponent(planeRendererType, {
      transparent: true,
      opacity: 0.8,
      localScale: { x: 0.6, y: 0.6, z: 0.6 },
    });
    const borderCanvas = node.addComponent(canvasRendererType, {
      textureRes: { w: 1024, h: 1024 },
    });
    const border = node.addComponent(canvasBorderType, {
      position: { x: 0, y: 0 },
      size: { h: 1024, w: 1024 },
      radius: 50,
    });

    const textPlane = node.addComponent(planeRendererType, {
      localScale: { x: 0.6, y: 0.6, z: 0.6 },
      transparent: true,
      opacity: 0.8,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    });
    const textCanvas = node.addComponent(canvasRendererType, {
      textureRes: { w: 512, h: 512 },
    });
    const text = node.addComponent(canvasTextType, {
      size: { h: 512, w: 512 },
      text: 'Click me.',
      font: 'normal bold 40px sans-serif',
      position: { x: 160, y: 210, z: 0 },
      textWidth: 250,
    });

    const ffPlane = node.addComponent(planeRendererType, {
      localScale: { x: 0.08, y: 0.08, z: 1.0 },
      localPosition: { x: 0.22, y: -0.13, z: 0.01 },
    });
    const ffCanvas = node.addComponent(canvasRendererType, {
      textureRes: { w: 128, h: 128 },
    });
    const ffImage = node.addComponent(canvasImageType, {
      src: cdnUrl + '/textures/ff.png',
      srcPosition: { x: 0, y: 0, z: 0 },
      srcSize: { w: 128, h: 128 },
      destPosition: { x: 0, y: 0, z: 0 },
      destSize: { w: 128, h: 128 },
    });

    // HLS stream -> video renderer -> video plane
    obj.bindPath(obj.addInputPath(hlsLoader, 'src'), obj.addOutputPath(tuner, 'src'));
    obj.bindPath(obj.addInputPath(videoRenderer, 'src'), obj.addOutputPath(hlsLoader, 'video'));
    obj.bindPath(obj.addInputPath(videoPlane, 'texture'), obj.addOutputPath(videoRenderer, 'texture'));
    obj.bindPath(obj.addInputPath(hlsLoader, 'enabled'), obj.addOutputPath(toggle, 'state'));
    obj.bindPath(obj.addInputPath(videoPlane, 'aspect'), obj.addOutputPath(hlsLoader, 'aspect'));

    // Border overlay
    obj.bindPath(obj.addInputPath(borderCanvas, 'painter'), obj.addOutputPath(border, 'painter'));
    obj.bindPath(obj.addInputPath(borderPlane, 'texture'), obj.addOutputPath(borderCanvas, 'texture'));
    obj.bindPath(obj.addInputPath(borderPlane, 'aspect'), obj.addOutputPath(hlsLoader, 'aspect'));

    // "Click me" text overlay (visible when toggled off)
    obj.bindPath(obj.addInputPath(textCanvas, 'painter'), obj.addOutputPath(text, 'painter'));
    obj.bindPath(obj.addInputPath(textPlane, 'texture'), obj.addOutputPath(textCanvas, 'texture'));
    obj.bindPath(obj.addInputPath(textPlane, 'visible'), obj.addOutputPath(toggle, 'negated'));

    // Fast-forward button
    obj.bindPath(obj.addInputPath(ffCanvas, 'painter'), obj.addOutputPath(ffImage, 'painter'));
    obj.bindPath(obj.addInputPath(ffPlane, 'texture'), obj.addOutputPath(ffCanvas, 'texture'));
    obj.bindPath(obj.addInputPath(ffPlane, 'visible'), obj.addOutputPath(toggle, 'state'));

    // Click on video plane toggles playback
    obj.bindPath(obj.addEventPath(toggle, 'toggle'), obj.addEmitPath(videoPlane, this.sdk.Scene.InteractionType.CLICK));

    // Click on ff button advances to next channel
    obj.bindPath(obj.addEventPath(tuner, 'next'), obj.addEmitPath(ffPlane, this.sdk.Scene.InteractionType.CLICK));

    // Repaint ff icon when image is ready
    obj.bindPath(obj.addEventPath(ffCanvas, 'repaint'), obj.addEmitPath(ffImage, 'paint.ready'));
  }

}

const supportedSids = new Set(['AAWs9eZ9ip6']);
