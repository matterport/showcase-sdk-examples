import { clearMesssage, connect, setMessage } from '../common';
import '../common/main.css';

let tags: string[]|null = null;
let sub: any = null;

const addTags = async (sdk: any) => {
  if (tags) {
    return;
  }

  sub = sdk.Sweep.data.subscribe({
    onCollectionUpdated: async (collection: {[key: string]: any}) => {
      const tagInfos: any[] = Object.keys(collection).map((key: string) => {
        const sweep = collection[key];
        return {
          label: sweep.uuid,
          description: `x: ${sweep.position.x}\ny: ${sweep.position.y}\nz: ${sweep.position.z}`,
          anchorPosition: {
            x: sweep.position.x,
            y: sweep.position.y - 1.3,
            z: sweep.position.z,
          },
          stemVector: {
            x: 0,
            y: 1.0,
            z: 0,
          },
          color: {
            r: 0.0,
            g: 0.0,
            b: 1.0,
          },
        }
      });
      tags = await sdk.Mattertag.add(tagInfos) as string[];
      sub.cancel();
    },
  });
};

const removeTags = async (sdk: any) => {
  if (tags !== null) {
    sdk.Mattertag.remove(tags);
    tags = null;
  }
}

const main = async () => {
  const sdk = await connect({
    urlParams: {
      qs: '1',
      play: '1',
      title: '0',
    },
  });
  const textElement = document.getElementById('text') as HTMLDivElement;
  const sensor = await sdk.Sensor.createSensor(sdk.Sensor.SensorType.CAMERA);
  sensor.showDebug(true);

  const source = await sdk.Sensor.createSource(sdk.Sensor.SourceType.SPHERE, {
    origin: { x: -0.629, y: 1, z: 5.909 },
    radius: 2.5,
    userData: {
      id: "Displaying a tag over every sweep",
    },
  });

  sensor.addSource(source);

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
      }

      if (inRange.length > 0) {
        setMessage(textElement, inRange.toString());
        addTags(sdk);
      }
      else {
        clearMesssage(textElement);
        removeTags(sdk);
      }
    }
  });
};

main();
