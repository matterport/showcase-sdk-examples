import THREE from "three"
import { Dict } from '@mp/core';

/**
 * The base of all `SceneComponent` created with the sdk.
 * All properties of this class are always available to all components generated through the sdk.
 * These properties should all be considered reserved and should not be overwritten by the subclass.
 */
abstract class SceneComponentPrivate {
  /**
   * @reserved
   * The name registered to the factory used to generate this component.
   */
  declare readonly componentType: string;

  /**
   * @reserved
   * A dictionary of properties that this component computes. Every component is guaranteed to have `outputs.collider` and `outputs.objectRoot`.
   * This dictionary is observable and can be the source of a bind target.
   *
   */
  declare outputs: ComponentOutput;

  /**
   * @reserved
   * A dictionary of events that will be handled by this component's `onEvent`. Every component is guaranteed to have all of the `InteractionSelection` keys:
   *  `events[InteractionSelection.CLICK]`, `events[InteractionSelection.HOVER]`, `events[InteractionSelection.DRAG]`
   * Note: registering to receive `InteractionSelection.HOVER` will produce both `InteractionType.HOVER` and `InteractionType.UNHOVER` in `onEvent`.
   */
  declare events: Dict<boolean>;

  /**
   * @reserved
   * The context provides access to the underlying framework, e.g. THREE.js.
   */
  declare context: ComponentContext;

  /**
   * @reserved
   * Binds `this[prop]` to the output of `src[srcProp]`.
   * When the value of `src[srcProp]` changes, the value is propagated and sets `this[prop]` to the same value automatically.
   */
  declare bind: (prop: string, src: SceneComponent['outputs' | 'inputs'], srcProp: keyof SceneComponent['outputs' | 'inputs']) => void;

  /**
   * @reserved
   * Notifies this component of an `eventType` when the `src` Component calls `notify` with a `srcEventType` event
   */
  declare bindEvent: (eventType: string, src: SceneComponent, srcEventType: string) => void;

  /**
   * @reserved
   * Notifies any event bindings of an event with `eventType` and data `eventData`
   */
  declare notify: (eventType: string, eventData?: unknown) => void;

  /**
   * @reserved
   * Spy on a component's notify from outside of the component system
   */
  declare spyOnEvent: (spy: IComponentEventSpy) => ISubscription;
}

export abstract class SceneComponent extends SceneComponentPrivate {
  /**
   * An optional dictionary of properties that affects the behavior of the component.
   * The properties can be changed by an external source at any time. It is up to the component to respond appropriately to the changes.
   * The input properties can also be bind targets to another observable source, e.g. the output property of another component.
   */
  inputs?: Dict;

  /**
   * This event is called once after the scene node its attached to has started.
   */
  onInit?(): void;

  /**
   * This event is called at most once per frame when there are events on this component.
   * Any of the interaction types specified in `this.interactions` or a call to notify for a bound event will trigger this event.
   * @property {string | ComponentInteractionType} eventType The event type
   * @property {unknown} eventData The data payload of the event
   */
  onEvent?(eventType: string, eventData: unknown): void;

  /**
   * This event is called after an input property has changed.
   * It will be called at most once a frame.
   */
  onInputsUpdated?(previousInputs: this['inputs']): void;

  /**
   * This event is called once a frame after input changes have been detected.
   */
  onTick?(tickDelta: number): void;

  /**
   * This event is called once right before the scene node has stopped.
   */
  onDestroy?(): void;
}

/**
 * A node of a scene graph.
 * Aggregates `SceneComponent` as children.
 */
export interface ISceneNode {
  /**
   * A human readable name provided by the user.
   */
  name: string;

  /**
   * The position of the node.
   * The position, quaternion, scale transforms are applied in scale, quaternion, then scale order. (same as THREE.js)
   */
  readonly position: THREE.Vector3;

  /**
   * The orientation of the node.
   * The position, quaternion, scale transforms are applied in scale, quaternion, then scale order. (same as THREE.js)
   */
  readonly quaternion: THREE.Quaternion;

  /**
   * The scale of the node.
   * The position, quaternion, scale transforms are applied in scale, quaternion, then scale order. (same as THREE.js)
   */
  readonly scale: THREE.Vector3;

  /**
   * Create and add a child component to this node.
   *
   * @param factory The name associated with the factory to generate a `SceneComponent`
   * @param initialInputs An initial set of inputs, immediately available to the newly create `SceneComponent.onInit`
   */
  addComponent(factory: string, initialInputs?: SceneComponent['inputs']): SceneComponent;

  /**
   * An iterator to iterate over the components added to this node using a for-of loop.
   */
  componentIterator(): IterableIterator<SceneComponent>;

  /**
   * Start the node and its components.
   */
  start(): void;

  /**
   * Stop the node and its components.
   */
  stop(): void;
}

/**
 * The types of the Interaction events received from the registered `InteractionSelection`
 */
export enum ComponentInteractionType {
  /** CLICK events */
  CLICK = 'INTERACTION.CLICK',
  /** HOVER events */
  HOVER = 'INTERACTION.HOVER',
  /** DRAG events (mousedown then move) */
  DRAG = 'INTERACTION.DRAG',
}

abstract class ComponentOutputReserved {
  declare objectRoot: THREE.Object3D | null;
  declare collider: THREE.Object3D | null;
}

// Hack around the type system to get a cleaner interface around `ComponentOutput`
interface ComponentOut extends Dict {}
class ComponentOut extends ComponentOutputReserved  {}

/**
 * A general-use bag of properties.
 * At a minimum, it has `objectRoot` and `collider` automatically defined.
 */
export type ComponentOutput = ComponentOut;

/**
 * The context of a component (available as `this.context`) in a `SceneComponent` subclass.
 * Access to the root `ISceneNode` and the THREE.js are available.
 */
export type ComponentContext = {
  three: typeof THREE;
  root: ISceneNode;
  renderer: THREE.WebGLRenderer;
  user: Dict;
};

/**
 * A raycast intersection with a mesh
 */
export type Intersect = {
  point: THREE.Vector3;
  normal: THREE.Vector3;
  collider: THREE.Object3D;
};

/**
 * A spy that can be attached to a component using `spyOnEvent`
 */
export interface IComponentEventSpy<T = unknown> {
  readonly eventType: string;
  onEvent(eventData?: T): void;
}

/**
 * An object responsible for removing a spy from a component's event
 */
export interface ISubscription {
  cancel(): void;
}
