import { Mode } from 'rc-app/types';
import React, { Component } from 'react';

import { HostController } from './HostController';
import { ObserverController } from './ObserverController';
import { SelectMode } from './SelectMode';

interface State {
  mode: Mode;
}

export class Main extends Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      mode: Mode.Idle,
    };
    this.onSelected = this.onSelected.bind(this);
    this.onModeFinished = this.onModeFinished.bind(this);
  }

  private onSelected(mode: Mode) {
    switch (this.state.mode) {
      case Mode.Idle:
        this.setState({ mode: mode });
        break;

      case Mode.HostMode:
        if (mode === Mode.Idle) {
          this.setState({ mode });
        }
        break;

      case Mode.ObserverMode:
        if (mode === Mode.Idle) {
          this.setState({ mode });
        }
        break;
    }
  }

  private onModeFinished() {
    this.setState({ mode: Mode.Idle });
  }

  render() {
    switch (this.state.mode) {
      case Mode.Idle:
        return <SelectMode onSelected={this.onSelected} />;

      case Mode.HostMode:
        return <HostController onFinished={this.onModeFinished} />;

      case Mode.ObserverMode:
        return <ObserverController onFinished={this.onModeFinished} />;
    }
    return null;
  }
}
