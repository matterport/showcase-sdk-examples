import { interpret, Machine } from 'xstate';

export interface FSMSchema {
  states: {
    // Doing nothing, initial state
    idle: {};

    // Setting up the sdk
    initializing: {};

    // Simulating camera motion
    simulating: {};
  };
}

export type FSMEvent = {type: 'START' } | { type: 'SDK_READY' } | { type: 'STOP' };

type Callback = (context: unknown, event: FSMEvent) => Promise<void>;

export const makeSimulationFSM = (
  onEnterIdle: Callback,
  onEnterInitializing: Callback,
  onEnterSimulating: Callback,
  onExitSimulating: Callback
) => {
  return interpret(
    Machine<unknown, FSMSchema, FSMEvent>(
      {
        initial: 'idle',
        states: {
          idle: {
            on: {
              START: 'initializing',
            },
            entry: 'onEnterIdle',
          },
          initializing: {
            on: {
              SDK_READY: 'simulating',
            },
            entry: 'onEnterInitializing',
          },
          simulating: {
            on: {
              STOP: 'idle',
            },
            entry: 'onEnterSimulating',
            exit: 'onExitSimulating',
          },
        },
      },
      {
        actions: {
          onEnterIdle,
          onEnterInitializing,
          onEnterSimulating,
          onExitSimulating,
        },
      }
    )
  );
};
