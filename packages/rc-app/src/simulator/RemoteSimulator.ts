import { onActorPropertiesChangedEvent, waitUntil, PhotonClient } from '../PhotonClient';
import { StateLog } from './StateLog';
import { CameraPose, Event, Frame } from '../types';
import { makeSimulationFSM, FSMInterpreter } from './SimulationFSM';
import { RemoteTime } from '../time/RemoteTime';

/**
 * The class controls the showcase via the sdk by consuming events from the sdk event source.
 */
export class RemoteSimulator {
  private fsm: FSMInterpreter = null;
  private iframe: HTMLIFrameElement = null;
  private sdk: any = null;
  private cameraPose: CameraPose = null;
  private cameraPoseSub: any = null;
  private frameLog = new StateLog<Frame>();
  private eventLog = new StateLog<Event>();
  private tickIntervalId: number = null;
  private time: RemoteTime;
  private inTransition: boolean = false;
  private inRotation: boolean = false;
  private lastFrame: Frame|null = null;

  constructor(private photonClient: PhotonClient, private applicationKey: string) {
    this.onEnterIdle = this.onEnterIdle.bind(this);
    this.onEnterInitialized = this.onEnterInitialized.bind(this);
    this.onEnterSimulating = this.onEnterSimulating.bind(this);
    this.onExitSimulating = this.onExitSimulating.bind(this);
    this.onTick = this.onTick.bind(this);
    this.pushToEventLog = this.pushToEventLog.bind(this);

    this.fsm = makeSimulationFSM(
      this.onEnterIdle,
      this.onEnterInitialized,
      this.onEnterSimulating,
      this.onExitSimulating
    );
    this.fsm.start();
    this.time = new RemoteTime(this.photonClient)
  }

  /**
   * Start the client simulator. This function does nothing if the simulator has already been started.
   * @param iframe The showcase iframe.
   */
  public start(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
    this.fsm.send('START');
  }

  /**
   * Stop the client simulator. This function does nothing if the simulaotr has already been stopped.
   */
  public stop() {
    this.fsm.send('STOP');
  }

  private onEnterIdle = async () => {
    this.iframe = null;
    this.sdk = null;
    this.frameLog.clear();
    this.eventLog.clear();
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
  };

  private pushToEventLog = (event: Event) => {
    this.eventLog.set(event.step, event)
  };

  private onEnterSimulating = async () => {
    this.inTransition = false;
    this.time.start();
    this.cameraPoseSub = this.sdk.Camera.pose.subscribe((pose: CameraPose) => {
      this.cameraPose = pose;
    });

    this.photonClient.events.on(this.sdk.Sweep.Event.ENTER, this.pushToEventLog);
    this.photonClient.events.on(this.sdk.Sweep.Event.EXIT, this.pushToEventLog);
    this.photonClient.events.on(this.sdk.Mode.Event.CHANGE_START, this.pushToEventLog);
    this.photonClient.events.on(this.sdk.Mode.Event.CHANGE_END, this.pushToEventLog);

    this.photonClient.events.on(onActorPropertiesChangedEvent, (actor: Photon.LoadBalancing.Actor) => {
      const frame: Frame = actor.getCustomProperty('pose');
      this.frameLog.set(frame.step, frame);
    });

    // If the host is already in this room, initialize the state log.
    const host = this.photonClient.myRoom().getCustomProperty('host');

    if (host) {
      const actors = this.photonClient.myRoomActors() as any;
      const actor = actors[host] as Photon.LoadBalancing.Actor;
      const frame: Frame = actor.getCustomProperty('pose');
      if (frame) {
        const newFrame: Frame = {
          step: frame.step,
          pose: {
            position: {
              x: frame.pose.position.x,
              y: frame.pose.position.y,
              z: frame.pose.position.z,
            },
            rotation: {
              x: frame.pose.rotation.x,
              y: frame.pose.rotation.y,
            },
            sweep: frame.pose.sweep,
            mode: frame.pose.mode,
          },
        };
        this.frameLog.set(frame.step, newFrame);
        this.lastFrame = newFrame;
      }
    }

    this.tickIntervalId = window.setInterval(this.onTick, 15);
  };

  private onExitSimulating = async () => {
    clearInterval(this.tickIntervalId);
    this.tickIntervalId = null;

    this.cameraPoseSub.cancel();
    this.cameraPoseSub = null;

    this.photonClient.events.off(this.sdk.Sweep.Event.ENTER, this.pushToEventLog);
    this.photonClient.events.off(this.sdk.Sweep.Event.EXIT, this.pushToEventLog);
    this.photonClient.events.off(this.sdk.Mode.Event.CHANGE_START, this.pushToEventLog);
    this.photonClient.events.off(this.sdk.Mode.Event.CHANGE_END, this.pushToEventLog);

    this.photonClient.events.removeAllListeners();
    this.time.stop();
  };

  private onTick() {
    const currentStep = this.time.currentStep();

    this.frameLog.updateToStep(currentStep);
    this.eventLog.updateToStep(currentStep);

    // Process events first to trigger a transition prior to initiating a frame correction
    const currentEvent = this.eventLog.get(currentStep);
    if (currentEvent && currentEvent.type === 'sweep.exit' && !this.inTransition && !this.inRotation) {
      this.inTransition = true;
      this.sdk.Sweep.moveTo(currentEvent.args[1], {
        transition: this.sdk.Sweep.Transition.FLY,
      })
      .finally(() => {
        this.inTransition = false;
      });
    }

    // Apply a camera rotation or sweep update if either is different from the frame log at the current step.
    const currentFrame = this.frameLog.get(currentStep) || this.lastFrame;
    if (currentFrame && this.cameraPose) {

      // Rotation update
      const diffX = Math.abs(this.cameraPose.rotation.x - currentFrame.pose.rotation.x);
      const diffY = Math.abs(this.cameraPose.rotation.y - currentFrame.pose.rotation.y);
      const lengthSquared = diffX * diffX + diffY * diffY;
      if (lengthSquared > 0.01 && !this.inRotation) {
        this.inRotation = true;
        this.sdk.Camera.setRotation({
          x: currentFrame.pose.rotation.x,
          y: currentFrame.pose.rotation.y,
        })
        .finally(() => {
          this.inRotation = false;
        });
      }

      // Sweep update.
      if (this.cameraPose.sweep !== currentFrame.pose.sweep) {
        if (!this.inTransition && !this.inRotation) {
          this.inTransition = true;
          this.sdk.Sweep.moveTo(currentFrame.pose.sweep, {
            transition: this.sdk.Sweep.Transition.INSTANT,
            transitionTime: 0.01,
          })
          .finally(() => {
            this.inTransition = false;
          });
        }
      }

      this.lastFrame = currentFrame;
    }
  }
}
