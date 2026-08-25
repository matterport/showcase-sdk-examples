import { ItemDesc, Category } from './types';
import { cdnUrl } from '@mp/common';

export class AppState {
  sid: string = '';
  items: Map<Category, ItemDesc[]> = new Map();
  slots: Map<string, Category> = new Map();
}

export const slots: Map<string, Category> = new Map();
slots.set('slot_1', Category.Sofa);
slots.set('slot_2', Category.EndTable);
slots.set('slot_3', Category.ArmChair);
slots.set('slot_4', Category.CoffeTable);

const sofaItems: ItemDesc[] = [
  {
    name: 'sofa 11',
    url: cdnUrl + '/models/sofa/11/scene.gltf',
    categories: [Category.Sofa],
    position: { x: 0, y: -0.5, z: 0 },
    rotation: { x: 0, y: 90, z: 0 },
    scale: { x: 0.009, y: 0.009, z: 0.009 },
  },
  {
    name: 'sofa 7',
    url: cdnUrl + '/models/sofa/7/scene.gltf',
    categories: [Category.Sofa],
    position: { x: 5.2, y: -0.5, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  },
  {
    name: 'sofa 9',
    url: cdnUrl + '/models/sofa/9/scene.gltf',
    categories: [Category.Sofa],
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 90, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  },
];

const endTableItems: ItemDesc[] = [
  {
    name: 'end table 2',
    url: cdnUrl + '/models/end-table/2/scene.gltf',
    categories: [Category.EndTable],
    position: { x: 0, y: -0.32, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 0.01, y: 0.01, z: 0.01 },
  },
  {
    name: 'Aula',
    url: cdnUrl + '/models/end-table/3/scene.gltf',
    categories: [Category.EndTable],
    position: { x: 0, y: -0.32, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 0.01, y: 0.01, z: 0.01 },
  },
  {
    name: 'Arwin',
    url: cdnUrl + '/models/end-table/4/scene.gltf',
    categories: [Category.EndTable],
    position: { x: 0, y: -0.32, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 0.01, y: 0.01, z: 0.01 },
  },
  {
    name: 'Edelweiss',
    url: cdnUrl + '/models/end-table/5/scene.gltf',
    categories: [Category.EndTable],
    position: { x: 0, y: -0.32, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 0.01, y: 0.01, z: 0.01 },
  },
  {
    name: 'Aula 2',
    url: cdnUrl + '/models/end-table/6/scene.gltf',
    categories: [Category.EndTable],
    position: { x: 0, y: -0.32, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 0.01, y: 0.01, z: 0.01 },
  },
  {
    name: 'Contrast Chess',
    url: cdnUrl + '/models/end-table/7/scene.gltf',
    categories: [Category.EndTable],
    position: { x: 0, y: -0.32, z: 0 },
    rotation: { x: 0, y: 90, z: 0 },
    scale: { x: 0.01, y: 0.01, z: 0.01 },
  },
  {
    name: 'Global',
    url: cdnUrl + '/models/end-table/8/scene.gltf',
    categories: [Category.EndTable],
    position: { x: -0.32, y: -0.32, z: -0.5 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 0.001, y: 0.001, z: 0.001 },
  },
  {
    name: 'Aula 3',
    url: cdnUrl + '/models/end-table/9/scene.gltf',
    categories: [Category.EndTable],
    position: { x: 0, y: -0.32, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 0.01, y: 0.01, z: 0.01 },
  },
];

const armChairItems: ItemDesc[] = [
  {
    name: 'arm chair 2',
    url: cdnUrl + '/models/arm-chair/2/scene.gltf',
    categories: [Category.EndTable],
    position: { x: -0.27, y: -0.51, z: -0.35 },
    rotation: { x: 0, y: -130, z: 0 },
    scale: { x: 0.001, y: 0.001, z: 0.001 },
  },
  {
    name: 'arm chair 4',
    url: cdnUrl + '/models/arm-chair/4/scene.gltf',
    categories: [Category.EndTable],
    position: { x: 0, y: -0.51, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 0.008, y: 0.008, z: 0.008 },
  },
  {
    name: 'arm chair 5',
    url: cdnUrl + '/models/arm-chair/5/scene.gltf',
    categories: [Category.EndTable],
    position: { x: 0, y: -0.51, z: 0 },
    rotation: { x: 0, y: -90, z: 0 },
    scale: { x: 0.0019, y: 0.0019, z: 0.0019 },
  },
  {
    name: 'arm chair 6',
    url: cdnUrl + '/models/arm-chair/6/scene.gltf',
    categories: [Category.EndTable],
    position: { x: 0, y: -0.51, z: 0 },
    rotation: { x: 0, y: -90, z: 0 },
    scale: { x: 1.3, y: 1.3, z: 1.3 },
  },
  {
    name: 'arm chair 8',
    url: cdnUrl + '/models/arm-chair/8/scene.gltf',
    categories: [Category.EndTable],
    position: { x: 0, y: -0.51, z: 0 },
    rotation: { x: 0, y: 90, z: 0 },
    scale: { x: 0.011, y: 0.011, z: 0.011 },
  },
];

const coffeeTableItems: ItemDesc[] = [
  {
    name: 'coffee table 1',
    url: cdnUrl + '/models/coffee-table/2/scene.gltf',
    categories: [Category.CoffeTable],
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 0.6, y: 0.6, z: 0.6 },
  },
  {
    name: 'coffee table 2',
    url: cdnUrl + '/models/coffee-table/3/scene.gltf',
    categories: [Category.CoffeTable],
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 0.4, y: 0.4, z: 0.4 },
  },
  {
    name: 'coffee table 3',
    url: cdnUrl + '/models/coffee-table/6/scene.gltf',
    categories: [Category.CoffeTable],
    position: { x: -0.15, y: -0.2, z: 0.4 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 0.01, y: 0.01, z: 0.01 },
  },
  {
    name: 'coffee table 7',
    url: cdnUrl + '/models/coffee-table/10/scene.gltf',
    categories: [Category.CoffeTable],
    position: { x: 1.3, y: -0.255, z: 0.2 },
    rotation: { x: 0, y: 90, z: 0 },
    scale: { x: 0.2, y: 0.2, z: 0.2 },
  },
];

export const items: Map<Category, ItemDesc[]> = new Map();
items.set(Category.Sofa, sofaItems);
items.set(Category.EndTable, endTableItems);
items.set(Category.ArmChair, armChairItems);
items.set(Category.CoffeTable, coffeeTableItems);
