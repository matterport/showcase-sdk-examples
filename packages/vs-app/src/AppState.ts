import { ItemDesc, Category } from "./types";
import { Vector3} from "three";
import { cdnUrl } from "@mp/common";

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
    categories: [ Category.Sofa ],
    position: new Vector3(0, -0.5, 0),
    rotation: new Vector3(0, 90, 0),
    scale: new Vector3(0.009, 0.009, 0.009),
  },
  {
    name: 'sofa 7',
    url: cdnUrl + '/models/sofa/7/scene.gltf',
    categories: [ Category.Sofa ],
    position: new Vector3(5.2, -0.5, 0),
    rotation: new Vector3(0, 0, 0),
    scale: new Vector3(1, 1, 1),
  },
  {
    name: 'sofa 9',
    url: cdnUrl + '/models/sofa/9/scene.gltf',
    categories: [ Category.Sofa ],
    position: new Vector3(0, 0, 0),
    rotation: new Vector3(0, 90, 0),
    scale: new Vector3(1, 1, 1),
  },
];

const endTableItems: ItemDesc[] = [
  {
    name: 'end table 2',
    url: cdnUrl + '/models/end-table/2/scene.gltf',
    categories: [ Category.EndTable ],
    position: new Vector3(0, -0.32, 0),
    rotation: new Vector3(0, 0, 0),
    scale: new Vector3(0.01, 0.01, 0.01),
  },
  {
    name: 'Aula',
    url: cdnUrl + '/models/end-table/3/scene.gltf',
    categories: [ Category.EndTable ],
    position: new Vector3(0, -0.32, 0),
    rotation: new Vector3(0, 0, 0),
    scale: new Vector3(0.01, 0.01, 0.01),
  },
  {
    name: 'Arwin',
    url: cdnUrl + '/models/end-table/4/scene.gltf',
    categories: [ Category.EndTable ],
    position: new Vector3(0, -0.32, 0),
    rotation: new Vector3(0, 0, 0),
    scale: new Vector3(0.01, 0.01, 0.01),
  },
  {
    name: 'Edelweiss',
    url: cdnUrl + '/models/end-table/5/scene.gltf',
    categories: [ Category.EndTable ],
    position: new Vector3(0, -0.32, 0),
    rotation: new Vector3(0, 0, 0),
    scale: new Vector3(0.01, 0.01, 0.01),
  },
  {
    name: 'Aula 2',
    url: cdnUrl + '/models/end-table/6/scene.gltf',
    categories: [ Category.EndTable ],
    position: new Vector3(0, -0.32, 0),
    rotation: new Vector3(0, 0, 0),
    scale: new Vector3(0.01, 0.01, 0.01),
  },
  {
    name: 'Contrast Chess',
    url: cdnUrl + '/models/end-table/7/scene.gltf',
    categories: [ Category.EndTable ],
    position: new Vector3(0, -0.32, 0),
    rotation: new Vector3(0, 90, 0),
    scale: new Vector3(0.01, 0.01, 0.01),
  },
  {
    name: 'Global',
    url: cdnUrl + '/models/end-table/8/scene.gltf',
    categories: [ Category.EndTable ],
    position: new Vector3(-0.32, -0.32, -0.5),
    rotation: new Vector3(0, 0, 0),
    scale: new Vector3(0.001, 0.001, 0.001),
  },
  {
    name: 'Aula 3',
    url: cdnUrl + '/models/end-table/9/scene.gltf',
    categories: [ Category.EndTable ],
    position: new Vector3(0, -0.32, 0),
    rotation: new Vector3(0, 0, 0),
    scale: new Vector3(0.01, 0.01, 0.01),
  },
];

