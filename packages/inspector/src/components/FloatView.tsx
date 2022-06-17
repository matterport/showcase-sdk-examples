import React, { Component } from 'react';
import { TextField } from '@mui/material';

const styles = {
  textField: {
    width: 40,
    fontSize: '9pt',
    padding: '6px',
  },
};

interface Props {
  value: number;
}

export class FloatView extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <TextField
        sx={styles.textField}
        value={this.props.value.toFixed(2)}
        label="x"
        variant="outlined"
        margin="dense"
        InputProps={{
          sx: { input: styles.textField },
        }}
        disabled={true}
      />
    );
  }
}
