import React, { Component } from 'react';
import { IAppContext } from '../interfaces';
import { AppContext } from '../AppContext';
import type { MpSdk } from '../../../bundle/sdk';
import { StringEditor } from './editors/StringEditor';
import { NumberEditor } from './editors/NumberEditor';
import { Typography, Divider } from '@mui/material';
import { ObjectEditor } from './editors/ObjectEditor';
import { BooleanEditor } from './editors/BooleanEditor';
import { JsxBuffer } from '../utils';
import styled from '@emotion/styled';

const styles = {
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
    fontWeight: 'bold',
  },
  section: {
    marginTop: '10px',
    fontSize: '9pt',
    fontWeight: 'bold',
  },
} as const;
const ContainerDiv = styled.div(styles.container);
interface Props {
  component: MpSdk.Scene.IComponent;
}
interface State {
  forceRender: boolean;
}

export class ComponentView extends Component<Props, State> {
  context: IAppContext;
  static contextType = AppContext;
  private subs: MpSdk.ISubscription[] = [];

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
    // Spy on each declared input via the IObject path API — the supported
    // way to observe input changes without relying on any runtime-wrapped
    // Observable type that the SDK doesn't expose.
    const { component } = this.props;
    const { sceneObject } = this.context.scene;
    for (const key of Object.keys(component.inputs)) {
      const path = sceneObject.addInputPath(component, key);
      this.subs.push(sceneObject.spyOnEvent({
        path,
        onEvent: this.onInputsChanged,
      }));
    }
  }

  componentWillUnmount() {
    for (const sub of this.subs) {
      sub.cancel();
    }
    this.subs = [];
  }

  onPropertyChanged(property: string, value: any) {
    this.props.component.inputs[property] = value;
  }

  onChildPropertyChanged(property: string, childPropertyName: string, value: any) {
    const parent = this.props.component.inputs[property] as Record<string, unknown>;
    parent[childPropertyName] = value;
  }

  render() {
    const properties = new JsxBuffer('props');

    const outputSection = (name: string, section: Record<string, any>, readonly: boolean) => {
      properties.push(<Typography sx={styles.label}>{name}</Typography>);
      properties.push(<Divider></Divider>);

      for (const property in section) {
        const value = section[property];
        if (typeof value === 'string') {
          properties.push(
            <StringEditor
              label={property}
              value={value}
              readonly={readonly}
              onChanged={(newValue: string) => this.onPropertyChanged(property, newValue)}
            ></StringEditor>
          );
        } else if (typeof value === 'number') {
          properties.push(
            <NumberEditor
              label={property}
              value={value}
              readonly={readonly}
              onChanged={(newValue: number) => this.onPropertyChanged(property, newValue)}
            ></NumberEditor>
          );
        } else if (typeof value === 'object') {
          properties.push(
            <ObjectEditor
              object={value}
              label={property}
              indent={0}
              readonly={readonly}
              onChanged={(childPropertyName: string, newValue: Object) =>
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
              onChanged={(newValue: boolean) => this.onPropertyChanged(property, newValue)}
            ></BooleanEditor>
          );
        }
      }
    };

    // only display events that are enabled and make events readonly
    const outputEvents = (section: Record<string, any>) => {
      properties.push(<Typography sx={styles.section}>Events</Typography>);
      properties.push(<Divider></Divider>);
      for (const property in section) {
        const value = section[property];
        if (typeof value === 'boolean' && value === true) {
          properties.push(
            <BooleanEditor
              value={value}
              label={property}
              readonly={true}
              onChanged={(newValue: boolean) => this.onPropertyChanged(property, newValue)}
            ></BooleanEditor>
          );
        }
      }
    };

    properties.push(<Typography sx={styles.label}>{this.props.component.componentType}</Typography>);
    outputSection('Inputs', this.props.component.inputs, false);
    outputSection('Outputs', this.props.component.outputs, true);
    outputEvents(this.props.component.events);

    return <ContainerDiv>{properties.elements}</ContainerDiv>;
  }
}
