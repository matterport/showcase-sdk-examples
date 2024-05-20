import React, { Component } from 'react';
import { Frame, GetSDK, initComponents, orientedBoxType, slotType, sdkKey } from '@mp/common';
import { MpSdk } from '@mp/bundle-sdk/sdk';

import { AppState } from '../AppState';
import { SceneLoader } from '../SceneLoader';
import { ItemList } from './ItemList';
import { ItemDesc } from 'src/types';
import { cameraInputType } from '@mp/common/src/sdk-components/Camera';
import { Vector3, Quaternion, Euler, Matrix4 } from 'three';

const SelectedColor = 0xffff00;
const SelectedOpacity = 0.1;
const SelectedLineOpacity = 1.0;
const UnselectedColor = 0xffffff;
const UnselectedOpacity = 0.04;
const UnselectedLineOpacity = 0.4;

interface Props {
  appState: AppState;
}

interface State {
  slotNode: SlotNode | null;
}

type SlotNode = {
  node: MpSdk.Scene.INode;
  slotComponent: MpSdk.Scene.IComponent;
  modelComponent: MpSdk.Scene.IComponent;
  boxComponent: MpSdk.Scene.IComponent;
};

type ModelComponentInputs = {
  localPosition: MpSdk.Vector3;
  localRotation: MpSdk.Vector3;
  localScale: MpSdk.Vector3;
};

