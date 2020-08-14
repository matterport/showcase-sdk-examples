import React, { Component } from 'react';
import { IContext } from '../interfaces';
import { AppContext } from '../AppContext';
import { SceneComponent } from '@mp/common';
import { Observable } from '@mp/core/src/observable/Observable';
import { Dict, ISubscription } from '@mp/core';
import { StringEditor } from './editors/StringEditor';
import { NumberEditor } from './editors/NumberEditor';
import { WithStyles, withStyles, Typography, Divider } from '@material-ui/core';
import { ObjectEditor } from './editors/ObjectEditor ';
import { BooleanEditor } from './editors/BooleanEditor';
import { JsxBuffer } from '../utils';

const styles = () => ({
  container: {
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: '#BBBBBB',
    padding: '5px',
    marginBottom: '5px',
    borderRadius: '5px',
  },
  label: {
    fontSize: '11pt',
    fontWeight: 'bold' as 'bold',
  },
  section: {
    marginTop: '10px',
    fontSize: '9pt',
    fontWeight: 'bold' as 'bold',
  },
});

interface Props extends WithStyles<typeof styles> {
  component: SceneComponent;
}

interface State {
  forceRender: boolean;
}

export class ComponentViewImpl extends Component<Props, State> {
  context: IContext;
  static contextType = AppContext;
  private sub: ISubscription | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      forceRender: false,
    };
    this.onInputsChanged = this.onInputsChanged.bind(this);
  }

  private onInputsChanged() {
    this.setState({
      forceRender: !this.state.forceRender,
    });
  }

  componentDidMount() {
    const inputs = this.props.component.inputs as Observable<Dict<any>>;
    if (inputs) {
      this.sub = inputs.onChanged(this.onInputsChanged);
    }
  }

  componentWillUnmount() {
    if (this.sub) {
      this.sub.cancel();
      this.sub = null;
    }
  }

  onPropertyChanged(property: string, value: any) {
    this.props.component.inputs[property] = value;
  }

  onChildPropertyChanged(property: string, childPropertyName: string, value: any) {
    this.props.component.inputs[property][childPropertyName] = value;
  }

  render() {
    const properties = new JsxBuffer('props');

    const outputSection = (name: string, section: Dict<any>, readonly: boolean) => {
      properties.push(<Typography className={this.props.classes.section}>{name}</Typography>);
      properties.push(<Divider></Divider>);

      for (const property in section) {
        const value = section[property];
        if (typeof value === 'string') {
          properties.push(
            <StringEditor
              label={property}
              value={value}
              readonly={readonly}
              onChanged={(newValue) => this.onPropertyChanged(property, newValue)}
            ></StringEditor>
          );
        } else if (typeof value === 'number') {
          properties.push(
            <NumberEditor
              label={property}
              value={value}
              readonly={readonly}
              onChanged={(newValue) => this.onPropertyChanged(property, newValue)}
            ></NumberEditor>
          );
        } else if (typeof value === 'object') {
          properties.push(
            <ObjectEditor
              object={value}
              label={property}
              indent={0}
              readonly={readonly}
              onChanged={(childPropertyName, newValue) =>
                this.onChildPropertyChanged(property, childPropertyName, newValue)
              }
            ></ObjectEditor>
          );
        } else if (typeof value === 'boolean') {
          properties.push(
            <BooleanEditor
              value={value}
              label={property}
              readonly={readonly}
              onChanged={(newValue) => this.onPropertyChanged(property, newValue)}
            ></BooleanEditor>
          );
        }
      }
    };

    // only display events that are enabled and make events readonly
    const outputEvents = (section: Dict<any>) => {
      properties.push(<Typography className={this.props.classes.section}>Events</Typography>);
      properties.push(<Divider></Divider>);
      for (const property in section) {
        const value = section[property];
        if (typeof value === 'boolean' && value === true) {
          properties.push(
            <BooleanEditor
              value={value}
              label={property}
              readonly={true}
              onChanged={(newValue) => this.onPropertyChanged(property, newValue)}
            ></BooleanEditor>
          );
        }
      }
    };

    properties.push(<Typography className={this.props.classes.label}>{this.props.component.componentType}</Typography>);
    outputSection('Inputs', this.props.component.inputs, false);
    outputSection('Outputs', this.props.component.outputs, true);
    outputEvents(this.props.component.events);

    return <div className={this.props.classes.container}>{properties.elements}</div>;
  }
}

export const ComponentView = withStyles(styles, { withTheme: true })(ComponentViewImpl);
