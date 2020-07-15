import { PhotonClient } from 'rc-app/PhotonClient';

import { DefaultGetTime, GetTimeCallback, millisecondsPerStep, sendInterval, StepPayload, StepPayloadType } from './common';

export class LocalTime {
  private startTime: number = 0;
  private intervalId: number = 0;

  constructor(private photonClient: PhotonClient, private getTimeCallback: GetTimeCallback = DefaultGetTime) {
    this.sendStep = this.sendStep.bind(this);
  }

  public start() {
    this.startTime = this.getTimeCallback();
    this.intervalId = window.setInterval(this.sendStep, sendInterval);
  }

  public stop() {
    clearInterval(this.intervalId);
  }

  private sendStep() {
    const event: StepPayload = {
      type: StepPayloadType,
      step: this.currentStep(),
      time: this.getTimeCallback(),
    };
  
    this.photonClient.raiseEvent(0, event);
  }

  public currentStep(): number {
    const currentTime = this.getTimeCallback();
    return Math.ceil((currentTime - this.startTime) / millisecondsPerStep);
  }
}
