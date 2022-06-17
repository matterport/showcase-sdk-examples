import React, { Component } from 'react';
import { Typography } from '@mui/material';
import { StringEditor } from './StringEditor';
import { NumberEditor } from './NumberEditor';
import { BooleanEditor } from './BooleanEditor';
import { RowMargin } from './sharedCss';
import { JsxBuffer } from '../../utils';
import styled from '@emotion/styled';

const styles = {
  container: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: RowMargin,
    marginBottom: RowMargin,
  },
  index: {
    width: 160,
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
    minWidth: '25px',
  },
};
const ContainerDiv = styled.div(styles.container);
const IndentDiv = styled.div(styles.indent);

interface Props {
  label: string;
  object: any;
  indent: number;
  readonly: boolean;
  onChanged?: (property: string, newValue: any) => void;
}

export class ObjectEditor extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.onPropertyChanged = this.onPropertyChanged.bind(this);
  }

  private onPropertyChanged(propertyName: string, value: any) {
    this.props.onChanged(propertyName, value);
  }

  render() {
    // let key = 0;
    const properties = new JsxBuffer('properties');
    const labelIndents = new JsxBuffer('labelIndent');
    const propertyIndents = new JsxBuffer('propIndent');
    const spacer = <IndentDiv></IndentDiv>;

    for (let i = 0; i < this.props.indent; i++) {
      labelIndents.push(spacer);
      propertyIndents.push(spacer);
    }
    propertyIndents.push(spacer);

    if (!this.props.object) {
      return (
        <ContainerDiv>
          {labelIndents.elements}
          <Typography sx={styles.index}>{this.props.label}</Typography>
          <Typography sx={styles.textField}>Null</Typography>
        </ContainerDiv>
      );
    } else {
      properties.push(
        <div>
          {labelIndents.elements}
          <Typography sx={styles.index}>{this.props.label}</Typography>
          <div></div>
        </div>
      );
    }

    const ctorName = this.props.object.constructor.name;
    const readonlyClass = ctorName !== 'Object' && ctorName !== 'Array';

    for (const property in this.props.object) {
      const value = this.props.object[property];

      if (typeof value === 'string') {
        properties.push(
          <ContainerDiv>
            {propertyIndents.elements}
            <Typography sx={styles.index}>{property}</Typography>
            <StringEditor
              value={value}
              readonly={this.props.readonly || readonlyClass}
              onChanged={(newValue: any) => this.onPropertyChanged(property, newValue)}
            ></StringEditor>
          </ContainerDiv>
        );
      } else if (typeof value === 'number') {
        properties.push(
          <ContainerDiv>
            {propertyIndents.elements}
            <Typography sx={styles.index}>{property}</Typography>
            <NumberEditor
              value={value}
              readonly={this.props.readonly || readonlyClass}
              onChanged={(newValue: any) => this.onPropertyChanged(property, newValue)}
            ></NumberEditor>
          </ContainerDiv>
        );
      } else if (typeof value === 'boolean') {
        properties.push(
          <ContainerDiv>
            {propertyIndents.elements}
            <Typography sx={styles.index}>{property}</Typography>
            <BooleanEditor
              value={value}
              readonly={this.props.readonly || readonlyClass}
              onChanged={(newValue) => this.onPropertyChanged(property, newValue)}
            ></BooleanEditor>
          </ContainerDiv>
        );
      }
    }

    return <div>{properties.elements}</div>;
  }
}