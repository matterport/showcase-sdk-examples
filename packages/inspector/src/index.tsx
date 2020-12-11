import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { MainView } from './components/Main';
import { makeSdk } from './Sdk';
import { makeScene } from './Scene';
import { IContext, IDialogUser } from './interfaces';
import { AppContext } from './AppContext';
import { BehaviorSubject } from 'rxjs';
import { sdkKey } from "@mp/common";

const initialize = async () => {
  const sdk = makeSdk('sdk-iframe');
  const urlParams = new URLSearchParams(window.location.search);
  let applicationKey = sdkKey;
  if (urlParams.has('applicationKey')) {
    applicationKey = urlParams.get('applicationKey');
  }
  sdk.init(applicationKey);

  const scene = makeScene(sdk);
  const frameOverlay = new BehaviorSubject<IDialogUser|null>(null);

  const context: IContext = {
    scene,
    sdk,
    frameOverlay,
  };
    
  ReactDOM.render(
    <AppContext.Provider
      value={context}
    >
      <MainView/>
    </AppContext.Provider>,
    document.getElementById("content"));
};

initialize();
