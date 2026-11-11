import type { MpSdk } from '../../../bundle/sdk';

const defaultInputs: Inputs = {
  sensor: null,
};

type Inputs = {
  sensor: MpSdk.Sensor.ISensor | null;
};

type Outputs = {
  source: MpSdk.Sensor.ISource<MpSdk.Sensor.BoxVolume> | null;
};

export const boxSourceType = 'mp.boxSource';
export const makeBoxSource = (sdk: MpSdk): MpSdk.Scene.IComponentFactory<Inputs, Outputs> => () => {
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
      const THREE = this.context.three;

      if (previousInputs.sensor !== this.inputs.sensor) {
        if (previousInputs.sensor) {
          // todo: when supported, remove this source from previous sensor
          this.outputs.source = null;
        }

        if (this.inputs.sensor) {
          // create a new source since the sensor has changed.
          const euler = new THREE.Euler().setFromQuaternion(root.quaternion, 'YXZ');
          const eulerX = euler.x * (180 / Math.PI);
          const eulerY = euler.y * (180 / Math.PI);
          const eulerZ = euler.z * (180 / Math.PI);
          sdk.Sensor.createSource(sdk.Sensor.SourceType.BOX, {
            center: { x: root.position.x, y: root.position.y, z: root.position.z },
            size: { x: root.scale.x, y: root.scale.y, z: root.scale.z },
            orientation: {
              pitch: eulerX,
              yaw: eulerY,
              roll: eulerZ,
            },
            userData: {},
          }).then((source) => {
            this.outputs.source = source;
            this.inputs.sensor.addSource(source);
          });
        }
      }
    },

    onTick() {
      const THREE = this.context.three;
      if (this.outputs.source) {
        // @deprecated context.root not in sdk.d.ts
        const root: MpSdk.Scene.INode = (this.context as any).root;
        const { center, size } = this.outputs.source.volume;
        const deltaX = Math.abs(center.x - root.position.x);
        const deltaY = Math.abs(center.y - root.position.y);
        const deltaZ = Math.abs(center.z - root.position.z);

        center.x = root.position.x;
        center.y = root.position.y;
        center.z = root.position.z;

        const euler = new THREE.Euler().setFromQuaternion(root.quaternion, 'YXZ');
        const sourceEuler = this.outputs.source.volume.orientation as { pitch: number; roll: number; yaw: number };

        const eulerX = (euler.x * 180) / Math.PI;
        const eulerY = (euler.y * 180) / Math.PI;
        const eulerZ = (euler.z * 180) / Math.PI;

        const pitchDelta = Math.abs(sourceEuler.pitch - eulerX);
        const yawDelta = Math.abs(sourceEuler.yaw - eulerY);
        const rollDelta = Math.abs(sourceEuler.roll - eulerZ);

        sourceEuler.pitch = eulerX;
        sourceEuler.yaw = eulerY;
        sourceEuler.roll = eulerZ;

        const scaleXDelta = Math.abs(root.scale.x - size.x);
        const scaleYDelta = Math.abs(root.scale.y - size.y);
        const scaleZDelta = Math.abs(root.scale.z - size.z);

        size.x = root.scale.x;
        size.y = root.scale.y;
        size.z = root.scale.z;

        if (
          deltaX > 0.001 ||
          deltaY > 0.001 ||
          deltaZ > 0.001 ||
          yawDelta > 0.01 ||
          pitchDelta > 0.01 ||
          rollDelta > 0.01 ||
          scaleXDelta > 0.01 ||
          scaleYDelta > 0.01 ||
          scaleZDelta > 0.01
        ) {
          this.outputs.source.commit();
        }
      }
    },
  };
};
