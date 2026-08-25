import type { MpSdk } from '../../../bundle/sdk';
import type { KeyState, Keys, PointerButtonMask } from './enums';

export interface DragBeginEvent {
  readonly position: MpSdk.Vector2;
  readonly buttons: PointerButtonMask;
}

export interface DragEvent {
  readonly position: MpSdk.Vector2;
  readonly delta: MpSdk.Vector2;
  readonly buttons: PointerButtonMask;
}

export interface ScrollEvent {
  readonly position: MpSdk.Vector2;
  readonly delta: MpSdk.Vector2;
}

export interface KeyEvent {
  key: Keys;
  state: KeyState;
  modifiers: {
    altKey: boolean;
    shiftKey: boolean;
    ctrlKey: boolean;
  };
}
