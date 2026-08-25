import type { MpSdk } from '../../../bundle/sdk';
import type { Mesh, MeshBasicMaterial, BufferGeometry, AnimationMixer, AnimationAction, Object3D } from 'three';

type Inputs = {
  loadingState: string;
  period: number;
  size: { x: number; y: number; z: number };
  transitionInDuration: number;
  color: number;
  logo: Object3D | null;
};

export const loadingIndicatorType = 'mp.loadingIndicator';
export const makeLoadingIndicator: MpSdk.Scene.IComponentFactory<Inputs> = () => {
  let mixer: AnimationMixer | null = null;
  let box: Mesh<BufferGeometry, MeshBasicMaterial> | null;

  return {
    inputs: {
      loadingState: 'Idle',
      period: 4,
      size: { x: 1, y: 1, z: 1 },
      transitionInDuration: 0.2,
      color: 0x00aa00,
      logo: null,
    },

    onInit() {
      // @deprecated context.root not in sdk.d.ts
      const root: MpSdk.Scene.INode = (this.context as any).root;
      const THREE = this.context.three;
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({
        color: this.inputs.color,
        transparent: true,
        opacity: 0.2,
      });
      box = new THREE.Mesh(geometry, material);

      for (const component of root.componentIterator()) {
        if (component.componentType === 'mp.gltfLoader') {
          this.bind('loadingState', component, 'loadingState');
        }
      }

      this.onInputsUpdated();
    },

    onDestroy() {
      box.geometry.dispose();
      box.material.dispose();

      mixer = null;
    },

    onInputsUpdated() {
      const THREE = this.context.three;

      if (!this.inputs.logo) {
        return;
      }

      // Must set a name to an object to use in a path
      this.inputs.logo.children[0].children[0].name = 'logo';
      // The OBJ is nested
      mixer = new THREE.AnimationMixer(this.inputs.logo.children[0].children[0]);

      switch (this.inputs.loadingState) {
        case 'Idle':
        case 'Loaded':
          this.inputs.logo.visible = false;
          break;
        case 'Loading':
          {
            this.inputs.logo.visible = true;

            const yAxis = new THREE.Vector3(0, 1, 0);
            const frame0 = new THREE.Quaternion().setFromAxisAngle(yAxis, 0);
            const frame1 = new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI);
            const frame2 = new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI * 2);
            const track = new THREE.QuaternionKeyframeTrack(
              '.quaternion',
              [0, this.inputs.period * 0.5, this.inputs.period],
              [
                frame0.x, frame0.y, frame0.z, frame0.w,
                frame1.x, frame1.y, frame1.z, frame1.w,
                frame2.x, frame2.y, frame2.z, frame2.w,
              ]
            );

            const clip = new THREE.AnimationClip(null, this.inputs.period, [track]);
            const action: AnimationAction = mixer.clipAction(clip, this.inputs.logo);
            action.play();

            const onEnterTime = this.inputs.transitionInDuration;
            const opacityTrack = new THREE.NumberKeyframeTrack(
              'logo.material.opacity',
              [0, onEnterTime],
              [0, 0.7],
              THREE.InterpolateSmooth
            );
            const scaleTrack = new THREE.VectorKeyframeTrack(
              '.scale',
              [0, onEnterTime],
              [0, 0, 0, this.inputs.size.x, this.inputs.size.y, this.inputs.size.z],
              THREE.InterpolateSmooth
            );
            const onEnterClip = new THREE.AnimationClip(null, onEnterTime, [opacityTrack, scaleTrack]);
            const onEnterAction: AnimationAction = mixer.clipAction(onEnterClip, this.inputs.logo);
            onEnterAction.loop = THREE.LoopOnce;
            onEnterAction.clampWhenFinished = true;
            onEnterAction.play();
          }
          break;
        case 'Error':
          console.warn(`Loading indicator transitioned to error state.`);
          break;
      }
    },

    onTick(delta) {
      if (mixer) {
        mixer.update(delta / 1000);
      }
    },
  };
};
