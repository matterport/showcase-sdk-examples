import type { MpSdk } from 'embedtypes/sdk';
import { clearMesssage, connect, setMessage } from '../common';
import '../common/main.css';
import sourceDescs from './sources.json';

const main = async () => {
  const sdk: MpSdk = await connect({
    urlParams: {
      qs: '1',
      play: '1',
      title: '0',
    },
  });

  const textElement = document.getElementById('text') as HTMLDivElement;

  const sensor = await sdk.Sensor.createSensor(sdk.Sensor.SensorType.CAMERA);
  sensor.showDebug(true);

  sensor.readings.subscribe({
    onCollectionUpdated: (sourceCollection) => {
      const inRange: unknown[] = [];
      for (const [source, reading] of sourceCollection) {
        if (reading.inRange) {
          const search = inRange.find((element) => {
            return element === source.userData.id;
          });
          if (!search) {
            inRange.push(source.userData.id);
          }
        }

        console.log('sensor id', source.userData.id, 'inRange', reading.inRange, 'inView', reading.inView);
      }

      if (inRange.length > 0) {
        setMessage(textElement, inRange.toString());
      } else {
        clearMesssage(textElement);
      }
    },
  });

  const sourcePromises: Promise<any>[] = [];
  for (const desc of sourceDescs) {
    switch (desc.type as MpSdk.Sensor.SourceType) {
      case sdk.Sensor.SourceType.BOX:
        sourcePromises.push(sdk.Sensor.createSource(sdk.Sensor.SourceType.BOX, desc.options));
        break;
      // Example of handling a sphere source and setting types correctly.
      case sdk.Sensor.SourceType.SPHERE:
        sourcePromises.push(sdk.Sensor.createSource(sdk.Sensor.SourceType.SPHERE, desc.options));
        break;
      // Example of handling a cylinder source and setting types correctly.
      case sdk.Sensor.SourceType.CYLINDER:
        sourcePromises.push(sdk.Sensor.createSource(sdk.Sensor.SourceType.CYLINDER, desc.options));
        break;
    }
  }
  const sources = await Promise.all(sourcePromises);
  sensor.addSource(...sources);
};

main();
