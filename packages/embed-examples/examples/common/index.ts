import { interfaceVersion, sdkKey } from '@mp/common';

declare global {
  interface Window {
    MP_SDK: any;
  }
}

type ConnectOptions = {
  urlParams?: {[key: string]: string};
};

export async function connect(options: ConnectOptions = {}): Promise<any> {
  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.has('m')) {
    urlParams.set('m', 'j4RZx7ZGM6T');
  }

  let applicationKey = sdkKey;
  if (urlParams.has('applicationKey')) {
    applicationKey = urlParams.get('applicationKey');
  }

  let apiHost = 'https://my.matterport.com';
  if (urlParams.has('apiHost')) {
    apiHost = urlParams.get('apiHost');
  }

  for(const key in options.urlParams) {
    if (!urlParams.has(key)) {
      urlParams.set(key, options.urlParams[key]);
    }
  }

  const iframe = document.getElementById('sdk-frame') as HTMLIFrameElement;
  const embedUrl = `${apiHost}/show/?${urlParams.toString()}`;

  iframe.src = embedUrl;
  const sdk = await window.MP_SDK.connect(iframe, applicationKey, interfaceVersion);

  await sdk.App.state.waitUntil(
    (state: any) => state.phase === sdk.App.Phase.PLAYING
  );

  return sdk;
}

export function setMessage(element: HTMLDivElement, message: string) {
  element.classList.remove('hidden');
  element.classList.add('visible');
  element.innerText = message;
}

export function clearMesssage(element: HTMLDivElement) {
  element.classList.remove('visible');
  element.classList.add('hidden');
}