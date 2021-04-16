import React, { Component } from 'react';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

const styles = () => ({
  textField: {
    width: 40,
    fontSize: '9pt',
    padding: '6px',
  },
});

interface Props extends WithStyles<typeof styles> {
  value: number;
}

class FloatViewImpl extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const classes = this.props.classes;

    return (
      <TextField
        className={classes.textField}
        value={this.props.value.toFixed(2)}
        label="x"
        variant="outlined"
        margin="dense"
        InputProps={{
          classes: {
            input: classes.textField,
          },
        }}
        disabled={true}
      />
    );
  }
}

export const FloatView = withStyles(styles, { withTheme: true })(FloatViewImpl);
