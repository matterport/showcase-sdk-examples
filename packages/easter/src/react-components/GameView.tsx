import React, { Component } from 'react';
import { ISceneConfig } from '../interfaces';
import { TextView } from './TextView';
import { SceneEvents } from '../scenes/SceneEvents';
import { Types, Game, Scene, GameObjects } from 'phaser';
import { SceneIds } from '../scenes/SceneIds';

interface Props {
  config: ISceneConfig,
}

interface State {
  captured: number;
  total: number;
  time: number;
  timeString: string;
}


const secondsToString = function(seconds: number) {
  const date = new Date(null);
  date.setSeconds(seconds);
  return date.toISOString().substr(14, 5);
};

export class MiniScene extends Scene {
  private config: ISceneConfig = null;
  private rabbit: GameObjects.Sprite = null;

  constructor() {
    super({ key: SceneIds.Game });
    this.onCaptureComplete = this.onCaptureComplete.bind(this);
  }

  init(config: ISceneConfig): void {
    this.config = config;
    this.config.eventBus.addListener(SceneEvents.CaptureComplete, this.onCaptureComplete);
  }

  preload(): void {
    this.load.setBaseURL();
    this.load.spritesheet('rabbit', 'assets/capture_sprite.png', {
      frameWidth: 400,
      frameHeight: 400
    });
  }

  create(): void {
    this.rabbit = this.add.sprite(this.game.canvas.clientWidth/2, this.game.canvas.clientHeight/2, 'rabbit');
    const scale = Math.max(this.game.canvas.clientWidth, this.game.canvas.clientHeight) / 400;
    this.rabbit.scale = scale * 1.55;
  }

  onCaptureComplete() {
    const frames = this.anims.generateFrameNumbers('rabbit', { start: 0, end: 13 });

    // add the start frame to the end so it looks right
    frames.push(frames[0]);
    this.anims.create({
      key: 'captured',
      frames: frames,
      repeat: 0,
      showOnStart: true,
      hideOnComplete: false,
    });

    this.rabbit.anims.play('captured');
  }
}

export class GameView extends Component<Props, State> {
  private interval: number|null = null;
  private canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: Props) {
    super(props);

    this.canvasRef = React.createRef<HTMLCanvasElement>();

    this.state = {
      captured: props.config.gameState.captured.value,
      total: props.config.gameState.total.value,
      time: 0,
      timeString: secondsToString(0),
    }
    this.onTotalChanged = this.onTotalChanged.bind(this);
    this.onCapturedChanged = this.onCapturedChanged.bind(this);
    this.onTimeElapsed = this.onTimeElapsed.bind(this);
    this.onHintClicked = this.onHintClicked.bind(this);
    this.onScoreClicked = this.onScoreClicked.bind(this);
    this.onCaptureComplete = this.onCaptureComplete.bind(this);
  }

  componentDidMount() {
    this.props.config.gameState.captured.onChanged(this.onCapturedChanged);
    this.props.config.gameState.total.onChanged(this.onTotalChanged);
    this.props.config.eventBus.addListener(SceneEvents.CaptureComplete, this.onCaptureComplete);

    this.interval = setInterval(this.onTimeElapsed, 1000) as unknown as number;

    const config: Types.Core.GameConfig = {
      type: Phaser.CANVAS,
      scene: [MiniScene],
      canvas: this.canvasRef.current,
      width: this.canvasRef.current.clientWidth,
      height: this.canvasRef.current.clientHeight,

      transparent: true,
    };

    const game = new Game(config);
    game.scene.start(SceneIds.Game, this.props.config);
  }

  onCaptureComplete() {

  }

  onTimeElapsed() {
    const nextTime = this.state.time + 1;

    this.setState( {
      time: nextTime,
      timeString: secondsToString(nextTime),
    });
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    this.props.config.gameState.total.removeOnChanged(this.onTotalChanged);
    this.props.config.gameState.captured.removeOnChanged(this.onCapturedChanged);
  }

  onTotalChanged(total: number) {
    this.setState({ total: total });
  }

  onCapturedChanged(captured: number) {
    this.setState({ captured: captured });
  }

  onHintClicked() {
    this.props.config.eventBus.emit(SceneEvents.DisplayHint);
  }

  onScoreClicked() {
    if (this.props.config.gameState.debug.value) {
      this.props.config.eventBus.emit(SceneEvents.EndGame);
    }
  }

  render() {
    const { captured: count, total: maxCount, timeString } = this.state;

    const scoreString = `${count}/${maxCount}`;
    return (
      <div className='overlay-container no-pointer-events'>
        <div id='game-overlay'>
          <canvas
            className='basket'
            ref={this.canvasRef}
          />
          <div className='group-container'>
            <TextView className='timer' text={`Time: ${timeString}`}></TextView>
            <div className='score-container'>
              <TextView className='score' text={scoreString} onClicked={this.onScoreClicked}></TextView>
              <TextView className='score-desc' text='bunnies found'></TextView>
            </div>
            <TextView className='game-hint' text='Get a hint' onClicked={this.onHintClicked}></TextView>
          </div>
        </div>
      </div>
    );
  }
}
