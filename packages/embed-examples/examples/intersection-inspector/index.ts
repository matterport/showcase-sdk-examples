import type { MpSdk } from 'embedtypes/sdk';
import tags from './tags.json';
import sourceDescs from './sources.json';
import { connect } from '../common';
import '../common/main.css';
import './style.css';

const container = document.querySelector('.container') as HTMLDivElement;

function formatPoint(point: MpSdk.Vector3) {
  return `${point.x.toFixed(3)}, ${point.y.toFixed(3)}, ${point.z.toFixed(3)}`;
}

async function inspect(mpSdk: MpSdk) {
  // Seed a few tags so the pointer can intersect them (object: intersectedobject.tag).
  await mpSdk.Tag.add(...tags);

  // Draw Sensor debug volumes — SDK-added 3D geometry. Point at them to see what
  // the intersection reports for geometry the SDK injects (object: intersectedobject.unknown).
  const sensor = await mpSdk.Sensor.createSensor(mpSdk.Sensor.SensorType.CAMERA);
  const sources = await Promise.all(
    sourceDescs.map((desc) => {
      switch (desc.type as MpSdk.Sensor.SourceType) {
        case mpSdk.Sensor.SourceType.SPHERE:
          return mpSdk.Sensor.createSource(mpSdk.Sensor.SourceType.SPHERE, desc.options);
        case mpSdk.Sensor.SourceType.BOX:
          return mpSdk.Sensor.createSource(mpSdk.Sensor.SourceType.BOX, desc.options);
        default:
          throw new Error(`Unsupported source type: ${desc.type}`);
      }
    })
  );
  sensor.addSource(...sources);
  sensor.showDebug(true);

  const marker = document.createElement('div');
  marker.classList.add('inspector-marker');
  container.appendChild(marker);

  const panel = document.createElement('div');
  panel.classList.add('inspector-panel');
  panel.innerHTML = `
    <h4 class="inspector-title">Intersection Inspector</h4>
    <p class="inspector-hint">Point at the model, a tag, a sweep, or a debug volume. Click to pin a reading.</p>
    <dl class="inspector-readout">
      <dt>Object</dt><dd data-field="object">—</dd>
      <dt>Position</dt><dd data-field="position">—</dd>
      <dt>Normal</dt><dd data-field="normal">—</dd>
      <dt>Floor</dt><dd data-field="floor">—</dd>
    </dl>
    <p class="inspector-pinned" data-field="pinned"></p>
  `;
  container.appendChild(panel);

  const fields = {
    object: panel.querySelector('[data-field="object"]') as HTMLElement,
    position: panel.querySelector('[data-field="position"]') as HTMLElement,
    normal: panel.querySelector('[data-field="normal"]') as HTMLElement,
    floor: panel.querySelector('[data-field="floor"]') as HTMLElement,
    pinned: panel.querySelector('[data-field="pinned"]') as HTMLElement,
  };

  let latestIntersection: MpSdk.Pointer.Intersection | undefined;
  let latestPose: MpSdk.Camera.Pose | undefined;

  // Reproject the world-space hit point to screen pixels and place the marker.
  // Runs on every intersection change and every camera move — no polling loop.
  function updateMarker() {
    const iframe = document.getElementById('sdk-frame') as HTMLIFrameElement;
    const overModel = latestIntersection?.object === mpSdk.Pointer.Colliders.MODEL;
    if (!latestIntersection || !latestPose || !overModel) {
      marker.classList.remove('visible');
      return;
    }

    const size = { w: iframe.clientWidth, h: iframe.clientHeight };
    const coord = mpSdk.Conversion.worldToScreen(latestIntersection.position, latestPose, size);
    marker.style.transform = `translate(${coord.x}px, ${coord.y}px)`;
    marker.classList.add('visible');
  }

  mpSdk.Camera.pose.subscribe((pose) => {
    latestPose = pose;
    updateMarker();
  });

  mpSdk.Pointer.intersection.subscribe((intersection) => {
    latestIntersection = intersection;
    fields.object.innerText = intersection.object;
    fields.position.innerText = formatPoint(intersection.position);
    fields.normal.innerText = formatPoint(intersection.normal);
    fields.floor.innerText = intersection.floorIndex === undefined ? '—' : `${intersection.floorIndex}`;
    updateMarker();
  });

  panel.addEventListener('click', () => {
    if (!latestIntersection || latestIntersection.object !== mpSdk.Pointer.Colliders.MODEL) {
      return;
    }
    fields.pinned.innerText = `Pinned: ${formatPoint(latestIntersection.position)}`;
  });
}

const main = async () => {
  const sdk: MpSdk = await connect({
    urlParams: {
      m: 'j4RZx7ZGM6T',
      play: '1',
      qs: '1',
      title: '0',
      help: '0',
    },
  });
  inspect(sdk);
};
main();
