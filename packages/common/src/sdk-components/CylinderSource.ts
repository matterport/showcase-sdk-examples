import type { MpSdk } from '../../../bundle/sdk';

const defaultInputs: Inputs = {
  sensor: null,
  height: 1,
  radius: 1,
};

type Inputs = {
  sensor: MpSdk.Sensor.ISensor | null;
  height: number;
  radius: number;
};

type Outputs = {
  source: MpSdk.Sensor.ISource<MpSdk.Sensor.CylinderVolume> | null;
};

export const cylinderSourceType = 'mp.cylinderSource';
export const makeCylinderSource = (sdk: MpSdk): MpSdk.Scene.IComponentFactory<Inputs, Outputs> => () => {
  return {
    inputs: {
      ...defaultInputs,
    },
    outputs: {
      source: null,
    },

    onInit() {
      this.onInputsUpdated(defaultInputs);
    },

    onInputsUpdated(previousInputs) {
      // @deprecated context.root not in sdk.d.ts
      const root: MpSdk.Scene.INode = (this.context as any).root;

      if (previousInputs.sensor !== this.inputs.sensor) {
        if (previousInputs.sensor) {
          // todo: when supported, remove this source from previous sensor
          this.outputs.source = null;
        }

        if (this.inputs.sensor) {
          // create a new source since the sensor has changed.
          sdk.Sensor.createSource(sdk.Sensor.SourceType.CYLINDER, {
            basePoint: { x: root.position.x, y: root.position.y, z: root.position.z },
            height: this.inputs.height,
            radius: this.inputs.radius,
            userData: {},
          }).then((source) => {
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
    },

    onTick() {
      if (this.outputs.source) {
        // @deprecated context.root not in sdk.d.ts
        const root: MpSdk.Scene.INode = (this.context as any).root;
        const { basePoint } = this.outputs.source.volume;
        const deltaX = Math.abs(basePoint.x - root.position.x);
        const deltaY = Math.abs(basePoint.y - root.position.y);
        const deltaZ = Math.abs(basePoint.z - root.position.z);

        basePoint.x = root.position.x;
        basePoint.y = root.position.y;
        basePoint.z = root.position.z;

        if (deltaX > 0.001 || deltaY > 0.001 || deltaZ > 0.001) {
          this.outputs.source.commit();
        }
      }
    },
  };
};
