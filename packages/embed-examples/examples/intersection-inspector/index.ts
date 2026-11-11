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

  // Sensor debug volumes are SDK-injected geometry; pointing at them reports
  // object: intersectedobject.unknown.
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

  // The Embed SDK exposes no click-in-3D event, so there's no click to capture a point with.
  // Instead we watch for a dwell — a gap in the intersection stream — and reveal the marker at
  // the settled point to click.
  const marker = document.createElement('button');
  marker.type = 'button';
  marker.classList.add('inspector-marker');
  container.appendChild(marker);

  const panel = document.createElement('div');
  panel.classList.add('inspector-panel');
  panel.innerHTML = `
    <h4 class="inspector-title">Intersection Inspector</h4>
    <p class="inspector-hint">Point at the model, a tag, a sweep, or a debug volume. Pause on a spot, then click the marker to pin its reading.</p>
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

  // How long the pointer must hold still before the marker appears. The delay also lets
  // ordinary navigation clicks reach Showcase, since the marker only exists once you settle.
  const dwellMs = 500;

  // Recent pins kept in the fading trail.
  const maxPins = 5;
  const trailPalette = ['#6cf2a0', '#4dd2ff', '#ffd166', '#ff6b6b', '#c792ea', '#f78c6c'];

  let latestIntersection: MpSdk.Pointer.Intersection | undefined;
  let latestPose: MpSdk.Camera.Pose | undefined;
  let dwellTimer: number | undefined;
  let pinCount = 0;

  const pins: Array<{ position: MpSdk.Vector3; color: string }> = [];
  const trailDots = Array.from({ length: maxPins }, () => {
    const dot = document.createElement('div');
    dot.classList.add('inspector-trail-dot');
    container.appendChild(dot);
    return dot;
  });

  function positionMarker() {
    if (!latestIntersection || !latestPose) {
      return;
    }
    const iframe = document.getElementById('sdk-frame') as HTMLIFrameElement;
    const size = { w: iframe.clientWidth, h: iframe.clientHeight };
    const coord = mpSdk.Conversion.worldToScreen(latestIntersection.position, latestPose, size);
    marker.style.transform = `translate(${coord.x}px, ${coord.y}px)`;
  }

  // Place and color each pin's trail dot, hiding those off screen, and list the on-screen pins.
  function renderTrail() {
    const pose = latestPose;
    if (!pose) {
      return;
    }
    const iframe = document.getElementById('sdk-frame') as HTMLIFrameElement;
    const size = { w: iframe.clientWidth, h: iframe.clientHeight };
    const rows: string[] = [];
    trailDots.forEach((dot, i) => {
      const pin = pins[i];
      if (!pin) {
        dot.style.opacity = '0';
        return;
      }
      const coord = mpSdk.Conversion.worldToScreen(pin.position, pose, size);
      // Only draw a pin while it projects inside the viewport.
      const onScreen = coord.x >= 0 && coord.x <= size.w && coord.y >= 0 && coord.y <= size.h;
      dot.style.background = pin.color;
      dot.style.transform = `translate(${coord.x}px, ${coord.y}px)`;
      // Fade older pins: index 0 full opacity, oldest down to 0.5.
      dot.style.opacity = onScreen ? `${1 - (0.5 * i) / Math.max(maxPins - 1, 1)}` : '0';
      if (onScreen) {
        rows.push(`<span style="color: ${pin.color}">${formatPoint(pin.position)}</span>`);
      }
    });
    fields.pinned.innerHTML = rows.length ? `Pinned<br>${rows.join('<br>')}` : '';
  }

  mpSdk.Camera.pose.subscribe((pose) => {
    latestPose = pose;
    // Keep a visible marker on its point as the camera moves.
    if (marker.classList.contains('visible')) {
      positionMarker();
    }
    renderTrail();
  });

  mpSdk.Pointer.intersection.subscribe((intersection) => {
    latestIntersection = intersection;
    fields.object.innerText = intersection.object;
    fields.position.innerText = formatPoint(intersection.position);
    fields.normal.innerText = formatPoint(intersection.normal);
    fields.floor.innerText = intersection.floorIndex === undefined ? '—' : `${intersection.floorIndex}`;

    // A new intersection means the pointer moved: hide the marker and restart the dwell timer.
    marker.classList.remove('visible');
    window.clearTimeout(dwellTimer);
    dwellTimer = window.setTimeout(() => {
      if (!latestIntersection || latestIntersection.object === mpSdk.Pointer.Colliders.NONE) {
        return;
      }
      positionMarker();
      marker.classList.add('visible');
    }, dwellMs);
  });

  // Marker sits on the hit point, so clicking it pins exactly the settled reading.
  marker.addEventListener('click', () => {
    if (!latestIntersection) {
      return;
    }
    // Newest pin to the front with the next palette color; drop the oldest past maxPins.
    pins.unshift({ position: { ...latestIntersection.position }, color: trailPalette[pinCount % trailPalette.length] });
    pinCount += 1;
    if (pins.length > maxPins) {
      pins.pop();
    }
    renderTrail();
    marker.classList.remove('visible');
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
