import { SceneEvents } from './SceneEvents';
import { SceneIds } from './SceneIds';
import { ISceneConfig } from '../interfaces';

const transitionMap: {[scendId: string]: {[eventId: string]: string}} = {
  [SceneIds.Welcome]: {
    [SceneEvents.GoToTutorial]: SceneIds.Tutorial,
  },
  [SceneIds.Tutorial]: {
    [SceneEvents.StartGame]: SceneIds.Game,
  },
  [SceneIds.Game]: {
    [SceneEvents.EndGame]: SceneIds.GameOver,
  },
  [SceneIds.GameOver]: {},
};

function handleEvent(event: string, config: ISceneConfig) {
  let activeSceneKey: string = null;
  for (const scene of config.game.scene.scenes) {
    if (typeof scene.sys.config == "string" ) { continue; }
    if (config.game.scene.isActive(scene.sys.config.key)) {
      activeSceneKey = scene.sys.config.key;
      break;
    }
  }

  const transitions = transitionMap[activeSceneKey];
  if (transitions && transitions[event]) {
    config.game.scene.stop(activeSceneKey);
    config.game.scene.start(transitions[event], config);
    config.eventBus.emit(SceneEvents.SceneStart, {
      sceneId: transitions[event],
    })
  }
}

export class SceneTransitions {
  constructor(private config: ISceneConfig) {
    for (const event in SceneEvents) {
      this.config.eventBus.on(event, function() {
        handleEvent(event, this.config);
      }, this);
    }
  }
}
