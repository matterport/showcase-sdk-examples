import { ComponentOutput, SceneComponent } from '../SceneComponent';

const defaultInputs: Inputs = {
  sensor: null,
    height: 1,
    radius: 1,
}

type Inputs = {
  sensor: any;
  height: number;
  radius: number;
}

type Outputs = {
  source: any;
} & ComponentOutput;

class CylinderSource extends SceneComponent {
  constructor(private sdk: any) {
    super();
  }

  inputs: Inputs = {
    ...defaultInputs,
  }

  outputs = {
    source: null,
  } as Outputs;

  onInit() {
    this.onInputsUpdated(defaultInputs);
  }

  onInputsUpdated(previousInputs: Inputs) {
    if( previousInputs.sensor !== this.inputs.sensor) {
      if (previousInputs.sensor) {
        // todo: when supported, remove this source from previous sensor
        this.outputs.source = null;
      }

      if (this.inputs.sensor) {
        // create a new source since the sensor has changed.
        this.sdk.Sensor.createSource(this.sdk.Sensor.SourceType.CYLINDER, {
          basePoint: {
            x: this.context.root.position.x,
            y: this.context.root.position.y,
            z: this.context.root.position.z
          },
          height: this.inputs.height,
          radius: this.inputs.radius,
          userData: { }
        }).then((source: any) => {
          this.outputs.source = source;
          this.inputs.sensor.addSource(source);
        });
      }
    }

    if (this.outputs.source) {
      this.outputs.source.volume.height = this.inputs.height;
      this.outputs.source.volume.radius = this.inputs.radius;
      this.outputs.source.commit();
    }
  }

  onTick() {
    if (this.outputs.source) {
      const deltaX = Math.abs(this.outputs.source.volume.basePoint.x - this.context.root.position.x);
      const deltaY = Math.abs(this.outputs.source.volume.basePoint.y - this.context.root.position.y);
      const deltaZ = Math.abs(this.outputs.source.volume.basePoint.z - this.context.root.position.z);
      
      this.outputs.source.volume.basePoint.x = this.context.root.position.x;
      this.outputs.source.volume.basePoint.y = this.context.root.position.y;
      this.outputs.source.volume.basePoint.z = this.context.root.position.z;

      if (deltaX > 0.001 || deltaY > 0.001 || deltaZ > 0.001) {
        this.outputs.source.commit();
      }
    }
  }
}

export const cylinderSourceType = 'mp.cylinderSource';
export const makeCylinderSource = function(sdk: any) {
  return () => {
    return new CylinderSource(sdk);
  };
}
