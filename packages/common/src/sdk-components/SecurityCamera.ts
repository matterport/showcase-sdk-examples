import { Object3D, Mesh, PerspectiveCamera,
  MeshBasicMaterial, BoxGeometry, ShaderMaterial, LineBasicMaterial, EdgesGeometry,
  AnimationMixer, Color, Matrix4, Vector3 } from 'three';
import { SceneComponent } from '../SceneComponent';

interface Inputs {
  nearPlane: number;
  farPlane: number,
  horizontalFOV: number,
  aspect: number,
  localPosition: { x: number; y: number; z: number; };
  localRotation: { x: number; y: number; z: number; };
  color: number;
  panPeriod: number;
  panAngle: number;
}

type HighlightUniforms = {
  color: { value: Color },
  projPosition: { value: Vector3 };
  lightMatrix: { value: Matrix4 };
}

class SecurityCamera extends SceneComponent {
  private root: Object3D | null = null;
  private pivot: Object3D | null = null;
  private box: Mesh | null = null;
  private edges: Mesh | null = null;
  private projector: PerspectiveCamera;
  private highlight: Mesh | null = null;
  private highlightUniforms: HighlightUniforms = {
    color: { value: new Color() },
    projPosition: { value: new Vector3() },
    lightMatrix: { value: new Matrix4() },
  }
  private mixer: AnimationMixer;

  inputs: Inputs = {
    nearPlane: 0.1,
    farPlane: 4,
    horizontalFOV: 80,
    aspect: 16/9,
    localPosition: { x: 0, y: 0, z: 0 },
    localRotation: { x: 0, y: 0, z: 0 },
    color: 0xffffff,
    panPeriod: 20,
    panAngle: 180,
  };

  onInit() {
    const THREE = this.context.three;
    this.root = new THREE.Object3D();
    this.pivot = new THREE.Object3D();
    this.root.add(this.pivot);
    this.outputs.objectRoot = this.root;

    this.root.position.set(this.inputs.localPosition.x, this.inputs.localPosition.y, this.inputs.localPosition.z);

    const euler = new THREE.Euler(this.inputs.localRotation.x * Math.PI / 180, this.inputs.localRotation.y * Math.PI / 180, this.inputs.localRotation.z * Math.PI / 180, 'YXZ');
    this.pivot.quaternion.setFromEuler(euler);

    const aspect = this.inputs.aspect;
    const DEG2RAD = Math.PI / 180;
    const RAD2DEG = 1 / DEG2RAD;
    const verticalFOV = 2 * Math.atan(1 / aspect * Math.tan(0.5 * this.inputs.horizontalFOV * DEG2RAD)) * RAD2DEG;
    this.projector = new THREE.PerspectiveCamera(verticalFOV, aspect, this.inputs.nearPlane, this.inputs.farPlane);
    // orientation of the projector is handled by the pivot
    this.pivot.add(this.projector);

    this.makeFrustumVisuals();

    this.pivot.add(this.box);
    this.pivot.add(this.edges);

    this.makeHighlight();

    // attach highighting to the mesh it represents
    // TODO (scene query): this is very brittle but is the only way to attach something to a room of the model
    this.outputs.objectRoot.parent.parent.add(this.highlight);

    // create the animation mixer to rotate the camera
    this.makeAnimation();
  }

  onTick(delta: number) {
    updateHighlightUniforms(this.projector, this.highlightUniforms);
    if (this.mixer) {
      this.mixer.update(delta/1000);
    }
  }

  onDestroy() {
    if (this.highlight && this.highlight.parent) {
      this.highlight.parent.remove(this.highlight);
      (this.highlight.material as ShaderMaterial).dispose();
    }
    if (this.edges) {
      this.edges.geometry.dispose();
      (this.edges.material as LineBasicMaterial).dispose();
    }
    if (this.box) {
      this.box.geometry.dispose();
      (this.box.material as MeshBasicMaterial).dispose();
    }

  }

  private makeFrustumVisuals() {
    const THREE = this.context.three;
    if (this.box) {
      this.root.remove(this.box);
      (this.box.material as MeshBasicMaterial).dispose();
      (this.box.geometry as BoxGeometry).dispose();
      this.box = null;
    }
    if (this.edges) {
      this.root.remove(this.edges);
      (this.edges.material as LineBasicMaterial).dispose();
      (this.edges.geometry as EdgesGeometry).dispose();
      this.edges = null;
    }

    function edgesToCylinders(edgesGeometry: EdgesGeometry, thickness: number) {
      const {position} = edgesGeometry.attributes;
      const {array, count} = position;
      const r = thickness / 2;
      const geoms = [];
      for (let i = 0; i < count * 3 - 1; i += 6) {
        const a = new THREE.Vector3(array[i], array[i + 1], array[i + 2]);
        const b = new THREE.Vector3(array[i + 3], array[i + 4], array[i + 5]);

        const vec = new THREE.Vector3().subVectors(b, a);
        const len = vec.length();
        const geom = new THREE.CylinderBufferGeometry(r, r, len, 8);
        geom.translate(0, len / 2, 0);
        geom.rotateX(Math.PI / 2);
        geom.lookAt(vec);
        geom.translate(a.x, a.y, a.z);
        geoms.push(geom);
      }
      // API to be updated in bundle - JSSDK-1222
      return (THREE as any).mergeBufferGeometries(geoms);
    }

    const frustumLength = this.inputs.farPlane - this.inputs.nearPlane;
    const boxGeometry: BoxGeometry = new THREE.BoxGeometry(2, 2, frustumLength);
    const halfHAngle = this.inputs.horizontalFOV * 0.5 * Math.PI / 180;
    const nearHalfWidth = Math.tan(halfHAngle) * this.inputs.nearPlane;
    const farHalfWidth = Math.tan(halfHAngle) * this.inputs.farPlane;
    const nearHalfHeight = nearHalfWidth / this.inputs.aspect;
    const farHalfHeight = farHalfWidth / this.inputs.aspect;

    const positions = boxGeometry.getAttribute('position');

    for (let i = 0; i<positions.count; i++ ) {
      const vertexZ = positions.getZ(i);
      const vertexX = positions.getX(i);
      const vertexY = positions.getY(i);
      if (vertexZ > 0) {
        // back of the camera
        positions.setX(i, vertexX * nearHalfWidth)
        positions.setY(i, vertexY * nearHalfHeight);
      }
      else {
        // front of the camera
        positions.setX(i, vertexX * farHalfWidth)
        positions.setY(i, vertexY * farHalfHeight);
      }
      positions.setZ(i, vertexZ - 0.5 * frustumLength - this.inputs.nearPlane);
    }

    var boxMaterial: MeshBasicMaterial = new THREE.MeshBasicMaterial({
      color: this.inputs.color,
      opacity: 0.05,
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });
    this.box = new THREE.Mesh(boxGeometry, boxMaterial);
    const edgesGeometry = edgesToCylinders(new THREE.EdgesGeometry(boxGeometry), 0.015);
    this.edges = new THREE.Mesh(edgesGeometry, new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.25,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));

