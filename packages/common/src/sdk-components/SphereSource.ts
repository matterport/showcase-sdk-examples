import { ComponentOutput, SceneComponent } from '../SceneComponent';

type Inputs = {
  sensor: any;
  radius: number;
}

type Outputs = {
  source: any;
} & ComponentOutput;

class SphereSource extends SceneComponent {
  constructor(private sdk: any) {
    super();
  }

  inputs: Inputs = {
    sensor: null,
    radius: 0.5,
  }

  outputs = {
    source: null,
  } as Outputs;

  onInit() {
    if (this.inputs.sensor === null) {
      console.warn('SphereSource needs a sensor to operate.')
      return;
    }
    
    this.sdk.Sensor.createSource(this.sdk.Sensor.SourceType.SPHERE, {
      origin: {
        x: this.context.root.position.x,
        y: this.context.root.position.y,
        z: this.context.root.position.z
      },
      radius: this.inputs.radius,
      userData: { }
    }).then((source: any) => {
      this.outputs.source = source;
      this.inputs.sensor.addSource(source);
    });
  }

  onInputsUpdated(previousInputs: Inputs) {
    if( previousInputs.sensor !== this.inputs.sensor) {
      if (previousInputs.sensor) {
        // todo: when supported, remove this source from previous sensor
        this.outputs.source = null;
      }

      if (this.inputs.sensor) {
        // create a new source since the sensor has changed.
        this.sdk.Sensor.createSource(this.sdk.Sensor.SourceType.SPHERE, {
          origin: {
            x: this.context.root.position.x,
            y: this.context.root.position.y,
            z: this.context.root.position.z
          },
          radius: this.inputs.radius,
          userData: { },
        }).then((source: any) => {
          this.outputs.source = source;
          this.inputs.sensor.addSource(source);
        });
      }
    }

    if (this.outputs.source) {
      this.outputs.source.volume.radius = this.inputs.radius;
      this.outputs.source.commit();
    }
  }

  onTick() {
    if (this.outputs.source) {
      const deltaX = Math.abs(this.outputs.source.volume.origin.x - this.context.root.position.x);
      const deltaY = Math.abs(this.outputs.source.volume.origin.y - this.context.root.position.y);
      const deltaZ = Math.abs(this.outputs.source.volume.origin.z - this.context.root.position.z);
      
      this.outputs.source.volume.origin.x = this.context.root.position.x;
      this.outputs.source.volume.origin.y = this.context.root.position.y;
      this.outputs.source.volume.origin.z = this.context.root.position.z;

      if (deltaX > 0.001 || deltaY > 0.001 || deltaZ > 0.001) {
        this.outputs.source.commit();
      }
    }
  }
}

export const sphereSourceType = 'mp.sphereSource';
export const makeSphereSource = function(sdk: any) {
  return () => {
    return new SphereSource(sdk);
  };
}
