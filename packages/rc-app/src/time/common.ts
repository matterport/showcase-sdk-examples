
export const millisecondsPerStep = 15;
export const fixedDelay = 200;
export const sendInterval = 2000;

export type GetTimeCallback = () => number;

export const DefaultGetTime: GetTimeCallback = () => {
  return new Date().getTime();
};

export const StepPayloadType = 'step';

export type StepPayload = {
  type: string;
  time: number;
  step: number;
}
