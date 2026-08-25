import type { MpSdk } from '../../../bundle/sdk';

type Inputs = {
  sensor: MpSdk.Sensor.ISensor | null;
  radius: number;
};

type Outputs = {
  source: MpSdk.Sensor.ISource<MpSdk.Sensor.SphereVolume> | null;
};

export const sphereSourceType = 'mp.sphereSource';
export const makeSphereSource = (sdk: MpSdk): MpSdk.Scene.IComponentFactory<Inputs, Outputs> => () => {
  return {
    inputs: {
      sensor: null,
      radius: 0.5,
    },
    outputs: {
      source: null,
    },

    onInit() {
      if (this.inputs.sensor === null) {
        console.warn('SphereSource needs a sensor to operate.');
        return;
      }

      // @deprecated context.root not in sdk.d.ts
      const root: MpSdk.Scene.INode = (this.context as any).root;
      sdk.Sensor.createSource(sdk.Sensor.SourceType.SPHERE, {
        origin: { x: root.position.x, y: root.position.y, z: root.position.z },
        radius: this.inputs.radius,
        userData: {},
      }).then((source) => {
        this.outputs.source = source;
        this.inputs.sensor.addSource(source);
      });
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
          sdk.Sensor.createSource(sdk.Sensor.SourceType.SPHERE, {
            origin: { x: root.position.x, y: root.position.y, z: root.position.z },
            radius: this.inputs.radius,
            userData: {},
          }).then((source) => {
            this.outputs.source = source;
            this.inputs.sensor.addSource(source);
          });
        }
      }

      if (this.outputs.source) {
        this.outputs.source.volume.radius = this.inputs.radius;
        this.outputs.source.commit();
      }
    },

    onTick() {
      if (this.outputs.source) {
        // @deprecated context.root not in sdk.d.ts
        const root: MpSdk.Scene.INode = (this.context as any).root;
        const { origin } = this.outputs.source.volume;
        const deltaX = Math.abs(origin.x - root.position.x);
        const deltaY = Math.abs(origin.y - root.position.y);
        const deltaZ = Math.abs(origin.z - root.position.z);

        origin.x = root.position.x;
        origin.y = root.position.y;
        origin.z = root.position.z;

        if (deltaX > 0.001 || deltaY > 0.001 || deltaZ > 0.001) {
          this.outputs.source.commit();
        }
      }
    },
  };
};