const armChairItems: ItemDesc[] = [
  {
    name: 'arm chair 2',
    url: cdnUrl + '/models/arm-chair/2/scene.gltf',
    categories: [ Category.EndTable ],
    position: new Vector3(-0.27, -0.51, -0.35),
    rotation: new Vector3(0, -130, 0),
    scale: new Vector3(0.001, 0.001, 0.001),
  },
  {
    name: 'arm chair 4',
    url: cdnUrl + '/models/arm-chair/4/scene.gltf',
    categories: [ Category.EndTable ],
    position: new Vector3(0, -0.51, 0),
    rotation: new Vector3(0, 0, 0),
    scale: new Vector3(0.008, 0.008, 0.008),
  },
  {
    name: 'arm chair 5',
    url: cdnUrl + '/models/arm-chair/5/scene.gltf',
    categories: [ Category.EndTable ],
    position: new Vector3(0, -0.51, 0),
    rotation: new Vector3(0, -90, 0),
    scale: new Vector3(0.0019, 0.0019, 0.0019),
  },
  {
    name: 'arm chair 6',
    url: cdnUrl + '/models/arm-chair/6/scene.gltf',
    categories: [ Category.EndTable ],
    position: new Vector3(0, -0.51, 0),
    rotation: new Vector3(0, -90, 0),
    scale: new Vector3(1.3, 1.3, 1.3),
  },
  {
    name: 'arm chair 7',
    url: cdnUrl + '/models/arm-chair/7/scene.gltf',
    categories: [ Category.EndTable ],
    position: new Vector3(0, -0.51, 0),
    rotation: new Vector3(0, -90, 0),
    scale: new Vector3(0.01, 0.01, 0.01),
  },
  {
    name: 'arm chair 8',
    url: cdnUrl + '/models/arm-chair/8/scene.gltf',
    categories: [ Category.EndTable ],
    position: new Vector3(0, -0.51, 0),
    rotation: new Vector3(0, 90, 0),
    scale: new Vector3(0.011, 0.011, 0.011),
  },
];

const coffeeTableItems: ItemDesc[] = [
  {
    name: 'coffee table 1',
    url: cdnUrl + '/models/coffee-table/2/scene.gltf',
    categories: [ Category.CoffeTable ],
    position: new Vector3(0, 0, 0),
    rotation: new Vector3(0, 0, 0),
    scale: new Vector3(0.6, 0.6, 0.6),
  },
  {
    name: 'coffee table 2',
    url: cdnUrl + '/models/coffee-table/3/scene.gltf',
    categories: [ Category.CoffeTable ],
    position: new Vector3(0, 0, 0),
    rotation: new Vector3(0, 0, 0),
    scale: new Vector3(0.4, 0.4, 0.4),
  },
  {
    name: 'coffee table 3',
    url: cdnUrl + '/models/coffee-table/6/scene.gltf',
    categories: [ Category.CoffeTable ],
    position: new Vector3(-0.15, -0.2, 0.4),
    rotation: new Vector3(0, 0, 0),
    scale: new Vector3(0.01, 0.01, 0.01),
  },
  {
    name: 'coffee table 4',
    url: cdnUrl + '/models/coffee-table/7/scene.gltf',
    categories: [ Category.CoffeTable ],
    position: new Vector3(0, -0.26, 0),
    rotation: new Vector3(0, 0, 0),
    scale: new Vector3(0.01, 0.01, 0.01),
  },
  {
    name: 'coffee table 5',
    url: cdnUrl + '/models/coffee-table/8/scene.gltf',
    categories: [ Category.CoffeTable ],
    position: new Vector3(0, -0.26, 0),
    rotation: new Vector3(0, 0, 0),
    scale: new Vector3(0.01, 0.01, 0.01),
  },
  {
    name: 'coffee table 6',
    url: cdnUrl + '/models/coffee-table/9/scene.gltf',
    categories: [ Category.CoffeTable ],
    position: new Vector3(0, -0.255, 0),
    rotation: new Vector3(0, 0, 0),
    scale: new Vector3(0.01, 0.01, 0.01),
  },
  {
    name: 'coffee table 7',
    url: cdnUrl + '/models/coffee-table/10/scene.gltf',
    categories: [ Category.CoffeTable ],
    position: new Vector3(1.3, -0.255, 0.2),
    rotation: new Vector3(0, 90, 0),
    scale: new Vector3(0.2, 0.2, 0.2),
  },
];

export const items: Map<Category, ItemDesc[]> = new Map();
items.set(Category.Sofa, sofaItems);
items.set(Category.EndTable, endTableItems);
items.set(Category.ArmChair, armChairItems);
items.set(Category.CoffeTable, coffeeTableItems);
