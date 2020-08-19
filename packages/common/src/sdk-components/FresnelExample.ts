import { SceneComponent } from '@mp/common';
import { CubeCamera, Mesh, PerspectiveCamera, ShaderMaterial, WebGLRenderTarget } from 'three';

const FresnelShader = {
	uniforms: {
		"mRefractionRatio": { value: 1.02 },
		"mFresnelBias": { value: 0.1 },
		"mFresnelPower": { value: 2.0 },
		"mFresnelScale": { value: 1.0 },
		"tCube": { value: 0 }
	},
	vertexShader: [
		"uniform float mRefractionRatio;",
		"uniform float mFresnelBias;",
		"uniform float mFresnelScale;",
		"uniform float mFresnelPower;",

		"varying vec3 vReflect;",
		"varying vec3 vRefract[3];",
		"varying float vReflectionFactor;",

		"void main() {",

		"	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
		"	vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",

		"	vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );",

		"	vec3 I = worldPosition.xyz - cameraPosition;",

		"	vReflect = reflect( I, worldNormal );",
		"	vRefract[0] = refract( normalize( I ), worldNormal, mRefractionRatio );",
		"	vRefract[1] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.99 );",
		"	vRefract[2] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.98 );",
		"	vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), mFresnelPower );",

		"	gl_Position = projectionMatrix * mvPosition;",

		"}"
	].join( "\n" ),
	fragmentShader: [
    "uniform samplerCube tCube;",

		"varying vec3 vReflect;",
		"varying vec3 vRefract[3];",
		"varying float vReflectionFactor;",

		"void main() {",

		"	vec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );",
		"	vec4 refractedColor = vec4( 1.0 );",

		"	refractedColor.r = textureCube( tCube, vec3( vRefract[0].x, vRefract[0].yz ) ).r;",
		"	refractedColor.g = textureCube( tCube, vec3( vRefract[1].x, vRefract[1].yz ) ).g;",
		"	refractedColor.b = textureCube( tCube, vec3( vRefract[2].x, vRefract[2].yz ) ).b;",

		"	gl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );",

		"}"
	].join( "\n" )
};

type Inputs = {
  refractionRatio: number;
  fresnelBias: number;
  fresnelPower: number;
  fresnelScale: number;
  speed: number;
  radius: number;
};

type FresnelUniforms = {
  mRefractionRatio: { value: number },
  mFresnelBias: { value: number };
  mFresnelPower: { value: number };
  mFresnelScale: { value: number };
  tCube: { value: WebGLRenderTarget };
}

export class FresnalExample extends SceneComponent {
  private refractSphereCamera: CubeCamera = null;
  private refractSphere: Mesh = null;
  private refractMaterial: ShaderMaterial = null;
  private uniforms: FresnelUniforms = {
    mRefractionRatio: { value: 1.05 },
    mFresnelBias: { value: 0.1 },
    mFresnelPower: { value: 2.0 },
    mFresnelScale: { value: 1.0 },
    tCube: { value: null },
  };

  inputs: Inputs = {
    refractionRatio: 1.05,
    fresnelBias: 0.1,
    fresnelPower: 2.0,
    fresnelScale: 1.0,
    speed: 0.01,
    radius: 0.3,
  };

  onInit() {
    const THREE = this.context.three;

    const root = new THREE.Object3D();
    const geometry =  new THREE.IcosahedronGeometry(this.inputs.radius);
    const camera = (this.context as any).camera as PerspectiveCamera;
    this.refractSphereCamera = new THREE.CubeCamera(camera.near, camera.far, 1024);

    // make sure each of the child camera have all layers enabled.
    for (const obj of this.refractSphereCamera.children) {
      const childCamera = obj as PerspectiveCamera;
      childCamera.layers.enableAll();
    }

	  root.add(this.refractSphereCamera);
	
    this.uniforms.tCube.value= this.refractSphereCamera.renderTarget;
	
    // create custom material for the shader
    this.refractMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader:   FresnelShader.vertexShader,
      fragmentShader: FresnelShader.fragmentShader,
    });

    this.refractSphere = new THREE.Mesh( geometry, this.refractMaterial );
	  root.add(this.refractSphere);
    this.outputs.objectRoot = root;

    // generate the cubemap here
    this.refractSphere.visible = false;
    this.refractSphereCamera.update(this.context.renderer, (this.context as any).scene);
    this.refractSphere.visible = true;
    
    this.onInputsUpdated();
  }

  onInputsUpdated() {
    this.uniforms.mFresnelBias.value = this.inputs.fresnelBias;
    this.uniforms.mFresnelPower.value = this.inputs.fresnelPower;
    this.uniforms.mFresnelScale.value = this.inputs.fresnelScale;
    this.uniforms.mRefractionRatio.value = this.inputs.refractionRatio;
  }

  onTick() {
    this.refractSphere.rotation.y -= this.inputs.speed;
  }
}

export const fresnelExampleType = 'mp.fresnel';
export const makeFresnelExample = function() {
  return new FresnalExample();
}