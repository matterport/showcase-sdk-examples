import React, { Component } from 'react';
import { FloatView } from './FloatView';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';

const styles = {
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
};
const TextFieldDiv = styled.div(styles.textField);
const RowGroupDiv = styled.div(styles.rowGroup);

interface Props {
  label: string;
  x: number;
  y: number;
  z: number;
}

export class Vector3View extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <RowGroupDiv>
        <TextFieldDiv>
          <Typography sx={styles.label}>{this.props.label}</Typography>
        </TextFieldDiv>
        <FloatView value={this.props.x}></FloatView>
        <FloatView value={this.props.y}></FloatView>
        <FloatView value={this.props.z}></FloatView>
      </RowGroupDiv>
    );
  }
}
