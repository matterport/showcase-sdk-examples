import type { MpSdk } from '../../bundle/sdk';
import type { Color, LineBasicMaterial } from 'three';

export const gridType = 'grid';
export const makeGrid: MpSdk.Scene.IComponentFactory = () => {
  return {
    async onInit() {
      const THREE = this.context.three;

      class GridHelper extends THREE.GridHelper {
        constructor(size: number, divisions: number, color1?: Color | number, color2?: Color | number) {
          super(size, divisions, color1, color2);
        }
        public material: LineBasicMaterial;
      }

      const obj3D = new THREE.Object3D();
      const grid = new GridHelper(200, 200, 0xffffff, 0x777777);
      grid.material.opacity = 0.3;
      grid.material.transparent = true;
      obj3D.add(grid);

      const uniforms = {
        "topColor": { value: new THREE.Color(0x001144) },
        "bottomColor": { value: new THREE.Color(0xffffff) },
        "offset": { value: 2 },
        "exponent": { value: 0.4 }
      };

      const skyGeo = new THREE.SphereGeometry(100, 32, 15);
      const skyMat = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: gradientVertexShader(),
        fragmentShader: gradientFragmentShader(),
        side: THREE.BackSide
      });
      const sky = new THREE.Mesh(skyGeo, skyMat);
      obj3D.add(sky);

      const geometry = new THREE.SphereGeometry(95, 32, 15, 0, Math.PI, 0, Math.PI);
      const material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
      const plane = new THREE.Mesh(geometry, material);
      plane.rotateX(Math.PI / 2);
      plane.position.set(0, 0, 0);
      obj3D.add(plane);

      this.outputs.objectRoot = obj3D;
    },
  };
};

function gradientFragmentShader() {
  return `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;
    varying vec3 vWorldPosition;
    void main() {
      float h = normalize( vWorldPosition + offset ).y;
      gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
    }
  `;
}

function gradientVertexShader() {
  return `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `;
}
