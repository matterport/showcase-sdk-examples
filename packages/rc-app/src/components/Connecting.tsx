import React, { Component } from 'react';

export class Connecting extends Component<{}, {}> {
  constructor(props: {}) {
    super(props);

    this.state = {};
  }

  render(): JSX.Element {
    return (
      <div className="connecting-container">
        <div className="connecting-title">
          CONNECTING...
        </div>
      </div>
    );
  }
}
