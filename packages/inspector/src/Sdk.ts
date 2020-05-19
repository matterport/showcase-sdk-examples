import { sdkKey } from "@mp/common";

export interface ISdk {
  init(): void;
  sdk: any;
  onChanged(callback: (sdk: any) => void): void;
}

export function makeSdk(elementId: string): ISdk {
  return new Sdk(elementId);
}

class Sdk implements ISdk {
  private callback: (sdk: any) => void;
  public sdk: any;

  constructor(private elementId: string) {}

  public init() {
    const that = this;
    const checkIframe = function() {
      var iframe = document.getElementById(that.elementId);
      if (iframe && (iframe as any).contentWindow.MP_SDK) {
        clearInterval(intervalId);

        (iframe as any).contentWindow.MP_SDK.connect(iframe, sdkKey, '3.2').then((sdk: any) => {
          that.sdk = sdk;
          console.log(that.sdk);
          if (that.callback) {
            that.callback(sdk);
          }
        });
      }
    };

    const intervalId = setInterval(checkIframe, 100);
  }

  public onChanged(callback: (sdk: any) => void): void {
    this.callback = callback;
  }
}

