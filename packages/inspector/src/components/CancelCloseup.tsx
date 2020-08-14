import React, { Component } from 'react';
import { WithStyles, withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    position: 'absolute' as 'absolute',
  }
});

interface Props extends WithStyles<typeof styles> {
  onClose: () => void;
}

class CancelCloseupImpl extends Component<Props> {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <button onClick={this.props.onClose}>Close View</button>
      </div>
    );
  }
}

export const CancelCloseup = withStyles(styles, { withTheme: true })(CancelCloseupImpl);
