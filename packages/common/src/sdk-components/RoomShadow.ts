import type { MpSdk } from '../../../bundle/sdk';

export const roomShadowType = 'mp.roomShadow';
export const makeRoomShadow: MpSdk.Scene.IComponentFactory = () => {
  return {
    onInit() {
      const THREE = this.context.three;
      const node = new THREE.Object3D();

      this.outputs.objectRoot = node;

      // hard-coded
      const n: any = this.outputs.objectRoot.parent.parent.getObjectByName('mesh_group_1');
      const geo = n.geometry.clone();
      const planeMaterial = new THREE.ShadowMaterial();
      planeMaterial.opacity = 0.4;
      const plane = new THREE.Mesh(geo, planeMaterial);
      plane.receiveShadow = true;
      plane.translateY(0.05);
      node.add(plane);
    },
  };
};
