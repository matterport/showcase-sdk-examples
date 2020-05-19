import React, { Component } from 'react';
import { ISceneConfig } from '../interfaces';
import { SceneEvents } from '../scenes/SceneEvents';

interface Props {
  config: ISceneConfig,
}

export class TutorialView extends Component<Props, {}> {
  constructor(props: Props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.config.eventBus.emit(SceneEvents.StartGame);
  }

  render() {
    return (
      <div className='overlay-container tutorial'>
        <div className='text-wrapper'>
          <div className='title'>Tutorial</div>
          <iframe className='video'
            src="https://www.youtube.com/embed/VZH1qNXeN7I?rel=0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          />
          <button type='button' onClick={this.onClick}>Get Started</button>
        </div>
      </div>
    );
  }
}
