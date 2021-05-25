import React, { Component } from 'react';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import { FloatView } from './FloatView';
import { Typography } from '@material-ui/core';

const styles = () => ({
  rowGroup: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  label: {
    flex: 1,
    fontSize: '9pt',
    paddingTop: '12px',
  },
  textField: {
    width: 30,
    fontSize: '9pt',
    padding: '1px',
  },
});

interface Props extends WithStyles<typeof styles> {
  label: string;
  x: number;
  y: number;
  z: number;
}

class Vector3ViewImpl extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const classes = this.props.classes;

    return (
      <div className={classes.rowGroup}>
        <div className={classes.textField}>
          <Typography className={classes.label}>{this.props.label}</Typography>
        </div>
        <FloatView value={this.props.x}></FloatView>
        <FloatView value={this.props.y}></FloatView>
        <FloatView value={this.props.z}></FloatView>
      </div>
    );
  }
}

export const Vector3View = withStyles(styles, { withTheme: true })(Vector3ViewImpl);
