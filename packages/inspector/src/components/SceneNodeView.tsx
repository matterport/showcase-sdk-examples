import React, { Component } from 'react';
import { WithStyles, withStyles } from '@material-ui/core';
import { ISceneNode } from '@mp/common';
import { ComponentView } from './ComponentView';
import { SceneNodeTransformView } from './SceneNodeTransformView';
import { JsxBuffer } from '../utils';

const styles = () => ({
  container: {
    flexGrow: 1,
    height: '100%',
    alignItems: 'stretch',
    minWidth: 250,
    overflowX: 'hidden' as 'hidden',
    overflowY: 'auto' as 'auto',
    maxWidth: 264,
  },
});

interface Props extends WithStyles<typeof styles> {
  selection: ISceneNode;
}

class SceneNodeViewImpl extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const classes = this.props.classes;

    const componentBuffer = new JsxBuffer('components');
    if (this.props.selection) {
      for (const component of this.props.selection.componentIterator()) {
        componentBuffer.push(<ComponentView component={component}></ComponentView>);
      }
    }

    return (
      <div className={classes.container}>
        <SceneNodeTransformView selection={this.props.selection}></SceneNodeTransformView>
        {componentBuffer.elements}
      </div>
    );
  }
}

export const SceneNodeView = withStyles(styles, { withTheme: true })(SceneNodeViewImpl);
