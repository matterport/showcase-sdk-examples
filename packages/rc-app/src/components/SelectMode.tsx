import React, { Component } from 'react';

import { Mode } from '../types';

interface Props {
  onSelected?: (mode: Mode) => void;
}

export class SelectMode extends Component<Props, {}> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  private onClick(mode: Mode) {
    if (this.props.onSelected) {
      this.props.onSelected(mode);
    }
  }

  render(): JSX.Element {
    return (
      <div className="select-mode-container">
        <div className="select-mode-title">
          SELECT A ROLE
        </div>
        <div>
          <button className="select-mode-button" onClick={(e) => this.onClick(Mode.HostMode)}>
            HOST
          </button>
          <button className="select-mode-button" onClick={(e) => this.onClick(Mode.ObserverMode)}>
            CLIENT
          </button>
        </div>
      </div>
    );
  }
}
