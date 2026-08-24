import type { MpSdk, ShowcaseBundleWindow } from '../../bundle/sdk';

// applicationKey is read from the iframe's query string by the bundle itself,
// so it's not needed in the connect call. It remains in the GetSDK signature
// so existing callers don't have to change.
export const GetSDK = function (elementId: string | HTMLIFrameElement, _applicationKey: string): Promise<MpSdk> {
  return new Promise(function (resolve, reject) {
    const checkIframe = async function () {
      let iframe: HTMLIFrameElement | null = null;
      if (elementId instanceof HTMLIFrameElement) {
        iframe = elementId;
      } else {
        iframe = document.getElementById(elementId) as HTMLIFrameElement | null;
      }

      if (iframe) {
        const showcaseWindow = iframe.contentWindow as ShowcaseBundleWindow | null;
        if (showcaseWindow?.MP_SDK) {
          clearInterval(intervalId);

          const sdk = await showcaseWindow.MP_SDK.connect(showcaseWindow);
          resolve(sdk);
          console.log(sdk);
        }
      }
    };
    const intervalId = setInterval(checkIframe, 100);
  });
};
