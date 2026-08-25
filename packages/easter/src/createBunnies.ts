import type { MpSdk } from '../../bundle/sdk';
import { bunnySelectorSphereType } from './scene-components/BunnySelectorSphere';
import { bunnyCaptureType } from './scene-components/BunnyCapture';

interface BunnyDef {
  position: { x: number; y: number; z: number };
  color: number;
}

const bunnyData: BunnyDef[] = [
  { position: { x: 11.18474545225594, y: 0.2756181215192268, z: -3.1434681622828125 }, color: 0xFFE7AF },
  { position: { x: 15.991288150452277, y: 0.38545671940143555, z: 0.9049066082666043 }, color: 0xDD1EA8 },
  { position: { x: 17.076878155777734, y: 0.8821859420391143, z: 4.635173924790218 }, color: 0xC1F28B },
  { position: { x: 19.880591275520363, y: 0.9245685174976366, z: 4.149295521433636 }, color: 0xFFE7AF },
  { position: { x: -1.8485883310306743, y: 0.21579756931184774, z: -1.4239917403037712 }, color: 0xDD1EA8 },
  { position: { x: 18.686887411543438, y: 0.06886771359800781, z: -14.128564379161563 }, color: 0xF9E2EE },
  { position: { x: 30.751605702565286, y: 0.2024333981524527, z: 1.604592909511092 }, color: 0xDD1EA8 },
  { position: { x: 15.393789823149115, y: 0.3128603336581109, z: 2.5520357535294953 }, color: 0xDD1EA8 },
  { position: { x: 16.64772830614439, y: 0.10768863934734596, z: -10.62866274435374 }, color: 0xFFE7AF },
  { position: { x: 9.796921797706606, y: 0.21684271800508959, z: 0.159945038809709 }, color: 0xF9E2EE },
  { position: { x: 19.899281072054535, y: 0.47722828594955824, z: -13.22200321863204 }, color: 0xFFE7AF },
  { position: { x: 19.23618174472766, y: 1.1109361839025198, z: 5.909579020062852 }, color: 0xE0FFFF },
];

export function createBunnies(object: MpSdk.Scene.IObject, sdk: MpSdk) {
  for (const bunny of bunnyData) {
    const node = object.addNode();
    node.position.set(bunny.position.x, bunny.position.y, bunny.position.z);

    const selector = node.addComponent(bunnySelectorSphereType, {
      size: 1.0,
      color: bunny.color,
      lineColor: 0,
      hoverOpacity: 0.8,
    });

    const capture = node.addComponent(bunnyCaptureType);

    object.bindPath(object.addEventPath(capture, 'captured'), object.addEmitPath(selector, sdk.Scene.InteractionType.CLICK));
  }
}