    const edgesGeometry2 = edgesToCylinders(new THREE.EdgesGeometry(boxGeometry), 0.06);
    const edges2 = new THREE.Mesh(edgesGeometry2, new THREE.MeshBasicMaterial({
      color: this.inputs.color,
      opacity: 0.05,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));
    this.pivot.add(edges2);
  }

  private makeHighlight() {
    const THREE = this.context.three;

    // TODO (scene query): this is very brittle and hardcoded but is the only way to get room geometries until we have a better way to query the scene graph
    const floorMesh = this.outputs.objectRoot.parent.parent.getObjectByName('FloorMesh:0');
    const roomMesh = floorMesh.children[0] as Mesh;

    updateHighlightUniforms(this.projector, this.highlightUniforms);
    this.highlightUniforms.color.value.setHex(this.inputs.color);

    const shader = new THREE.ShaderMaterial({
      polygonOffset: true,
      polygonOffsetUnits: -0.1,
      transparent: true,
      uniforms: this.highlightUniforms,
      vertexShader: vertexShader(),
      fragmentShader: fragmentShader(),
    });

    // a mesh to represent the "highlight"
    this.highlight = new THREE.Mesh(roomMesh.geometry, shader);
  }

  private makeAnimation() {
    const THREE = this.context.three;

    // preapply the initial rotation of the root so that panAngle is relative to it.
    const rootRotation = this.context.root.quaternion;
    const yAxis = new THREE.Vector3(0, 1, 0);
    const frame0 = new THREE.Quaternion().setFromAxisAngle(yAxis, 0).premultiply(rootRotation);
    const frame1 = new THREE.Quaternion().setFromAxisAngle(yAxis, this.inputs.panAngle).premultiply(rootRotation);

    // a track that has delays at the start and end for 5% of the animation
    const track = new THREE.QuaternionKeyframeTrack('.quaternion', [
      0, this.inputs.panPeriod * 0.05, this.inputs.panPeriod * 0.95, this.inputs.panPeriod
    ], [
      frame0.x, frame0.y, frame0.z, frame0.w,
      frame0.x, frame0.y, frame0.z, frame0.w,
      frame1.x, frame1.y, frame1.z, frame1.w,
      frame1.x, frame1.y, frame1.z, frame1.w,
    ]);

    const clip = new THREE.AnimationClip('panning', this.inputs.panPeriod, [track]);

    // There is no api to change the rotation of the root, so we will use a private property to access the Object3D.
    // This will likely need to change in the future.
    this.mixer = new THREE.AnimationMixer((this.context.root as any).obj3D);
    const action = this.mixer.clipAction(clip);
    action.loop = THREE.LoopPingPong;
    action.play();
  }

}

function vertexShader(): string {
  return `
    uniform mat4 lightMatrix;

    varying vec4 vLightCoords;

    void main() {
      // create a UV region [0,1] x [0,1] to represent what the lightMatrix "sees"
      vLightCoords = lightMatrix *  modelMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
}

function fragmentShader() {
  return `
    uniform vec3 color;

    varying vec4 vLightCoords;

    void main() {
      vec2 lightUV = vLightCoords.xy / vLightCoords.w;
      float inView = float(max(lightUV.x, lightUV.y) <= 1.0 && min(lightUV.x, lightUV.y) >= 0.0 && vLightCoords.z > 0.0);

      gl_FragColor = vec4(color, min(inView, 0.2));
    }
  `;
}

function updateHighlightUniforms(projector: PerspectiveCamera, uniforms: HighlightUniforms) {
  projector.getWorldPosition(uniforms.projPosition.value);

  // similar to a shadow matrix, but we're using it as a "rectangular" spotlight
  // [lightBias] * [projection] * [viewMatrix]
  uniforms.lightMatrix.value.makeScale(0.5, 0.5, 0.5);
  uniforms.lightMatrix.value.setPosition(new Vector3(0.5, 0.5, 0.5))
  uniforms.lightMatrix.value.multiplyMatrices(uniforms.lightMatrix.value, projector.projectionMatrix);
  uniforms.lightMatrix.value.multiplyMatrices(uniforms.lightMatrix.value, projector.matrixWorldInverse);
}

export const securityCameraType = 'mp.securityCamera';
export const makeSecurityCamera = function() {
  return new SecurityCamera();
}
