import React, { Component } from 'react';
import { Frame, GetSDK, sdkKey } from '@mp/common';
import { Game, Types, Events } from 'phaser';
import { WelcomeScene } from '../scenes/WelcomeScene';
import { GameScene } from '../scenes/GameScene';
import { SceneIds } from '../scenes/SceneIds';
import { ISceneConfig } from '../interfaces';
import { SceneTransitions } from '../scenes/SceneTransitions';
import { TutorialScene } from '../scenes/TutorialScene';
import { InstructionsView } from './InstructionsView';
import { SceneEvents } from '../scenes/SceneEvents';
import { TutorialView } from './TutorialView';
import { GameView } from './GameView';
import { GameOverView } from './GameOverView';
import { MakeGameState } from '../GameState';
import { GameOverScene } from '../scenes/GameOverScene';
import { bunnyCaptureType, createBunnyCaptureClosure } from '../scene-components/BunnyCapture';
import { bunnySelectorSphereType, createBunnySelectorClosure } from '../scene-components/BunnySelectorSphere';
import bunnies from '../bunnies.json';

export const ModelSid = 'H3QvzfsVQHq';

// Vendor specific full screen functions
declare global {
  interface Document {
    readonly fullscreenElement?: Element;
    readonly mozFullScreenElement?: Element;
    readonly webkitFullscreenElement?: Element;
    readonly msFullscreenElement?: Element;

    readonly fullscreenEnabled: boolean;
    readonly mozFullScreenEnabled?: boolean;
    readonly webkitFullscreenEnabled?: boolean;
    readonly msFullscreenEnabled?: boolean;

    mozCancelFullScreen?(): void;
    webkitExitFullscreen?(): void;
    msExitFullscreen?(): void;
  }
  interface Element {
    mozRequestFullScreen?(): void;
    webkitRequestFullscreen?(): void;
    msRequestFullscreen?(): void;
  }

}

interface State {
  currentScene: SceneIds;
  sceneConfig: ISceneConfig|null;
}

export class MainView extends Component<{}, State> {
  private sdk: any = null;
  private game: Game = null;
  // hard coding the total number of bunnies to win
  private winningCaptureTotal = 10;
  private rootRef: React.RefObject<HTMLDivElement>;
  private queryString: string = '';
  private sdkKey: string = sdkKey;

  constructor(props: {}) {
    super(props);
    this.rootRef = React.createRef<HTMLDivElement>();

    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('m')) {
      urlParams.set('m', ModelSid);
    }
    // ensure applicationKey is inserted into the bundle query string
    if (urlParams.has('applicationKey')) {
      this.sdkKey = urlParams.get('applicationKey');
    }
    else {
      urlParams.set('applicationKey', this.sdkKey);
    }

