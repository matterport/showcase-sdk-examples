import { PhotonClient } from 'rc-app/PhotonClient';

import { DefaultGetTime, fixedDelay, GetTimeCallback, millisecondsPerStep, StepPayload, StepPayloadType } from './common';

const latencyThreshold = 600;

export class RemoteTime {
  private startTime: number = 0;
  private startStep: number = 0;

  constructor(private photonClient: PhotonClient, private getTimeCallback: GetTimeCallback = DefaultGetTime) {
    this.handleEvent = this.handleEvent.bind(this);
  }

  public start(){
    this.photonClient.events.on(StepPayloadType, this.handleEvent);
  }

  public stop() {
    this.photonClient.events.off(StepPayloadType, this.handleEvent);
  }

  private handleEvent(event: StepPayload) {
    const currentTime = this.getTimeCallback();
    this.startTime = event.time;
    this.startStep = event.step;
    
    const latency = currentTime - event.time;
    if (latency > latencyThreshold) {
      console.warn(`Detected high latency: ${latency}`);
    }
  }

  public currentStep(): number {
    const currentTime = this.getTimeCallback();
    const stepDelta = Math.ceil((currentTime - this.startTime - fixedDelay) / millisecondsPerStep);
    return this.startStep + stepDelta;
  }
}
