
export enum SceneEvents {
  /**
   * Application state change events.
   */
  GoToTutorial = 'GoToTutorial',
  StartGame = 'StartGame',
  EndGame = 'EndGame',

  /**
   * Fired when a phaser scene is started.
   */
  SceneStart = 'SceneStart',

  /**
   * Animate a rabbit from a given screen coordiante.
   */
  StartRabbit = 'StartRabbit',

  /**
   * Hint display event
   */
  DisplayHint = 'DisplayHint',

  /**
   * Sent when the capture animation is complete
   */
  CaptureComplete = 'CaptureComplete'
}
