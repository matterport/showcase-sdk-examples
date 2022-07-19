import React, { Component } from 'react';
import { Frame, GetSDK, initComponents, SceneComponent, ISceneNode, ComponentInteractionType,
  orientedBoxType, slotType, OrientedBox, IComponentEventSpy, IInteractionEvent, sdkKey } from '@mp/common';
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
  slotNode: SlotNode|null;
}

type SlotNode = {
  node: ISceneNode;
  slotComponent: SceneComponent;
  modelComponent: SceneComponent;
  boxComponent: OrientedBox;
}

export class Main extends Component<Props, State> {
  private sdk: any = null;
  private scene: SceneLoader = null;
  private slots: SlotNode[] = [];
  private cameraInput: SceneComponent;
  private src: string;
  private applicationKey: string;

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

    const queryString = Object.keys(params).map((key) => key + '=' + params[key]).join('&');
    this.src = `./bundle/showcase.html?${queryString}`;

    this.handleListSelection = this.handleListSelection.bind(this);
  }

  async componentDidMount() {
    this.sdk = await GetSDK('sdk-iframe', this.applicationKey);
    await initComponents(this.sdk);
    await this.createCameraControl(this.sdk);
    await this.sdk.Scene.configure((renderer: any, three: any) => {
      renderer.physicallyCorrectLights = true;
      renderer.outputEncoding = three.sRGBEncoding;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.bias = 0.0001;
      renderer.shadowMap.type = three.PCFSoftShadowMap;

    });
    this.scene = new SceneLoader(this.sdk);

    const slots: SlotNode[] = [];

    class ClickSpy implements IComponentEventSpy<IInteractionEvent> {
      public eventType = ComponentInteractionType.CLICK;
      constructor(private mainComponent: Main){}
      onEvent(payload: IInteractionEvent) {
        this.mainComponent.handleOrientedBoxInteraction(payload.node, payload.component, payload.type);
      }
    }

    class HoverSpy implements IComponentEventSpy {
      public eventType = ComponentInteractionType.HOVER;
      constructor(private mainComponent: Main) {}
      onEvent(payload: { hover: boolean; }) {
        this.mainComponent.cameraInput.inputs.suppressClick = !payload.hover;
      }
    }

    const clickSpy = new ClickSpy(this);
    const hoverSpy = new HoverSpy(this);
    const findSlots = (node: ISceneNode) => {
      let slot: SceneComponent = null;
      let model: SceneComponent = null;
      let box: OrientedBox = null;
      const componentIterator: IterableIterator<SceneComponent> = node.componentIterator();
      for (const component of componentIterator) {
        if (component.componentType === slotType) {
          slot = component;
        }
        else if (component.componentType === 'mp.gltfLoader') {
          model = component;
        }
        else if (component.componentType == orientedBoxType) {
          box = component as OrientedBox;
          box.spyOnEvent(clickSpy);
          box.spyOnEvent(hoverSpy);
          box.inputs.color = UnselectedColor;
          box.inputs.opacity = UnselectedOpacity;
        }
      }

      if (slot && model) {
        slots.push({
          node: node,
          slotComponent: slot,
          modelComponent: model,
          boxComponent: box,
        })
      }
    };

    this.slots = slots;
    await this.scene.load('AAWs9eZ9ip6', findSlots);

    console.log(this.scene);
    console.log(this.sdk);
  }

  private handleListSelection(item: ItemDesc) {
    const slotNode = this.state.slotNode;
    if (!slotNode) {
      return;
    }
    slotNode.slotComponent.inputs. model = item.url;
    slotNode.modelComponent.inputs.localPosition.x = item.position.x;
    slotNode.modelComponent.inputs.localPosition.y = item.position.y;
    slotNode.modelComponent.inputs.localPosition.z = item.position.z;
    slotNode.modelComponent.inputs.localRotation.x = item.rotation.x;
    slotNode.modelComponent.inputs.localRotation.y = item.rotation.y;
    slotNode.modelComponent.inputs.localRotation.z = item.rotation.z;
    slotNode.modelComponent.inputs.localScale.x = item.scale.x;
    slotNode.modelComponent.inputs.localScale.y = item.scale.y;
    slotNode.modelComponent.inputs.localScale.z = item.scale.z;
  }

  private handleOrientedBoxInteraction(node: ISceneNode, component: SceneComponent, interactionType: ComponentInteractionType) {
    if (interactionType === ComponentInteractionType.CLICK) {
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
            })

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
        <ItemList items={filteredItems} onSelected={this.handleListSelection}></ItemList>
        <Frame src={this.src}></Frame>
      </div>
    );
  }

  async createCameraControl(theSdk: any) {
    const cameraNode = await theSdk.Scene.createNode();
    const cameraPose = await theSdk.Camera.getPose();
    this.cameraInput = cameraNode.addComponent(cameraInputType);
    // convert sdk pose to THREE.js objects
    this.cameraInput.inputs.startPose = {
      position: new Vector3(cameraPose.position.x, cameraPose.position.y, cameraPose.position.z),
      quaternion: new Quaternion().setFromEuler(new Euler(
        cameraPose.rotation.x * Math.PI / 180,
        cameraPose.rotation.y * Math.PI / 180,
        (cameraPose.rotation.z || 0) * Math.PI / 180,
        'YXZ')),
      projection: new Matrix4().fromArray(cameraPose.projection).transpose(),
    };
    const cameraControl = cameraNode.addComponent('mp.camera');
    cameraControl.bind('camera', this.cameraInput, 'camera');

    cameraNode.start();
  }
}

// from cwf/modules/browser.ts
export const objectFromQuery = (url?: string): {[key: string]: string} => {
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
