import { SceneComponent } from '../SceneComponent';

class VolPlayer extends SceneComponent {
  private hologram: any = null;
  constructor(private sdk: any) {
    super();
    console.log(this.sdk);
  }

  onInit(): void {
    global.THREE = this.context.three;
    const loader = new this.context.three.Loader();
    console.log(loader);

    const head = document.getElementsByTagName('head').item(0);
    const script = document.createElement('script') as HTMLScriptElement;
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', 'https://player.8i.com/release/2.8.21/volcap-player.js?hash=60130a7abcaa0769e788');

    head.appendChild(script);
  }

  onTick(tickDelta: number): void {
    if (!this.hologram) {
      if ((window as any).EightiHologram) {
        const opts = {
          loop: true,
          autoplay: true,
          muted: false,
        };

        this.hologram = new (window as any).EightiHologram(
          'https://assets.8i.com/buzzlabs/BuzzLabs_S01A_T02_v01/manifest.mpd',
          this.context.scene,
          this.context.renderer,
          (this.context as any).camera,
          opts);

        this.hologram.mesh.visible = true;
        this.hologram.mesh.position.set(0,0,0);
        
        this.hologram.oncanplay = () => {
          this.hologram.play();
        }
      }
    }
    else {
      this.hologram.update(tickDelta);
    }
  }
}

export const volPlayerType = 'mp.volPlayer';
export const makeVolPlayer = function(sdk: any) {
  return () => {
    return new VolPlayer(sdk);
  };
}
