import { Euler } from 'three';
import { ComponentOutput, SceneComponent } from '../SceneComponent';

const defaultInputs: Inputs = {
  sensor: null,
}

type Inputs = {
  sensor: any;
}

type Outputs = {
  source: any;
} & ComponentOutput;

class BoxSource extends SceneComponent {
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
        const euler = new Euler().setFromQuaternion(this.context.root.quaternion, 'YXZ');
        const eulerX = euler.x * 180 / Math.PI;
        const eulerY = euler.y * 180 / Math.PI;
        const eulerZ = euler.z * 180 / Math.PI;
        this.sdk.Sensor.createSource(this.sdk.Sensor.SourceType.BOX, {
          center: {
            x: this.context.root.position.x,
            y: this.context.root.position.y,
            z: this.context.root.position.z
          },
          size: {
            x: this.context.root.scale.x,
            y: this.context.root.scale.y,
            z: this.context.root.scale.z,
          },
          orientation: {
            pitch: eulerX,
            yaw: eulerY,
            roll: eulerZ,
          },
          userData: { },
        }).then((source: any) => {
          this.outputs.source = source;
          this.inputs.sensor.addSource(source);
        });
      }
    }
  }

  onTick() {
    if (this.outputs.source) {
      const deltaX = Math.abs(this.outputs.source.volume.center.x - this.context.root.position.x);
      const deltaY = Math.abs(this.outputs.source.volume.center.y - this.context.root.position.y);
      const deltaZ = Math.abs(this.outputs.source.volume.center.z - this.context.root.position.z);
      
      this.outputs.source.volume.center.x = this.context.root.position.x;
      this.outputs.source.volume.center.y = this.context.root.position.y;
      this.outputs.source.volume.center.z = this.context.root.position.z;

      const euler = new Euler().setFromQuaternion(this.context.root.quaternion, 'YXZ');
      const sourceEuler = this.outputs.source.volume.orientation as { pitch: number, roll: number, yaw: number };

      const eulerX = euler.x * 180 / Math.PI;
      const eulerY = euler.y * 180 / Math.PI;
      const eulerZ = euler.z * 180 / Math.PI;

      const pitchDelta = Math.abs(sourceEuler.pitch - eulerX);
      const yawDelta = Math.abs(sourceEuler.yaw - eulerY);
      const rollDelta = Math.abs(sourceEuler.roll - eulerZ);

      sourceEuler.pitch = eulerX;
      sourceEuler.yaw = eulerY;
      sourceEuler.roll = eulerZ;

      const scaleXDelta = Math.abs(this.context.root.scale.x - this.outputs.source.volume.size.x);
      const scaleYDelta = Math.abs(this.context.root.scale.y - this.outputs.source.volume.size.y);
      const scaleZDelta = Math.abs(this.context.root.scale.z - this.outputs.source.volume.size.z);

      this.outputs.source.volume.size.x = this.context.root.scale.x;
      this.outputs.source.volume.size.y = this.context.root.scale.y;
      this.outputs.source.volume.size.z = this.context.root.scale.z;

      if (deltaX > 0.001 || deltaY > 0.001 || deltaZ > 0.001 ||
         yawDelta > 0.01 || pitchDelta > 0.01 || rollDelta > 0.01 ||
         scaleXDelta > 0.01 || scaleYDelta > 0.01 || scaleZDelta > 0.01) {
        this.outputs.source.commit();
      }
    }
  }
}

export const boxSourceType = 'mp.boxSource';
export const makeBoxSource = function(sdk: any) {
  return () => {
    return new BoxSource(sdk);
  };
}
