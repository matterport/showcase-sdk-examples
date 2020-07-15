
const SDK_VERSION = '3.2';

export const GetSDK = function(elementId: string|HTMLIFrameElement, applicationKey: string): Promise<any> {
  return new Promise(function(resolve, reject) {
    const checkIframe = async function() {
      var iframe = null;
      if (elementId instanceof HTMLIFrameElement) {
        iframe = elementId as HTMLIFrameElement;
      }
      else {
        iframe = document.getElementById(elementId);
      }

      if (iframe && (iframe as any).contentWindow.MP_SDK) {
        clearInterval(intervalId);

        const sdk = await (iframe as any).contentWindow.MP_SDK.connect(iframe, applicationKey, SDK_VERSION);
        resolve(sdk);
        console.log(sdk);
      }
    };
    const intervalId = setInterval(checkIframe, 100);
  });
}
