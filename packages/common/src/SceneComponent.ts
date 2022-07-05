import THREE, { Scene } from 'three';
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
   * @reserved
   * A dictionary of events that will be handled by this component's `onEvent`. Every component is guaranteed to have all of the `InteractionSelection` keys:
   *  `events[InteractionSelection.CLICK]`, `events[InteractionSelection.HOVER]`, `events[InteractionSelection.DRAG]`
   * Note: registering to receive `InteractionSelection.HOVER` will produce both `InteractionType.HOVER` and `InteractionType.UNHOVER` in `onEvent`.
   */
  events: Record<string, boolean>;

  /**
  * @reserved
  * A dictionary of events that will be emitted by this component.
  */
  emits?: Record<string, boolean>;

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
  DRAG_BEGIN = 'INTERACTION.DRAG_BEGIN',
  DRAG_END = 'INTERACTION.DRAG_END',
  POINTER_MOVE = 'INTERACTION.POINTER_MOVE',
  POINTER_BUTTON = 'INTERACTION.POINTER_BUTTON',
  SCROLL = 'INTERACTION.SCROLL',
  KEY = 'INTERACTION.KEY',
  LONG_PRESS_START = 'INTERACTION.LONG_PRESS_START',
  LONG_PRESS_END = 'INTERACTION.LONG_PRESS_END',
  MULTI_SWIPE = 'INTERACTION.MULTI_SWIPE',
  MULTI_SWIPE_END = 'INTERACTION.MULTI_SWIPE_END',
  PINCH = 'INTERACTION.PINCH',
  PINCH_END = 'INTERACTION.PINCH_END',
  ROTATE = 'INTERACTION.ROTATE',
  ROTATE_END = 'INTERACTION.ROTATE_END',
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
  scene: Scene;
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

export interface IVector2 {
  x: number;
  y: number;
}

export interface IVector3 {
  x: number;
  y: number;
  z: number;
}

export enum PointerButton {
  PRIMARY,
  MIDDLE,
  SECONDARY,
  BACK,
  FORWARD,
  COUNT,
}

export enum PointerButtonMask {
  NONE,
  PRIMARY = 1 << PointerButton.PRIMARY,
  SECONDARY = 1 << PointerButton.SECONDARY,
  MIDDLE = 1 << PointerButton.MIDDLE,
  BACK = 1 << PointerButton.BACK,
  FORWARD = 1 << PointerButton.FORWARD,
  ALL = (1 << PointerButton.COUNT) - 1,
}

export enum PointerDevice {
  MOUSE = 'mouse',
  TOUCH = 'touch',
  PEN = 'pen',
  GAMEPAD = 'gamepad',
}

/**
 * Fired on every mouse down, provides current position/buttons down.
 */
export interface DragBeginEvent {
  /** Current position */
  readonly position: IVector2;
  /** Buttons down during event */
  readonly buttons: PointerButtonMask;
}

/**
 * Fired only after the pointer has moved far enough from DragBeginEvent
 */
export interface DragEvent {
  /** Current position */
  readonly position: IVector2;
  /** Delta moved since last drag event */
  readonly delta: IVector2;
  /** Buttons down during event */
  readonly buttons: PointerButtonMask;
}

/**
 * Fired on every mouse up, includes information about the difference between the DragBegin and current positions
 */
export interface DragEndEvent extends DragEvent {
  /** duration since last DragEvent */
  readonly timeSinceLastMove: number;

  /** The delta between position, and the position from DragBeginEvent */
  readonly fullDelta: IVector2;
}

export interface PointerMoveEvent {
    readonly id: number;
    readonly position: IVector2;
    readonly buttons: PointerButtonMask;
    readonly device: PointerDevice;
}

export interface PointerButtonEvent {
    readonly id: number;
    readonly position: IVector2;
    readonly button: PointerButton;
    readonly down: boolean;
    readonly device: PointerDevice;
}

export interface ScrollEvent {
  readonly position: IVector2;
  readonly delta: IVector2;
}

export enum KeyState {
  DOWN,
  PRESSED,
  UP,
}

export enum Keys{
  ESCAPE = 27,
  ZERO = 48,
  ONE = 49,
  TWO = 50,
  THREE = 51,
  FOUR = 52,
  FIVE = 53,
  SIX = 54,
  SEVEN = 55,
  EIGHT = 56,
  NINE = 57,
  LEFTARROW = 37,
  UPARROW = 38,
  RIGHTARROW = 39,
  DOWNARROW = 40,
  TAB = 9,
  A = 65,
  B = 66,
  C = 67,
  D = 68,
  E = 69,
  F = 70,
  G = 71,
  H = 72,
  I = 73,
  J = 74,
  K = 75,
  L = 76,
  M = 77,
  N = 78,
  O = 79,
  P = 80,
  Q = 81,
  R = 82,
  S = 83,
  T = 84,
  U = 85,
  V = 86,
  W = 87,
  X = 88,
  Y = 89,
  Z = 90,
  SPACE = 32,
  RETURN = 13,
  DELETE = 46,
  BACKSPACE = 8,
  SEMICOLON = 186,
  PLUSEQUALS = 187,
  DASHUNDERSCORE = 189,
  OPENBRACKET = 219,
  SHIFT = 16,
  ALT = 18,
  CONTROL = 17,
}

export interface KeyEvent {
  key: Keys;
  state: KeyState;
  modifiers: {
    altKey: boolean,
    shiftKey: boolean,
    ctrlKey: boolean
  };
}

export interface LongPressStartEvent {
  readonly position: IVector2;
  readonly buttons: PointerButtonMask;
  readonly threshold: number;
}

export interface LongPressEndEvent {}

export interface MultiSwipeEvent {
  readonly pointerCount: number;
  readonly position: IVector2;
  readonly delta: IVector2;
}

export interface MultiSwipeEndEvent extends MultiSwipeEvent {
  readonly timeSinceLastMove: number;
}

export interface PinchEvent {
  readonly pinchDelta: number;
}

export interface PinchEndEvent extends PinchEvent {
  readonly timeSinceLastMove: number;
}

export interface RotateEvent {
  readonly rotateDelta: number;
}

export interface RotateEndEvent extends RotateEvent {
  readonly timeSinceLastMove: number;
}
