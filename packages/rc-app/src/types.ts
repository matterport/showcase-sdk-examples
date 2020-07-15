import { PhotonClient } from './PhotonClient';
import { RemoteSimulator } from './simulator/RemoteSimulator';
import { LocalSimulator } from './simulator/LocalSimulator';

export enum Mode {
  Idle,
  HostMode,
  ObserverMode,
}

export enum HostingState {
  SelectingModel,
  Connecting,
  Hosting,
}

export enum ObservingState {
  Connecting,
  SelectingHost,
  Observing,
}

export enum PhotonState {
  Disconnected,
  Connecting,
  Connected,
}

export interface IContext {
  photonClient: PhotonClient;
  sdkClient: RemoteSimulator;
  sdkHost: LocalSimulator;
}

export type IVector2 = {
  x: number;
  y: number;
};

export type IVector3 = {
  x: number;
  y: number;
  z: number;
};

export type CameraPose = {
  mode: string;
  position: IVector3;
  rotation: IVector2;
  sweep: string;
};

/**
 * The host actors custom pose property. Updated once a second.
 */
export type Frame = {
  step: number;
  pose: CameraPose;
};

/**
 * An SDK Event sent over the photon network.
 */
export type Event = {
  /**
   * The sdk event type.
   */
  type: string;

  /**
   * The current step number.
   */
  step: number;

  /**
   * The event arguments.
   */
  args: any[];
};


export type Room = {
  name: string;
  sid: string;
}

export type Actor = {
  id: number;
}