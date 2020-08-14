import React, { Component } from 'react';
import { IContext, CameraPose } from 'src/interfaces';
import { AppContext } from '../AppContext';

interface State {
  pose: CameraPose;
}

export class CameraView extends Component<{}, State> {
  context: IContext;
  static contextType = AppContext;

  constructor(props: {}) {
    super(props);

    this.state = {
      pose: {
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
        rotation: {
          x: 0,
          y: 0,
        },
        projection: [],
      }
    }
  }

  componentDidMount() {
    let dirty = true;
    this.context.scene.cameraPose.subscribe({
      next: (value: CameraPose) => {
        dirty = true;
      }
    });

    setInterval(() => {
      if (dirty) {
        this.setState({
          pose: this.context.scene.cameraPose.value,
        });
        dirty = false;
      }
    }, 200);
  }

  render() {
    const { position, rotation } = this.context.scene.cameraPose.value;

    return (
      <div>
        <div>Camera Properties</div>
        <table>
          <tbody>
            <tr>
              <td>Position</td>
              <td>{position.x.toFixed(2)}</td>
              <td>{position.y.toFixed(2)}</td>
              <td>{position.z.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Rotation</td>
              <td>{rotation.x.toFixed(2)}</td>
              <td>{rotation.y.toFixed(2)}</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
