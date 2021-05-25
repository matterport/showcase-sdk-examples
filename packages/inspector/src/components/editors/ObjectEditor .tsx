import React, { Component } from 'react';
import { Typography, WithStyles, withStyles } from '@material-ui/core';
import { StringEditor } from './StringEditor';
import { NumberEditor } from './NumberEditor';
import { BooleanEditor } from './BooleanEditor';
import { RowMargin } from './sharedCss';
import { JsxBuffer } from '../../utils';

const styles = () => ({
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
});

interface Props extends WithStyles<typeof styles> {
  label: string;
  object: any;
  indent: number;
  readonly: boolean;
  onChanged?: (property: string, newValue: any) => void;
}

class ObjectEditorImpl extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.onPropertyChanged = this.onPropertyChanged.bind(this);
  }

  private onPropertyChanged(propertyName: string, value: any) {
    this.props.onChanged(propertyName, value);
  }

  render() {
    const classes = this.props.classes;

    // let key = 0;
    const properties = new JsxBuffer('properties');
    const labelIndents = new JsxBuffer('labelIndent');
    const propertyIndents = new JsxBuffer('propIndent');
    const spacer = <div className={classes.indent}></div>;

    for (let i = 0; i < this.props.indent; i++) {
      labelIndents.push(spacer);
      propertyIndents.push(spacer);
    }
    propertyIndents.push(spacer);

    if (!this.props.object) {
      return (
        <div className={classes.container}>
          {labelIndents.elements}
          <Typography className={this.props.classes.index}>{this.props.label}</Typography>
          <Typography className={this.props.classes.textField}>Null</Typography>
        </div>
      );
    } else {
      properties.push(
        <div>
          {labelIndents.elements}
          <Typography className={this.props.classes.index}>{this.props.label}</Typography>
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
          <div className={classes.container}>
            {propertyIndents.elements}
            <Typography className={this.props.classes.index}>{property}</Typography>
            <StringEditor
              value={value}
              readonly={this.props.readonly || readonlyClass}
              onChanged={(newValue) => this.onPropertyChanged(property, newValue)}
            ></StringEditor>
          </div>
        );
      } else if (typeof value === 'number') {
        properties.push(
          <div className={classes.container}>
            {propertyIndents.elements}
            <Typography className={this.props.classes.index}>{property}</Typography>
            <NumberEditor
              value={value}
              readonly={this.props.readonly || readonlyClass}
              onChanged={(newValue) => this.onPropertyChanged(property, newValue)}
            ></NumberEditor>
          </div>
        );
      } else if (typeof value === 'boolean') {
        properties.push(
          <div className={classes.container}>
            {propertyIndents.elements}
            <Typography className={this.props.classes.index}>{property}</Typography>
            <BooleanEditor
              value={value}
              readonly={this.props.readonly || readonlyClass}
              onChanged={(newValue) => this.onPropertyChanged(property, newValue)}
            ></BooleanEditor>
          </div>
        );
      }
    }

    return <div>{properties.elements}</div>;
  }
}

export const ObjectEditor = withStyles(styles, { withTheme: true })(ObjectEditorImpl);
