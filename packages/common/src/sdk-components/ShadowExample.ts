import { SceneComponent } from '@mp/common';
import THREE, { PlaneBufferGeometry, ShadowMaterial, Mesh, MeshBasicMaterial, Object3D } from 'three';

type PlaneMesh = {
  geometry: PlaneBufferGeometry;
  shadowMaterial: ShadowMaterial;
  debugMaterial: MeshBasicMaterial;
  shadowMesh: Mesh;
  debugMesh: Mesh;
};

const createShadowPlane = (three: typeof THREE, planeHeight: number, planeWidth: number): PlaneMesh => {
  const geometry = new three.PlaneBufferGeometry(planeHeight, planeWidth);
  const shadowMaterial = new three.ShadowMaterial();
  const debugMaterial = new three.MeshBasicMaterial();
  const shadowMesh = new three.Mesh(geometry, shadowMaterial);
  const debugMesh = new three.Mesh(geometry, debugMaterial);
  shadowMesh.add(debugMesh);
  return {
    geometry,
    shadowMaterial,
    shadowMesh,
    debugMaterial,
    debugMesh
  };
};

type Inputs = {
  showDebugPlanes: boolean;
  debugPlaneOpacity: number;
  shadowOpacity: number;
};

export class ShadowExample extends SceneComponent {
  private floor: PlaneMesh = null;
  private wall1: PlaneMesh = null;
  private wall2: PlaneMesh = null;
  private spotLightRoot: Object3D = null;

  constructor() {
    super();
  }
  
  inputs: Inputs = {
    showDebugPlanes: false,
    debugPlaneOpacity: 0.2,
    shadowOpacity: 0.2,
  };

  onInit() {
    this.init();
  }

  private async init() {
    // make sure the renderer has shadowmaps enabled.
    this.context.renderer.shadowMap.enabled = true;

    const THREE = this.context.three;
    const root = new THREE.Object3D();

    this.floor = createShadowPlane(THREE, 3.55, 3);
    this.floor.geometry.rotateX(-Math.PI / 2);
    this.floor.shadowMesh.receiveShadow = true;
    this.floor.shadowMesh.translateY(-0.4);
    this.floor.shadowMesh.translateX(-0.05);
    this.floor.debugMaterial.transparent = true;
    this.floor.debugMesh.receiveShadow = false;
    root.add(this.floor.shadowMesh);

    this.wall1 = createShadowPlane(THREE, 3.55, 2.6);
    this.wall1.shadowMesh.receiveShadow = true;
    this.wall1.shadowMesh.translateY(0.9);
    this.wall1.shadowMesh.translateX(-0.05);
    this.wall1.shadowMesh.translateZ(-1.5);
    this.wall1.debugMaterial.transparent = true;
    this.wall1.debugMesh.receiveShadow = false;
    root.add(this.wall1.shadowMesh);

    this.wall2 = createShadowPlane(THREE, 3, 2.6);
    this.wall2.geometry.rotateY(-Math.PI / 2);
    this.wall2.shadowMesh.receiveShadow = true;
    this.wall2.shadowMesh.translateY(0.9);
    this.wall2.shadowMesh.translateX(1.7);
    this.wall2.shadowMesh.translateZ(0.0);
    this.wall2.debugMaterial.transparent = true;
    this.wall2.debugMesh.receiveShadow = false;
    root.add(this.wall2.shadowMesh);

    const box = new THREE.BoxGeometry(0.5, 0.5);
    const boxMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
    });
    const mesh = new THREE.Mesh(box, boxMaterial);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    mesh.position.set(0, 1, 0);
    root.add(mesh);

    this.spotLightRoot = new THREE.Object3D();

    const spotLight = new THREE.SpotLight();
    spotLight.castShadow = true;
    spotLight.translateY(1.0);
    spotLight.translateX(1.5);

    const sphereGeometry = new THREE.SphereGeometry(0.04);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8,
    });
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

    spotLight.add(sphereMesh);
    this.spotLightRoot.add(spotLight);
    root.add(this.spotLightRoot);

    this.outputs.objectRoot = root;

    this.onInputsUpdated();
  }

  onInputsUpdated() {
    this.floor.debugMesh.visible = this.inputs.showDebugPlanes;
    this.floor.debugMaterial.opacity = this.inputs.debugPlaneOpacity;
    this.floor.shadowMaterial.opacity = this.inputs.shadowOpacity;
    
    this.wall1.debugMesh.visible = this.inputs.showDebugPlanes;
    this.wall1.debugMaterial.opacity = this.inputs.debugPlaneOpacity;
    this.wall1.shadowMaterial.opacity = this.inputs.shadowOpacity;
    
    this.wall2.debugMesh.visible = this.inputs.showDebugPlanes;
    this.wall2.debugMaterial.opacity = this.inputs.debugPlaneOpacity;
    this.wall2.shadowMaterial.opacity = this.inputs.shadowOpacity;
  }

  onTick() {
    this.spotLightRoot.rotateY(Math.PI / 180);
  }
}

export const shadowExampleType = 'mp.shadow';
export const makeShadowExample = () => {
  return new ShadowExample();
};
