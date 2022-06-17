import { clearMesssage, connect, setMessage } from '../common';
import '../common/main.css';

let lowDetailTag: string[]|null = null;
let tags: string[]|null = null;

const createLowDetailTag = async (sdk: any) => {
  const tagInfo = [{
    label: 'Single tag',
    description: `Move closer to see more.`,
    anchorPosition: {
      x: 0,
      y: 1.3,
      z: -0.227,
    },
    stemVector: {
      x: 0,
      y: 0.1,
      z: 0,
    },
    color: {
      r: 0.0,
      g: 0.0,
      b: 1.0,
    },
  }];

  lowDetailTag = await sdk.Mattertag.add(tagInfo) as string[];
};

const removeLowDetailTag = (sdk: any) => {
  if (lowDetailTag !== null) {
    sdk.Mattertag.remove(lowDetailTag);
    lowDetailTag = null;
  }
};

const createTags = async (sdk: any) => {
  const tagInfos = [];
  const side = 1; // 1 meter
  const halfSide = side / 2;
  const center = {x: 0.15, y: 1.3, z: -0.227 };
  const tagPerSide = 4;
  const spacing = side / tagPerSide;

  for (let i=0; i<tagPerSide; i++) {
    for (let j=0; j<tagPerSide; j++) {
      tagInfos.push({
        label: `Tag ${i},${j}`,
        description: ``,
        anchorPosition: {
          x: center.x - halfSide + (i * spacing),
          y: center.y - halfSide + (j * spacing),
          z: center.z,
        },
        stemVector: {
          x: 0,
          y: 0.1,
          z: 0,
        },
        color: {
          r: 1.0,
          g: 0.0,
          b: 0.0,
        },
      });
    }
  }

  tags = await sdk.Mattertag.add(tagInfos) as string[];
};

const removeTags = (sdk: any) => {
  if (tags !== null) {
    sdk.Mattertag.remove(tags);
    tags = null;
  }
};

const main = async () => {
  const sdk = await connect({
    urlParams: {
      qs: '1',
      sr: '-.18,.03',
      ss: '57',
      play: '1',
      title: '0',
    },
  });
  const textElement = document.getElementById('text') as HTMLDivElement;
  const sensor = await sdk.Sensor.createSensor(sdk.Sensor.SensorType.CAMERA);
  sensor.showDebug(true);

  const source0 = await sdk.Sensor.createSource(sdk.Sensor.SourceType.SPHERE, {
    origin: { x: -0.101, y: 1, z: -0.99 },
    radius: 5,
    userData: {
      id: "Window Area Far",
    },
  });
  const source1 = await sdk.Sensor.createSource(sdk.Sensor.SourceType.SPHERE, {
    origin: { x: -0.101, y: 0.6, z: -0.99 },
    radius: 2,
    userData: {
      id: "Window Area Near",
    },
  });

  sensor.addSource(source0, source1);

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
      
      if (inRange.length === 1) {
        // far range
        setMessage(textElement, 'Single tag representing a cluster of tags');
        removeTags(sdk);
        createLowDetailTag(sdk);
      }
      else if (inRange.length === 2) {
        // near range
        setMessage(textElement, 'A cluster of tags');
        removeLowDetailTag(sdk);
        createTags(sdk);
      }
      else {
        clearMesssage(textElement);
        removeTags(sdk);
        removeLowDetailTag(sdk);
      }
    }
  });
};

main();
