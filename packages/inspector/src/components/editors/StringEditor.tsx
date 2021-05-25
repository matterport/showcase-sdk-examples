import React, { Component, createRef } from 'react';
import { TextField, Typography, WithStyles, withStyles } from '@material-ui/core';
import { RowMargin } from './sharedCss';
import { Keys } from '@mp/common';

const styles = () => ({
  container: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: RowMargin,
    marginBottom: RowMargin,
  },
  label: {
    flex: 1,
    fontSize: '9pt',
    marginRight: '6px',
  },
  textField: {
    width: 160,
    fontSize: '9pt',
    padding: '6px',
  },
  indent: {
    width: '25px',
    minWidth: '25px'
  },
});

interface Props extends WithStyles<typeof styles> {
  label?: string;
  value: string;
  readonly: boolean;
  onChanged?: (newValue: string) => void;
}
interface State {
  editing: boolean;
  value: string;
}

class StringEditorImpl extends Component<Props, State> {
  private inputRef: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);

    this.state = {
      editing: false,
      value: props.value,
    };

    this.handlePropertyChange = this.handlePropertyChange.bind(this);
    this.handleKeyEvent = this.handleKeyEvent.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.inputRef = createRef<HTMLInputElement>();
  }

  private handlePropertyChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      value: event.target.value,
    });
  }

  private handleKeyEvent(event: React.KeyboardEvent) {
    if (event.keyCode === Keys.RETURN) {
      this.editComplete();
      this.inputRef.current.blur();
    }
    else if(event.keyCode === Keys.ESCAPE) {
      this.editCancel();
    }
  }

  private onBlur(event: React.FocusEvent) {
    this.editComplete();
  }

  private onFocus(event: React.FocusEvent) {
    this.setState({
      editing: true,
      value: this.props.value,
    });
  }

  private editCancel() {
    this.setState({
      editing: false,
      value: this.props.value,
    })
  }

  private editComplete() {
    this.props.onChanged(this.state.value);
    this.setState({
      editing: false,
    });
  }

  render() {
    const classes = this.props.classes;
    const value = this.state.editing ? this.state.value : this.props.value;

    let label: JSX.Element = null;
    if (this.props.label) {
      label = <Typography className={classes.label}>{this.props.label}</Typography>;
    } else {
      label = <div></div>;
    }

    return (
      <div className={classes.container}>
        {label}
        <TextField
          inputRef={this.inputRef}
          defaultValue={value}
          onChange={this.handlePropertyChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyDown={this.handleKeyEvent}
          variant="outlined"
          size="small"
          margin="none"
          InputProps={{
            disabled: this.props.readonly,
            classes: {
              input: classes.textField,
            },
          }}
        />
      </div>
    );
  }
}

export const StringEditor = withStyles(styles, { withTheme: true })(StringEditorImpl);