export class Main extends Component<Props, State> {
  private sdk: MpSdk = null;
  private scene: SceneLoader = null;
  private slots: SlotNode[] = [];
  private cameraInput: MpSdk.Scene.IComponent;
  private src: string;
  private applicationKey: string;
  private sceneObject: MpSdk.Scene.IObject = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      slotNode: null,
    };

    // Forward url params.
    const params = objectFromQuery();
    params.m = params.m || 'j4RZx7ZGM6T';
    params.play = params.play || '1';
    params.qs = params.qs || '1';
    params.sr = params.sr || '-.15';
    params.ss = params.ss || '25';
    // ensure applicationKey is inserted into the bundle query string
    params.applicationKey = params.applicationKey || sdkKey;
    this.applicationKey = params.applicationKey;

    const queryString = Object
      .keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');
    this.src = `./bundle/showcase.html?${queryString}`;

    this.handleListSelection = this.handleListSelection.bind(this);
  }

  async componentDidMount() {
    this.sdk = await GetSDK('sdk-iframe', this.applicationKey);
    await initComponents(this.sdk);
    await this.createCameraControl();
    await this.sdk.Scene.configure((renderer: any, three: any) => {
      renderer.physicallyCorrectLights = true;
      renderer.outputEncoding = three.sRGBEncoding;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.bias = 0.0001;
      renderer.shadowMap.type = three.PCFSoftShadowMap;
    });
    this.scene = new SceneLoader(this.sdk);
    const slots: SlotNode[] = [];

    let count = 0;
    const findSlots = (node: MpSdk.Scene.INode) => {
      let slot: MpSdk.Scene.IComponent = null;
      let model: MpSdk.Scene.IComponent = null;
      let box: MpSdk.Scene.IComponent = null;
      const componentIterator: IterableIterator<MpSdk.Scene.IComponent> = node.componentIterator();
      for (const component of componentIterator) {
        if (component.componentType === slotType) {
          slot = component;
        } else if (component.componentType === 'mp.gltfLoader') {
          model = component;
        } else if (component.componentType == orientedBoxType) {
          box = component as MpSdk.Scene.IComponent;
          const clickPath = this.scene.sceneObject.addEventPath(box, this.sdk.Scene.InteractionType.CLICK);
          const clickSpy = {
            id: 'clickSpy-' + count,
            path: clickPath,
            onEvent: (payload: { input: { button: number } }) => {
              if (payload.input.button !== undefined) {
                this.handleOrientedBoxInteraction(node, component, this.sdk.Scene.InteractionType.CLICK);
              }
            },
          };
          this.scene.sceneObject.spyOnEvent(clickSpy);
          const hoverPath = this.scene.sceneObject.addEventPath(box, this.sdk.Scene.InteractionType.HOVER);
          const hoverSpy = {
            id: 'hoverSpy-' + count,
            path: hoverPath,
            onEvent: (payload: { hover: boolean }) => {
              this.cameraInput.inputs.suppressClick = !payload.hover;
            },
          };
          this.scene.sceneObject.spyOnEvent(hoverSpy);
          box.inputs.color = UnselectedColor;
          box.inputs.opacity = UnselectedOpacity;
          // Increment count for unique spy names
          count++;
        }
      }
      if (slot && model) {
        slots.push({
          node: node,
          slotComponent: slot,
          modelComponent: model,
          boxComponent: box,
        });
      }
    };

    this.slots = slots;
    await this.scene.load('AAWs9eZ9ip6', findSlots);
  }

  private handleListSelection(item: ItemDesc) {
    const slotNode = this.state.slotNode;
    if (!slotNode) {
      return;
    }

    slotNode.slotComponent.inputs.model = item.url;
    let inputs = slotNode.modelComponent.inputs as ModelComponentInputs;
    inputs.localPosition = {
      x: item.position.x,
      y: item.position.y,
      z: item.position.z,
    };
    inputs.localRotation = {
      x: item.rotation.x,
      y: item.rotation.y,
      z: item.rotation.z,
    };
    inputs.localScale = {
      x: item.scale.x,
      y: item.scale.y,
      z: item.scale.z,
    };
  }
  private handleOrientedBoxInteraction(
    node: MpSdk.Scene.INode,
    component: MpSdk.Scene.IComponent,
    interactionType: MpSdk.Scene.InteractionType
  ) {
    if (interactionType === this.sdk.Scene.InteractionType.CLICK) {
      // select this node
      for (const slot of this.slots) {
        if (slot.boxComponent === component) {
          const lastSlotNode = this.state.slotNode;
          if (lastSlotNode) {
            lastSlotNode.boxComponent.inputs.color = UnselectedColor;
            lastSlotNode.boxComponent.inputs.opacity = UnselectedOpacity;
            lastSlotNode.boxComponent.inputs.lineOpacity = UnselectedLineOpacity;
          }
          if (lastSlotNode === slot) {
            this.cameraInput.inputs.focus = null;
            this.setState({
              slotNode: null,
            });
          } else {
            this.setState({
              slotNode: slot,
            });
            slot.boxComponent.inputs.color = SelectedColor;
            slot.boxComponent.inputs.opacity = SelectedOpacity;
            slot.boxComponent.inputs.lineOpacity = SelectedLineOpacity;
            this.cameraInput.inputs.focus = node.position;
          }
        }
      }
    }
  }

  render() {
    let filteredItems: ItemDesc[] = [];
    const { slotNode } = this.state;

    if (slotNode) {
      const { items, slots } = this.props.appState;
      const category = slots.get(slotNode.node.name);

      if (category) {
        filteredItems = items.get(category);
      }
    }

    return (
      <div className='main'>
        <ItemList
          items={filteredItems}
          onSelected={this.handleListSelection}
        ></ItemList>
        <Frame src={this.src}></Frame>
      </div>
    );
  }

  async createCameraControl() {
    [this.sceneObject] = await this.sdk.Scene.createObjects(1);
    const cameraNode = this.sceneObject.addNode();
    const cameraPose = await this.sdk.Camera.pose.waitUntil(pose => !!pose);
    this.cameraInput = cameraNode.addComponent(cameraInputType);
    // convert sdk pose to THREE.js objects
    this.cameraInput.inputs.startPose = {
      position: new Vector3(
        cameraPose.position.x,
        cameraPose.position.y,
        cameraPose.position.z
      ),
      quaternion: new Quaternion().setFromEuler(
        new Euler(
          cameraPose.rotation.x * (Math.PI / 180),
          cameraPose.rotation.y * (Math.PI / 180),
          0, // No Z value on cameraPose
          'YXZ'
        )
      ),
      projection: new Matrix4().fromArray(cameraPose.projection).transpose(),
    };
    const cameraControl = cameraNode.addComponent('mp.camera');

    const inputPath = this.sceneObject.addInputPath(cameraControl, 'camera');
    const outputPath = this.sceneObject.addOutputPath(this.cameraInput, 'camera');
    inputPath.bind(outputPath);

    cameraNode.start();
  }
}

// from cwf/modules/browser.ts
export const objectFromQuery = (url?: string): { [key: string]: string } => {
  const regex = /[#&?]([^=]+)=([^#&?]+)/g;
  url = url || window.location.href;
  const object: { [param: string]: string } = {};
  let matches;
  // regex.exec returns new matches on each
  // call when we use /g like above
  while ((matches = regex.exec(url)) !== null) {
    object[matches[1]] = decodeURIComponent(matches[2]);
  }
  return object;
};
