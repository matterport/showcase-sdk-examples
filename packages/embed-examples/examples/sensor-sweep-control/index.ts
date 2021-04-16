import { clearMesssage, connect, setMessage } from '../common';
import '../common/main.css';

const initialSweepSid = '85e7bf413ca344da81e6ec42bcb4aaea';
const sourceSweepSid = '96fe9ff2682148878399aa2af5da847c';
let inRangeCache: boolean = false;
let currentSweepId: string = '';

const checkDisableSweeps = (sdk: any, textElement: HTMLDivElement) => {
  if (!inRangeCache){
    if (currentSweepId === initialSweepSid) {
      const sweepSub = sdk.Sweep.data.subscribe({
        onCollectionUpdated: (sweeps: any) => {
          const sids: string[] = Object.keys(sweeps)
            .filter((sid: string) => sid !== initialSweepSid && sid !== sourceSweepSid);
          sdk.Sweep.disable(...sids);

          sweepSub.cancel();
          setMessage(textElement, 'Move towards the source to enable the rest of the sweeps');
        },
      });
    }
    else if (currentSweepId !== '') {
      setMessage(textElement, 'Navigate to the start location to disable sweeps');
    }
  }
};

const checkEnableSweeps = (sdk: any, textElement: HTMLDivElement) => {
  if (inRangeCache) {
    const sweepSub = sdk.Sweep.data.subscribe({
      onCollectionUpdated: (sweeps: any) => {
        sdk.Sweep.enable(...Object.keys(sweeps));
        sweepSub.cancel();

        setMessage(textElement, 'Navigate to the start location to disable sweeps');
      },
    });
  }
};

const main = async () => {
  const sdk = await connect({
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

  sdk.Sweep.current.subscribe((sweep: any) => {
    currentSweepId = sweep.sid;
    checkDisableSweeps(sdk, textElement);
    checkEnableSweeps(sdk, textElement);
  });

  const sensor = await sdk.Sensor.createSensor(sdk.Sensor.SensorType.CAMERA);
  sensor.showDebug(true);
  const source = await sdk.Sensor.createSource(sdk.Sensor.SourceType.CYLINDER, {
      basePoint: { x: -0.629, y: 1, z: 5.909 },
      radius: 2.5,
      height: 2.5,
      userData: {
        id: "Family Room",
      },
    },
  );

  sensor.addSource(source);
  sensor.readings.subscribe({
    onCollectionUpdated: (sourceCollection: any) => {
      for (const [source, reading] of sourceCollection) {
        console.log(`${source.userData.id}`);
        inRangeCache = reading.inRange;
        if (reading.inRange) {
          checkEnableSweeps(sdk, textElement);
        }
        else {
          checkDisableSweeps(sdk, textElement);
        }
      }      
    }
  });

  checkDisableSweeps(sdk, textElement);
};

main();
