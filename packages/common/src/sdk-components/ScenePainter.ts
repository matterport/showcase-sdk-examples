import { SceneComponent, ComponentOutput, IPainter3d } from '@mp/common';
import { Object3D, Camera, Scene, WebGLRenderer } from 'three';

type Outputs = {
  painter: IPainter3d | null;
} & ComponentOutput;

class ScenePainterComponent extends SceneComponent {
  private scenePainter: ScenePainter;
  private scene: Scene;
  private camera: Camera;
  private cube: Object3D;
  private orbiter: Object3D;

  outputs = {
    painter: null,
  } as Outputs;

  onInit() {
    const THREE = this.context.three;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera();
    this.camera.position.z = 5;

    const cube = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1.0, 1.0, 1.0),
      new THREE.MeshBasicMaterial({
        color: 0x00ff00,
      }));
    const cubeEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxBufferGeometry(1.0, 1.0, 1.0)),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
      }));


    const orbiter = new THREE.Object3D();
    const orbitCube = new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.4, 0.4, 0.4),
      new THREE.MeshBasicMaterial({
        color: 0xff00ff,
      }));

    this.cube = cube;
    this.orbiter = orbiter;

    orbitCube.position.x = 1.5;
    cubeEdges.scale.multiplyScalar(1.0001);

    this.orbiter.add(orbitCube);
    this.cube.add(cubeEdges);
    this.cube.add(this.orbiter);
    this.scene.add(this.cube);

    this.scenePainter = new ScenePainter(this.scene, this.camera);

    this.outputs.painter = this.scenePainter;
  }

  onTick(delta: number) {
    this.cube.rotation.x += delta * 0.001;
    this.cube.rotation.y += 0.2 * delta * 0.001;

    this.orbiter.rotation.y -= 2 * delta * 0.001;

    // force a repaint
    this.outputs.painter = null;
    this.outputs.painter = this.scenePainter;
  }
}

class ScenePainter implements IPainter3d {
  constructor(private scene: Scene, private camera: Camera) {}

  paint(renderer: WebGLRenderer): void{
    renderer.clear();
    renderer.render(this.scene, this.camera);
  }
}

export interface IScenePainter extends SceneComponent {
  outputs: Outputs;
}

export const scenePainterType = 'mp.scenePainter';
export function makeScenePainter() {
  return new ScenePainterComponent();
}
