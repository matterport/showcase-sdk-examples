import React, { Component } from 'react';
import { IContext, IDialogUser } from '../interfaces';
import { AppContext } from '../AppContext';
import styled from '@emotion/styled';

const styles = {
  root:  {
    width: '100%',
    alignItems: 'stretch',
    flexGrow: 1,
    height: '100%',
    marginLeft: '8px',
    marginRight: '8px',
  },
  frame: {
    height: '100%',
    width: '100%',
  },
};

const FrameIframe = styled.iframe(styles.frame);
const RootDiv = styled.div(styles.root);

interface Props {
  src: string;
};

interface State {
  user: IDialogUser|null;
}

export class FrameView extends Component<Props, State> {
  context: IContext;
  static contextType = AppContext;

  constructor(props: Props){
    super(props);
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    this.context.frameOverlay.subscribe((user: IDialogUser) => {
      this.setState({
        user,
      });
    });
  }
  
  public render() {
    const { user } = this.state;

    return (
      <RootDiv>
        { this.state.user && user.jsx()}
        <FrameIframe id='sdk-iframe' src={this.props.src + '&title=0&qs=1&hr=0&brand=0&help=0'}></FrameIframe>
      </RootDiv>
    );
  }
}
