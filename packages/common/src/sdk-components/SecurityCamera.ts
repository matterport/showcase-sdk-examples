import type {
  Object3D,
  Mesh,
  PerspectiveCamera,
  BufferAttribute,
  MeshBasicMaterial,
  BufferGeometry,
  ShaderMaterial,
  EdgesGeometry,
  AnimationMixer,
  Color,
  Matrix4,
  Vector3,
} from 'three';
import type { MpSdk } from '../../../bundle/sdk';

type Inputs = {
  nearPlane: number;
  farPlane: number;
  horizontalFOV: number;
  aspect: number;
  localPosition: { x: number; y: number; z: number };
  localRotation: { x: number; y: number; z: number };
  color: number;
  panPeriod: number;
  panAngle: number;
};

type HighlightUniforms = {
  color: { value: Color };
  projPosition: { value: Vector3 };
  lightMatrix: { value: Matrix4 };
};

export const securityCameraType = 'mp.securityCamera';
export const makeSecurityCamera: MpSdk.Scene.IComponentFactory<Inputs, Record<string, unknown>> = () => {
  let root: Object3D | null = null;
  let pivot: Object3D | null = null;
  let box: Mesh<BufferGeometry, MeshBasicMaterial> | null = null;
  let edges: Mesh<BufferGeometry, MeshBasicMaterial> | null = null;
  let projector: PerspectiveCamera;
  let highlight: Mesh<BufferGeometry, ShaderMaterial> | null = null;
  let highlightUniforms: HighlightUniforms;
  let mixer: AnimationMixer;

  const updateHighlightUniforms = (THREE: typeof import('three')) => {
    projector.getWorldPosition(highlightUniforms.projPosition.value);

    // similar to a shadow matrix, but we're using it as a "rectangular" spotlight
    // [lightBias] * [projection] * [viewMatrix]
    highlightUniforms.lightMatrix.value.makeScale(0.5, 0.5, 0.5);
    highlightUniforms.lightMatrix.value.setPosition(new THREE.Vector3(0.5, 0.5, 0.5));
    highlightUniforms.lightMatrix.value.multiplyMatrices(highlightUniforms.lightMatrix.value, projector.projectionMatrix);
    highlightUniforms.lightMatrix.value.multiplyMatrices(highlightUniforms.lightMatrix.value, projector.matrixWorldInverse);
  };

  const makeFrustumVisuals = (THREE: typeof import('three'), inputs: Inputs) => {
    if (box) {
      root.remove(box);
      box.material.dispose();
      box.geometry.dispose();
      box = null;
    }
    if (edges) {
      root.remove(edges);
      edges.material.dispose();
      edges.geometry.dispose();
      edges = null;
    }

    function edgesToCylinders(edgesGeometry: EdgesGeometry, thickness: number, material: MeshBasicMaterial): Mesh<BufferGeometry, MeshBasicMaterial> {
      // Casting as a BufferAttribute, due to Types issue to be resolved in THREE.JS r160
      const vertices = (edgesGeometry.attributes.position as BufferAttribute).array;
      const count = edgesGeometry.attributes.position.count;
      const r = thickness / 2;
      const geoms: BufferGeometry[] = [];
      for (let i = 0; i < count * 3 - 1; i += 6) {
        const a = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
        const b = new THREE.Vector3(vertices[i + 3], vertices[i + 4], vertices[i + 5]);

        const vec = new THREE.Vector3().subVectors(b, a);
        const len = vec.length();
        const geom = new THREE.CylinderGeometry(r, r, len, 8);
        geom.translate(0, len / 2, 0);
        geom.rotateX(Math.PI / 2);
        geom.lookAt(vec);
        geom.translate(a.x, a.y, a.z);
        geoms.push(geom);
      }

      // Manually merge the per-edge geometries into one.
      let totalVerts = 0, totalIdx = 0;
      for (const g of geoms) { totalVerts += g.attributes.position.count; totalIdx += g.index.count; }

      const posAttr  = new THREE.BufferAttribute(new THREE.Float32BufferAttribute(totalVerts * 3, 1).array, 3);
      const normAttr = new THREE.BufferAttribute(new THREE.Float32BufferAttribute(totalVerts * 3, 1).array, 3);
      const uvAttr   = new THREE.BufferAttribute(new THREE.Float32BufferAttribute(totalVerts * 2, 1).array, 2);
      const idxAttr  = new THREE.BufferAttribute(new THREE.Uint16BufferAttribute(totalIdx, 1).array, 1);

      let vOff = 0, iOff = 0;
      for (const g of geoms) {
        const pc = g.attributes.position.count;
        posAttr.array.set(g.attributes.position.array,  vOff * 3);
        normAttr.array.set(g.attributes.normal.array,   vOff * 3);
        uvAttr.array.set(g.attributes.uv.array,         vOff * 2);
        const idx = g.index.array;
        for (let i = 0; i < idx.length; i++) idxAttr.array[iOff + i] = idx[i] + vOff;
        vOff += pc; iOff += idx.length;
        g.dispose();
      }

      const merged = new THREE.BufferGeometry();
      merged.setAttribute('position', posAttr);
      merged.setAttribute('normal',   normAttr);
      merged.setAttribute('uv',       uvAttr);
      merged.setIndex(idxAttr);
      return new THREE.Mesh(merged, material);
    }

    const frustumLength = inputs.farPlane - inputs.nearPlane;
    const boxGeometry = new THREE.BoxGeometry(2, 2, frustumLength);
    const halfHAngle = (inputs.horizontalFOV * 0.5 * Math.PI) / 180;
    const nearHalfWidth = Math.tan(halfHAngle) * inputs.nearPlane;
    const farHalfWidth = Math.tan(halfHAngle) * inputs.farPlane;
    const nearHalfHeight = nearHalfWidth / inputs.aspect;
    const farHalfHeight = farHalfWidth / inputs.aspect;

    // Casting as a BufferAttribute, due to Types issue with GLBufferAttribute
    // to be resolved in THREE.JS r160
    const positions = boxGeometry.getAttribute('position') as BufferAttribute;

    for (let i = 0; i < positions.count; i++) {
      const vertexZ = positions.getZ(i);
      const vertexX = positions.getX(i);
      const vertexY = positions.getY(i);
      if (vertexZ > 0) {
        // back of the camera
        positions.setX(i, vertexX * nearHalfWidth);
        positions.setY(i, vertexY * nearHalfHeight);
      } else {
        // front of the camera
        positions.setX(i, vertexX * farHalfWidth);
        positions.setY(i, vertexY * farHalfHeight);
      }
      positions.setZ(i, vertexZ - 0.5 * frustumLength - inputs.nearPlane);
    }

    const boxMaterial: MeshBasicMaterial = new THREE.MeshBasicMaterial({
      color: inputs.color,
      opacity: 0.05,
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });
    box = new THREE.Mesh(boxGeometry, boxMaterial);
    edges = edgesToCylinders(new THREE.EdgesGeometry(boxGeometry), 0.015, new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.25,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));

    const edges2 = edgesToCylinders(new THREE.EdgesGeometry(boxGeometry), 0.06, new THREE.MeshBasicMaterial({
      color: inputs.color,
      opacity: 0.05,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));
    pivot.add(edges2);
  };

  const makeHighlight = (THREE: typeof import('three'), inputs: Inputs, objectRoot: Object3D) => {
    // TODO (scene query): this is very brittle and hardcoded but is the only way to get room geometries until we have a better way to query the scene graph
    // FloorMesh:0 may not exist in all showcase bundle versions — guard against it
    const floorMesh = objectRoot.parent?.parent?.getObjectByName('FloorMesh:0');
    if (!floorMesh || !floorMesh.children[0]) return;
    const roomMesh = floorMesh.children[0] as Mesh;

    updateHighlightUniforms(THREE);
    highlightUniforms.color.value.setHex(inputs.color);

    const shader = new THREE.ShaderMaterial({
      polygonOffset: true,
      polygonOffsetUnits: -0.1,
      transparent: true,
      uniforms: highlightUniforms,
      vertexShader: vertexShader(),
      fragmentShader: fragmentShader(),
    });

    // a mesh to represent the "highlight"
    highlight = new THREE.Mesh(roomMesh.geometry, shader);
  };

  const makeAnimation = (THREE: typeof import('three'), inputs: Inputs, sceneRoot: MpSdk.Scene.INode) => {
    // preapply the initial rotation of the root so that panAngle is relative to it.
    const rootRotation = sceneRoot.quaternion;
    const yAxis = new THREE.Vector3(0, 1, 0);
    const frame0 = new THREE.Quaternion().setFromAxisAngle(yAxis, 0).premultiply(rootRotation);
    const frame1 = new THREE.Quaternion().setFromAxisAngle(yAxis, inputs.panAngle).premultiply(rootRotation);

    // a track that has delays at the start and end for 5% of the animation
    const track = new THREE.QuaternionKeyframeTrack(
      '.quaternion',
      [0, inputs.panPeriod * 0.05, inputs.panPeriod * 0.95, inputs.panPeriod],
      [
        frame0.x, frame0.y, frame0.z, frame0.w,
        frame0.x, frame0.y, frame0.z, frame0.w,
        frame1.x, frame1.y, frame1.z, frame1.w,
        frame1.x, frame1.y, frame1.z, frame1.w,
      ]
    );

    const clip = new THREE.AnimationClip('panning', inputs.panPeriod, [track]);

    // There is no api to change the rotation of the root, so we will use a private property to access the Object3D.
    // This will likely need to change in the future.
    // NOTE: `obj3D` is an undocumented runtime property on INode — the SDK does not
    // expose it in its type declarations, so we must use a type assertion here.
    const obj3D = (sceneRoot as unknown as { obj3D: Object3D }).obj3D;
    mixer = new THREE.AnimationMixer(obj3D);
    const action = mixer.clipAction(clip);
    action.loop = THREE.LoopPingPong;
    action.play();
  };

  return {
    inputs: {
      nearPlane: 0.1,
      farPlane: 4,
      horizontalFOV: 80,
      aspect: 16 / 9,
      localPosition: { x: 0, y: 0, z: 0 },
      localRotation: { x: 0, y: 0, z: 0 },
      color: 0xffffff,
      panPeriod: 20,
      panAngle: 180,
    },

    onInit() {
      const THREE = this.context.three;
      highlightUniforms = {
        color: { value: new THREE.Color() },
        projPosition: { value: new THREE.Vector3() },
        lightMatrix: { value: new THREE.Matrix4() },
      };
      root = new THREE.Object3D();
      pivot = new THREE.Object3D();
      root.add(pivot);
      this.outputs.objectRoot = root;
      root.position.set(this.inputs.localPosition.x, this.inputs.localPosition.y, this.inputs.localPosition.z);

      const euler = new THREE.Euler(
        (this.inputs.localRotation.x * Math.PI) / 180,
        (this.inputs.localRotation.y * Math.PI) / 180,
        (this.inputs.localRotation.z * Math.PI) / 180,
        'YXZ'
      );
      pivot.quaternion.setFromEuler(euler);

      const aspect = this.inputs.aspect;
      const DEG2RAD = Math.PI / 180;
      const RAD2DEG = 1 / DEG2RAD;
      const verticalFOV = 2 * Math.atan((1 / aspect) * Math.tan(0.5 * this.inputs.horizontalFOV * DEG2RAD)) * RAD2DEG;
      projector = new THREE.PerspectiveCamera(verticalFOV, aspect, this.inputs.nearPlane, this.inputs.farPlane);
      // orientation of the projector is handled by the pivot
      pivot.add(projector);

      makeFrustumVisuals(THREE, this.inputs);

      pivot.add(box);
      pivot.add(edges);

      makeHighlight(THREE, this.inputs, this.outputs.objectRoot as Object3D);

      // attach highighting to the mesh it represents
      // TODO (scene query): this is very brittle but is the only way to attach something to a room of the model
      if (highlight) {
        (this.outputs.objectRoot as Object3D).parent?.parent?.add(highlight);
      }

      // create the animation mixer to rotate the camera
      // @deprecated context.root not in sdk.d.ts
      const sceneRoot: MpSdk.Scene.INode = (this.context as any).root;
      makeAnimation(THREE, this.inputs, sceneRoot);
    },

    onTick(delta) {
      updateHighlightUniforms(this.context.three);
      if (mixer) {
        mixer.update(delta / 1000);
      }
    },

    onDestroy() {
      if (highlight && highlight.parent) {
        highlight.parent.remove(highlight);
        highlight.material.dispose();
      }
      if (edges) {
        edges.geometry.dispose();
        edges.material.dispose();
      }
      if (box) {
        box.geometry.dispose();
        box.material.dispose();
      }
    },
  };
};

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
