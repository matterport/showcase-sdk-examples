import { ClientContext } from 'rc-app/components/Context';
import { IContext } from 'rc-app/types';
import React, { Component, createRef, RefObject, forwardRef } from 'react';

interface Props {
  sid: string;
  userCount: number;
  host: boolean;
  onStopped?: () => void;
}

const Iframe = (props: { src: string }, ref: any) => {
  return (
    <iframe
      id="sdk-iframe"
      className="frame"
      src={props.src}
      ref={ref}
      allow="xr-spatial-tracking"
      allowFullScreen
    ></iframe>
  );
};

const IFrame2 = forwardRef(Iframe);

export class IFrameOverlay extends Component<Props, {}> {
  context: IContext;
  static contextType = ClientContext;
  private iframeRef: RefObject<HTMLIFrameElement>;

  constructor(props: Props) {
    super(props);

    this.state = {};
    this.onStopped = this.onStopped.bind(this);
    this.iframeRef = createRef();
  }

  componentDidMount() {
    if (this.props.host) {
      this.context.sdkHost.start(this.iframeRef.current);
    }
    else {
      this.context.sdkClient.start(this.iframeRef.current);
    }
  }

  componentWillUnmount() {
    if (this.props.host) {
      this.context.sdkHost.stop();
    }
    else {
      this.context.sdkClient.stop();
    }
  }

  onStopped(event: React.MouseEvent<HTMLButtonElement>) {
    if (this.props.onStopped) {
      this.props.onStopped();
    }
  }

  render(): JSX.Element {
    const url = `https://my.matterport.com/show?m=${this.props.sid}&title=0&qs=1&hr=0&brand=0&help=0&play=1&dh=0&fp=0`;
    return (
      <div className="frame">
        <IFrame2 ref={this.iframeRef} src={url}></IFrame2>
        <div className="iframeoverlay-container">
          <div className="iframeoverlay-details-container">
            <div className="iframeoverlay-title">{this.props.host ? 'HOSTING' : 'OBSERVING'}</div>
            <div>{this.props.userCount} user(s)</div>
          </div>
          <button type="button" className="iframeoverlay-button" onClick={this.onStopped}>
            STOP
          </button>
        </div>
      </div>
    );
  }
}
