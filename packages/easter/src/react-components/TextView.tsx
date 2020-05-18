import React, { Component } from 'react';

interface Props {
  className: string;
  text: string;
  onClicked?: () => void | null;
}

export class TextView extends Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.className} onClick={this.props.onClicked||null}>{this.props.text}</div>
    );
  }
}
