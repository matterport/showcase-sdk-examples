import React, { Component } from 'react';
import { Typography, Checkbox } from '@mui/material';
import { RowMargin } from './sharedCss';
import styled from '@emotion/styled';

const styles ={
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
};
const ContainerDiv = styled.div(styles.container);

interface Props {
  label?: string;
  value: boolean;
  readonly: boolean;
  onChanged?: (newValue: boolean) => void;
}

export class BooleanEditor extends Component<Props> {
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
    let label: JSX.Element = null;
    if (this.props.label) {
      label = <Typography sx={styles.label}>{this.props.label}</Typography>;
    } else {
      label = <div></div>;
    }

    return (
      <ContainerDiv>
        {label}
        <Checkbox sx={styles.checkbox}
          checked={this.props.value}
          onChange={this.handlePropertyChange}
          disabled={this.props.readonly}
        />
      </ContainerDiv>
    );
  }
}
