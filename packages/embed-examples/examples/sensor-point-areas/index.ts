import { clearMesssage, connect, setMessage } from '../common';
import '../common/main.css';
import sourceDescs  from './sources.json';

const main = async () => {
  const sdk = await connect({
    urlParams: {
      qs: '1',
      play: '1',
      title: '0',
    }
  });

  const textElement = document.getElementById('text') as HTMLDivElement;

  const sensor = await sdk.Sensor.createSensor(sdk.Sensor.SensorType.CAMERA);
  sensor.showDebug(true);

  sensor.readings.subscribe({
    onCollectionUpdated: (sourceCollection: any) => {
      const inRange: any[] = [];
      for (const [source, reading] of sourceCollection) {
        if (reading.inRange) {
          const search = inRange.find((element) => {
            return element === source.userData.id;
          });
          if (!search) {
            inRange.push(source.userData.id);
          }
        }

        console.log(
          `sensor id: ${source.userData.id} inRange:${reading.inRange} inView:${reading.inView}`
        );
      }

      if (inRange.length > 0) {
        setMessage(textElement, inRange.toString());
      }
      else {
        clearMesssage(textElement);
      }
    }
  });

  const sourcePromises: Promise<any>[] = [];
  for (const desc of sourceDescs) {
    sourcePromises.push(sdk.Sensor.createSource(desc.type, desc.options));
  }

  const sources = await Promise.all(sourcePromises);
  sensor.addSource(...sources);
};

main();