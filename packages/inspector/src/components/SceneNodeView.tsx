import React, { Component } from 'react';
import type { MpSdk } from '../../../bundle/sdk';
import { ComponentView } from './ComponentView';
import { SceneNodeTransformView } from './SceneNodeTransformView';
import { JsxBuffer } from '../utils';
import styled from '@emotion/styled';

const styles = {
  container: {
    flexGrow: 1,
    height: '100%',
    alignItems: 'stretch',
    minWidth: 250,
    overflowX: 'hidden',
    overflowY: 'auto',
    maxWidth: 264,
  },
} as const;
const ContainerDiv = styled.div(styles.container);
interface Props {
  selection: MpSdk.Scene.INode;
}

export class SceneNodeView extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const componentBuffer = new JsxBuffer('components');
    if (this.props.selection) {
      for (const component of this.props.selection.componentIterator()) {
        componentBuffer.push(<ComponentView component={component}></ComponentView>);
      }
    }

    return (
      <ContainerDiv>
        <SceneNodeTransformView selection={this.props.selection}></SceneNodeTransformView>
        {componentBuffer.elements}
      </ContainerDiv>
    );
  }
}
