import type { MpSdk } from '../../bundle/sdk';

export enum Category {
  Sofa = 'Sofa',
  EndTable = 'End Table',
  ArmChair = 'Arm Chair',
  CoffeTable = 'Coffee Table',
}

export type ItemDesc = {
  name: string;
  url: string;
  position: MpSdk.Vector3;
  rotation: MpSdk.Vector3;
  scale: MpSdk.Vector3;
  categories: Category[];
};

export type SlotDesc = {
  name: string;
  category: Category;
};

export type Instance<T> = {
  desc: T;
  sceneObject: any;
};
