import React, { Component, createRef } from 'react';
import { TextField, Typography } from '@mui/material';
import { RowMargin } from './sharedCss';
import styled from '@emotion/styled';

const styles = {
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
  }
};
const ContainerDiv = styled.div(styles.container);

interface Props {
  label?: string;
  value: number;
  readonly: boolean;
  onChanged?: (newValue: number) => void;
}
interface State {
  editing: boolean;
  value: number;
}

export class NumberEditor extends Component<Props, State> {
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
    const num = parseFloat(event.target.value);
    this.setState({
      value: num,
    });
  }

  private handleKeyEvent(event: React.KeyboardEvent) {
    console.log(event);
    if (event.keyCode === 13) {
      this.editComplete();
      this.inputRef.current.blur();
    }
    else if(event.keyCode === 27) {
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
    const value = this.state.editing ? this.state.value : this.props.value;

    let label: JSX.Element = null;
    if (this.props.label) {
      label = <Typography sx={styles.label}>{this.props.label}</Typography>;
    }
    else {
      label = <div></div>;
    }

    return (
      <ContainerDiv>
        {label}
        <TextField
          inputRef={this.inputRef}
          defaultValue={value}
          onChange={this.handlePropertyChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onKeyDown={this.handleKeyEvent}
          variant='outlined'
          size='small'
          margin='none'
          type='number'
          InputProps={{
            disabled: this.props.readonly,
            sx: {input: styles.textField},
          }}
        />
      </ContainerDiv>
    );
  }
}
