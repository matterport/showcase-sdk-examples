import React, { Component } from 'react';
import { Typography, WithStyles, withStyles, Checkbox } from '@material-ui/core';
import { RowMargin } from './sharedCss';

const styles = () => ({
  container: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: RowMargin,
    marginBottom: RowMargin,
  },
  label: {
    fontSize: '9pt',
    marginRight: '6px',
  },
  indent: {
    width: '25px',
    minWidth: '25px'
  },
  checkbox: {
    padding: '0px',
  }
});

interface Props extends WithStyles<typeof styles> {
  label?: string;
  value: boolean;
  readonly: boolean;
  onChanged?: (newValue: boolean) => void;
}

class BooleanEditorImpl extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.state = {
      editing: false,
      value: props.value,
    };

    this.handlePropertyChange = this.handlePropertyChange.bind(this);
  }

  private handlePropertyChange(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    this.props.onChanged(checked);
  }

  render() {
    const classes = this.props.classes;

    let label: JSX.Element = null;
    if (this.props.label) {
      label = <Typography className={classes.label}>{this.props.label}</Typography>;
    } else {
      label = <div></div>;
    }

    return (
      <div className={classes.container}>
        {label}
        <Checkbox
          className={classes.checkbox}
          checked={this.props.value}
          onChange={this.handlePropertyChange}
          disabled={this.props.readonly}
        />
      </div>
    );
  }
}

export const BooleanEditor = withStyles(styles, { withTheme: true })(BooleanEditorImpl);
