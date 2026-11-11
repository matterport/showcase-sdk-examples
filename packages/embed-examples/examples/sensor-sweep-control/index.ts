import type { MpSdk } from 'embedtypes/sdk';
import { clearMesssage, connect, setMessage } from '../common';
import '../common/main.css';

const collectionUpdated = () => true;

/**
 * The source sweep is the start sweep's neighbor that is currently on screen, so
 * it sits in front of the user.
 *
 * `worldToScreen` returns negative x/y for points behind the camera or outside the
 * frustum, so a neighbor that projects inside the viewport is one the user faces.
 * This avoids deriving a camera-forward vector from the pose rotation.
 */
const pickSourceSweepSid = async (
  sdk: MpSdk,
  sweeps: MpSdk.Dictionary<MpSdk.Sweep.ObservableSweepData>,
  startSweep: MpSdk.Sweep.ObservableSweepData
): Promise<string> => {
  const { neighbors } = startSweep;
  const pose = await sdk.Camera.pose.waitUntil(() => true);
  const frame = document.getElementById('sdk-frame') as HTMLIFrameElement;
  const size = { w: frame.clientWidth, h: frame.clientHeight };

  const onScreen = neighbors.find((sid) => {
    const sweep = sweeps[sid];
    if (!sweep) {
      return false;
    }
    const screen = sdk.Conversion.worldToScreen(sweep.position, pose, size);
    return screen.x >= 0 && screen.x <= size.w && screen.y >= 0 && screen.y <= size.h;
  });

  return onScreen ?? neighbors[0];
};

const main = async () => {
  const sdk: MpSdk = await connect({
    urlParams: {
      qs: '1',
      sr: '-3.04',
      ss: '25',
      play: '1',
      title: '0',
    },
  });
  const textElement = document.getElementById('text') as HTMLDivElement;
  clearMesssage(textElement);

  // Start sweep and full sweep list, each resolved once from the loaded model.
  const startSweep = await sdk.Sweep.current.waitUntil((sweep) => sweep.id !== '');
  const sweeps = await sdk.Sweep.data.waitUntil(collectionUpdated);
  const sids = Object.keys(sweeps);
  const initialSweepSid = startSweep.id;
  const sourceSweepSid = await pickSourceSweepSid(sdk, sweeps, startSweep);

  const sensor = await sdk.Sensor.createSensor(sdk.Sensor.SensorType.CAMERA);
  sensor.showDebug(true);
  const source = await sdk.Sensor.createSource(sdk.Sensor.SourceType.CYLINDER, {
    basePoint: sweeps[sourceSweepSid].position,
    radius: 2.5,
    height: 2.5,
    userData: {
      id: 'Source',
    },
  });
  sensor.addSource(source);

  let inRange = false;
  let currentSweepId = initialSweepSid;

  const update = () => {
    if (inRange) {
      sdk.Sweep.enable(...sids);
      setMessage(textElement, 'Navigate to the start location to disable sweeps');
    } else if (currentSweepId === initialSweepSid) {
      sdk.Sweep.disable(...sids.filter((sid) => sid !== initialSweepSid && sid !== sourceSweepSid));
      setMessage(textElement, 'Move towards the source to enable the rest of the sweeps');
    } else {
      setMessage(textElement, 'Navigate to the start location to disable sweeps');
    }
  };

  sdk.Sweep.current.subscribe((sweep) => {
    currentSweepId = sweep.id;
    update();
  });

  sensor.readings.subscribe({
    onCollectionUpdated: (sourceCollection) => {
      for (const [, reading] of sourceCollection) {
        inRange = reading.inRange;
      }
      update();
    },
  });

  update();
};

main();
