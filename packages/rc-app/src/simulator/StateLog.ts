const StepWindow = 180;

export class StateLog<StateT> {
  private states: Map<number, StateT> = new Map();
  private sortedKeys: number[] = null;

  constructor(private window: number = StepWindow) {}

  public set(step: number, state: StateT) {
    if (this.states.has(step)) {
      console.log(`Overwriting log at step ${step}`);
    }

    this.states.set(step, state);
    this.sortedKeys = null;
  }

  public get(step: number): StateT | null {
    this.updateSorted();

    if (this.states.has(step)) {
      return this.states.get(step);
    }

    return null;
  }

  public updateToStep(step: number) {
    this.updateSorted();

    // remove steps older than the step window
    const minStep = Math.max(step - this.window, 0);
    for (const storedStep of this.sortedKeys) {
      if (storedStep < minStep) {
        this.states.delete(storedStep);
      }
    }
    this.sortedKeys = null;
  }

  public clear() {
    this.states.clear();
    this.sortedKeys = null;
  }

  private updateSorted() {
    if (!this.sortedKeys) {
      const steps = Array.from(this.states.keys());
      this.sortedKeys = steps.sort();
    }
  }

  public latest(): StateT | null {
    if (this.sortedKeys.length === 0) {
      return null;
    }

    this.updateSorted();
    const latestStep = this.sortedKeys[this.sortedKeys.length - 1];
    return this.states.get(latestStep);
  }

  public earliest(): StateT | null {
    if (this.sortedKeys.length === 0) {
      return null;
    }

    this.updateSorted();
    const earliestStep = this.sortedKeys[0];
    return this.states.get(earliestStep);
  }
}
