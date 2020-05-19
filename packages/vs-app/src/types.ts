import { Vector3 } from 'three';

export enum Category {
  Sofa = 'Sofa',
  EndTable = 'End Table',
  ArmChair = 'Arm Chair',
  CoffeTable = 'Coffee Table',
}

export type ItemDesc = {
  name: string;
  url: string;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
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
