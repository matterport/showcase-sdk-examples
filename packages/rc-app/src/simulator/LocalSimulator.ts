import { PhotonClient, waitUntil } from '../PhotonClient';
import { makeSimulationFSM, FSMInterpreter } from './SimulationFSM';
import { CameraPose, Event, Frame, IVector3 } from '../types';
import { LocalTime } from '../time/LocalTime';

const sendEvent = (photonClient: PhotonClient, type: string, step: number, args: IArguments) => {
  const event: Event = {
    type,
    step,
    args: Array.from(args),
  };

  photonClient.raiseEvent(0, event);
};

const frameFromPose = (step: number, pose: CameraPose): Frame => {
  return  {
    step,
    pose: {
      position: {
        x: pose.position.x,
        y: pose.position.y,
        z: pose.position.z,
      },
      rotation: {
        x: pose.rotation.x,
        y: pose.rotation.y,
      },
      mode: pose.mode,
      sweep: pose.sweep,
    },
  };
}

export class LocalSimulator {
  private fsm: FSMInterpreter = null;
  private iframe: HTMLIFrameElement = null;
  private sdk: any = null;
  private cameraPose: CameraPose = null;
  private cameraPoseSub: any = null;
  private tickIntervalId: number = null;
  private time: LocalTime;
  private tmp: IVector3 = { x: 0, y: 0, z: 0};

  constructor(private photonClient: PhotonClient, private applicationKey: string) {
    this.onTick = this.onTick.bind(this);

    this.fsm = makeSimulationFSM(
      this.onEnterIdle,
      this.onEnterInitialized,
      this.onEnterSimulating,
      this.onExitSimulating
    );
    this.fsm.start();
    this.time = new LocalTime(photonClient);
  }

  public async start(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
    this.fsm.send('START');
  }

  public stop() {
    this.fsm.send('STOP');
  }

  private onEnterIdle = async () => {
    this.iframe = null;
    this.sdk = null;
  };

  private onEnterInitialized = async () => {
    this.sdk = await (window as any).MP_SDK.connect(this.iframe, this.applicationKey, '3.4');
    console.log('%c MP SDK Connected', 'background: #DADADA; color: #222222;', this.sdk);

    let appState: any = null;
    const appSub = this.sdk.App.state.subscribe((state: any) => {
      appState = state;
    });

    await waitUntil(() => {
      return appState && appState.phase === this.sdk.App.Phase.PLAYING;
    });

    appSub.cancel();
    this.fsm.send('SDK_READY');
  }

  private onEnterSimulating = async () => {
    this.time.start();
    this.cameraPoseSub = this.sdk.Camera.pose.subscribe((pose: CameraPose) => {
      this.cameraPose = pose;
    });

    this.sdk.on(this.sdk.Sweep.Event.EXIT, (...args: any) => sendEvent(this.photonClient, this.sdk.Sweep.Event.EXIT, this.time.currentStep(), args));
    this.sdk.on(this.sdk.Mode.Event.CHANGE_START, (...args: any) => sendEvent(this.photonClient, this.sdk.Mode.Event.CHANGE_START, this.time.currentStep(), args));
    this.sdk.on(this.sdk.Mode.Event.CHANGE_END, (...args: any) => sendEvent(this.photonClient, this.sdk.Mode.Event.CHANGE_END, this.time.currentStep(), args));

    this.tickIntervalId = window.setInterval(this.onTick, 15);
  }

  private onExitSimulating = async () => {
    clearInterval(this.tickIntervalId);
    this.tickIntervalId = null;

    if (this.cameraPoseSub) {
      this.cameraPoseSub.cancel();
      this.cameraPoseSub = null;
    }

    this.time.stop();
  }

  private onTick() {
    const currentStep = this.time.currentStep();

    const lastFrame: Frame = this.photonClient.myActor().getCustomProperty('pose');

    if (!lastFrame) {
      // set initial state if we have a camera pose, otherwise try again next tick.
      if (this.cameraPose) {
        this.photonClient.myActor().setCustomProperty('pose', frameFromPose(currentStep, this.cameraPose));
      }
      return;
    }

    if (lastFrame.step === currentStep) {
      // state already set for this step, no need to update.
      return;
    }

    const rotChanged =  Math.abs(this.cameraPose.rotation.x - lastFrame.pose.rotation.x) > 0.01 ||
                        Math.abs(this.cameraPose.rotation.y - lastFrame.pose.rotation.y);
    this.tmp.x = this.cameraPose.position.x - lastFrame.pose.position.x;
    this.tmp.y = this.cameraPose.position.y - lastFrame.pose.position.y;
    this.tmp.z = this.cameraPose.position.z - lastFrame.pose.position.z;
    const posChanged = (this.tmp.x * this.tmp.x + this.tmp.y * this.tmp.y + this.tmp.z * this.tmp.z) > 0.001;
    const sweepChanged = this.cameraPose.sweep !== lastFrame.pose.sweep;

    // only update the state if the pose has changed.
    if (posChanged || rotChanged || sweepChanged) {
      this.photonClient.myActor().setCustomProperty('pose', frameFromPose(currentStep, this.cameraPose));
    }
  }
}
