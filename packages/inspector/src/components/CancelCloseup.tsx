import React, { Component } from 'react';
import styled from '@emotion/styled';

const AbsoluteDiv = styled.div`position: absolute;`;

interface Props {
  onClose: () => void;
}
export class CancelCloseup extends Component<Props> {
  render() {
    return <AbsoluteDiv>
      <button onClick={this.props.onClose}>CloseView</button>
    </AbsoluteDiv>;
  }
}
