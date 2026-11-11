import type { MpSdk } from '../../bundle/sdk';
import type { TubeGeometry, Vector3, Camera, Mesh } from 'three';

export const DoneEvent = 'done';

const scale = 1;
type Outputs = {
  camera: null | Camera;
  objectRoot?: Mesh | null;
};

export const makeSplineCamera: MpSdk.Scene.IComponentFactory<Record<string, unknown>, Outputs> = () => {
  let tubeGeometry: TubeGeometry;
  let position: Vector3;
  let binormal: Vector3;
  let direction: Vector3;
  let normal: Vector3;
  let lookAt: Vector3;
  let camera: Camera;
  let startTime: number;
  const spheres: Mesh[] = [];
  const disposables: { dispose: () => void }[] = [];

  return {
    outputs: {
      camera: null,
    },

    onInit() {
      const THREE = this.context.three;
      position = new THREE.Vector3();
      binormal = new THREE.Vector3();
      direction = new THREE.Vector3();
      normal = new THREE.Vector3();
      lookAt = new THREE.Vector3();

      camera = new THREE.PerspectiveCamera();
      const points: Vector3[] = [
        new THREE.Vector3(-0.09, 3.83, -7.53),
        new THREE.Vector3(0.9, 1.11, -1.61),
        new THREE.Vector3(-1.88, 1.11, 3.05),
        new THREE.Vector3(-1.57, 1.11, 7.07),
        new THREE.Vector3(1.0, 3.89, 8.63),
        new THREE.Vector3(1.78, 4.62, 5.89),
        new THREE.Vector3(1.8, 4.62, 3.86),
        new THREE.Vector3(-0.5, 4.69, 3.86),
        new THREE.Vector3(-0.2, 4.69, 0.20),
      ]

      const pipeSpline = new THREE.CatmullRomCurve3(points);

      tubeGeometry = new THREE.TubeGeometry(pipeSpline, 100, 0.1, 5, true);
      const material = new THREE.MeshLambertMaterial({ color: 0x008800, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.3 });
      const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x004400, opacity: 0.4, wireframe: true, transparent: true });
      const mesh = new THREE.Mesh(tubeGeometry, material);
      const wireframe = new THREE.Mesh(tubeGeometry, wireframeMaterial);
      mesh.add(wireframe);
      mesh.scale.set(scale, scale, scale);

      this.outputs.objectRoot = mesh;
      this.outputs.camera = camera;
      startTime = Date.now();

      for (const point of points) {
        const geometry = new THREE.SphereGeometry(0.05, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0x0000bb });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.copy(point);
        spheres.push(sphere);
        mesh.add(sphere);

        disposables.push(geometry);
        disposables.push(material);
      }

      disposables.push(tubeGeometry);
      disposables.push(material);
      disposables.push(wireframeMaterial);
    },

    onTick() {
      const time = Date.now() - startTime;
      const looptime = 20 * 1000;
      const t = (time % looptime) / looptime;

      tubeGeometry.parameters.path.getPointAt(t, position);
      position.multiplyScalar(scale);

      const segments = tubeGeometry.tangents.length;
      const pickt = t * segments;
      const pick = Math.floor(pickt);
      const pickNext = (pick + 1) % segments;

      binormal.subVectors(tubeGeometry.binormals[pickNext], tubeGeometry.binormals[pick]);
      binormal.multiplyScalar(pickt - pick).add(tubeGeometry.binormals[pick]);

      direction.copy(tubeGeometry.parameters.path.getTangentAt(t));
      const offset = 0;

      normal.copy(binormal).cross(direction).negate();
      normal.set(0, 1, 0);

      position.add(normal.clone().multiplyScalar(offset));

      camera.position.copy(position);

      tubeGeometry.parameters.path.getPointAt((t + 2 / tubeGeometry.parameters.path.getLength()) % 1, lookAt);
      lookAt.multiplyScalar(scale);

      camera.matrix.lookAt(camera.position, lookAt, normal);
      camera.quaternion.setFromRotationMatrix(camera.matrix);

      if (time > 20 * 1000) {
        this.notify(DoneEvent);
        // @deprecated context.root not in sdk.d.ts
        const root: MpSdk.Scene.INode = (this.context as any).root;
        root.stop();
      }
    },

    onDestroy() {
      for (const disposable of disposables) {
        disposable.dispose();
      }
      tubeGeometry = null;
    },
  };
};

export const splineCameraType = 'splineCamera';