    this.queryString = urlParams.toString();
    this.state = {
      currentScene: SceneIds.Welcome,
      sceneConfig: null,
    }
  }

  async componentDidMount() {
    this.sdk = await GetSDK('sdk-iframe', this.sdkKey);

    const iframeElement = document.getElementById('sdk-iframe') as HTMLIFrameElement;
    const stylesheet = document.createElement("link");
    stylesheet.rel = 'stylesheet';
    stylesheet.type = 'text/css';
    stylesheet.href = '../assets/showcase.css';
    iframeElement.contentDocument.getElementsByTagName('head')[0].appendChild(stylesheet)

    let phaserCanvas: HTMLCanvasElement = document.getElementById('phaser-canvas') as HTMLCanvasElement;

    const container = iframeElement.contentDocument.querySelector<HTMLDivElement>('#canvas-container');

    const config: Types.Core.GameConfig = {
      type: Phaser.CANVAS,
      parent: container,
      scene: [WelcomeScene, TutorialScene, GameScene, GameOverScene],
      canvas: phaserCanvas,
      canvasStyle: 'width: 100%; height: 100%; position: absolute; pointer-events: none',
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
        },
      },
      render: {
        transparent: true,
      },
      width: container.clientWidth * window.devicePixelRatio,
      height: container.clientHeight * window.devicePixelRatio,
    };

    (window as any).getPose = this.sdk.Camera.getPose;
    this.game = new Game(config);
    this.game.sound.pauseOnBlur = false;

    const eventBus = new Events.EventEmitter();
    const gameState = MakeGameState();
    const sceneConfig: ISceneConfig = {
      game: this.game,
      eventBus,
      gameState: gameState,
      sdk: this.sdk
    };

    await Promise.all([
      this.sdk.Settings.update('features/measurements', false),
      this.sdk.Settings.update('features/mattertags', false),
      this.sdk.Settings.update('highlight_reel', false),
      this.sdk.Scene.register(bunnySelectorSphereType, createBunnySelectorClosure(eventBus, this.sdk)),
      this.sdk.Scene.register(bunnyCaptureType, createBunnyCaptureClosure(gameState, eventBus, this.sdk)),
    ]);

    const nodes = await this.sdk.Scene.deserialize(JSON.stringify(bunnies));

    // set initial values of capture state
    gameState.captured.value = 0;
    gameState.total.value = this.winningCaptureTotal;

    for (let i = 0; i < nodes.length; ++i) {
      nodes[i].start();
    }

    sceneConfig.eventBus.addListener(SceneEvents.SceneStart, function(payload: any) {
      this.setState({ currentScene: payload.sceneId });
    }, this);

    this.setState({ sceneConfig: sceneConfig });
    this.game.scene.start(SceneIds.Welcome, sceneConfig);

    new SceneTransitions(sceneConfig);

    this.hackFullscreen(iframeElement);
  }

  render() {
    const src = `./bundle/showcase.html?${this.queryString}&play=1&title=0&vr=0&fp=0&qs=1&dh=0&sr=3.08,-.02&ss=92&maxmeshq=256&maxtileq=2048&maxztileq=2048`;
    const { currentScene, sceneConfig } = this.state;

    const renderState = function() {
      switch(currentScene) {
        case SceneIds.Welcome:
          return (<InstructionsView config={sceneConfig}></InstructionsView>);
        case SceneIds.Tutorial:
          return (<TutorialView config={sceneConfig}></TutorialView>);
        case SceneIds.Game:
          return (<GameView config={sceneConfig}></GameView>);
        case SceneIds.GameOver:
          return (<GameOverView config={sceneConfig}></GameOverView>);
      }

      return null;
    };

    return (
      <div ref={this.rootRef}>
        { sceneConfig ? renderState() : null}
        <Frame src={src}></Frame>
      </div>
    );
  }

  private hackFullscreen(iframeElement: HTMLIFrameElement) {
    const fsElement = iframeElement.contentDocument.querySelector('#fullscreen-mode .icon-fullscreen');
    // if there is no fullscreen button, fullscreen probably isn't supported
    if (!fsElement) return;
    fsElement.addEventListener('click', (ev) => {
      if (!this.rootRef) return;
      ev.stopImmediatePropagation();
      ev.stopPropagation();
      const rootElem = this.rootRef.current;

      const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
      const requestFullscreen = rootElem.requestFullscreen || rootElem.webkitRequestFullscreen || rootElem.mozRequestFullScreen || rootElem.msRequestFullscreen;
      const exitFullscreen    = document.exitFullscreen    || document.webkitExitFullscreen    || document.mozCancelFullScreen  || document.msExitFullscreen;

      if (fullscreenElement) {
        exitFullscreen.call(document);
        fsElement.classList.remove('icon-fullscreen-exit');
        fsElement.classList.add('icon-fullscreen');
      } else {
        requestFullscreen.call(rootElem);
        fsElement.classList.remove('icon-fullscreen');
        fsElement.classList.add('icon-fullscreen-exit');
      }
    }, true);
  }
}
