import { interfaceVersion } from "@mp/common";
import type { MpSdk } from '../../bundle/sdk';

interface ShowcaseWindow extends Window {
  MP_SDK: {
    connect(iframe: HTMLIFrameElement, applicationKey: string, version: string): Promise<MpSdk>;
  };
}

export type Sdk = MpSdk;

export interface ISdk {
  init(applicationKey: string): void;
  sdk: MpSdk;
  onChanged(callback: (sdk: MpSdk) => void): void;
}

export function makeSdk(elementId: string): ISdk {
  return new SdkLoader(elementId);
}

class SdkLoader implements ISdk {
  private callback: (sdk: MpSdk) => void;
  public sdk: MpSdk;

  constructor(private elementId: string) {}

  public init(applicationKey: string) {
    const that = this;
    const checkIframe = function() {
      const iframe = document.getElementById(that.elementId) as HTMLIFrameElement | null;
      if (iframe) {
        const showcaseWindow = iframe.contentWindow as ShowcaseWindow | null;
        if (showcaseWindow?.MP_SDK) {
          clearInterval(intervalId);

          showcaseWindow.MP_SDK.connect(iframe, applicationKey, interfaceVersion).then((sdk) => {
            that.sdk = sdk;
            console.log(that.sdk);
            if (that.callback) {
              that.callback(sdk);
            }
          });
        }
      }
    };

    const intervalId = setInterval(checkIframe, 100);
  }

  public onChanged(callback: (sdk: MpSdk) => void): void {
    this.callback = callback;
  }
}

