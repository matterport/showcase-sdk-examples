import type { MpSdk } from '../../../bundle/sdk';
import { IPainter3d } from '@mp/common';
import type { Object3D, Camera, Scene, WebGLRenderer } from 'three';

type Outputs = {
  painter: IPainter3d | null;
};

class ScenePainter implements IPainter3d {
  constructor(private scene: Scene, private camera: Camera) {}

  paint(renderer: WebGLRenderer): void {
    renderer.clear();
    renderer.render(this.scene, this.camera);
  }
}

export interface IScenePainter {
  outputs: Outputs;
}

export const scenePainterType = 'mp.scenePainter';
export const makeScenePainter: MpSdk.Scene.IComponentFactory<Record<string, unknown>, Outputs> = () => {
  let scenePainter: ScenePainter;
  let scene: Scene;
  let camera: Camera;
  let cube: Object3D;
  let orbiter: Object3D;

  return {
    outputs: {
      painter: null,
    },

    onInit() {
      const THREE = this.context.three;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera();
      camera.position.z = 5;
      const cubeMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 1.0, 1.0),
        new THREE.MeshBasicMaterial({
          color: 0x00ff00,
        })
      );
      const cubeEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(1.0, 1.0, 1.0)),
        new THREE.MeshBasicMaterial({
          color: 0x000000,
        })
      );

      const orbiterObj = new THREE.Object3D();
      const orbitCube = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.4, 0.4),
        new THREE.MeshBasicMaterial({
          color: 0xff00ff,
        })
      );

      cube = cubeMesh;
      orbiter = orbiterObj;

      orbitCube.position.x = 1.5;
      cubeEdges.scale.multiplyScalar(1.0001);

      orbiter.add(orbitCube);
      cube.add(cubeEdges);
      cube.add(orbiter);
      scene.add(cube);

      scenePainter = new ScenePainter(scene, camera);

      this.outputs.painter = scenePainter;
    },

    onTick(delta) {
      cube.rotation.x += delta * 0.001;
      cube.rotation.y += 0.2 * delta * 0.001;

      orbiter.rotation.y -= 2 * delta * 0.001;

      // force a repaint
      this.outputs.painter = null;
      this.outputs.painter = scenePainter;
    },
  };
};
