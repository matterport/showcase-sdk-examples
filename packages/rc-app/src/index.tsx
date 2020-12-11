import './main.css';

import React from 'react';
import * as ReactDom from 'react-dom';

import { PhotonClient } from './PhotonClient';
import { ClientContext } from './components/Context';
import { Main } from './components/Main';
import { IContext } from './types';
import { RemoteSimulator } from './simulator/RemoteSimulator';
import { LocalSimulator } from './simulator/LocalSimulator';
import { sdkKey } from '@mp/common';

const urlParams = new URLSearchParams(window.location.search);
const applicationKey = urlParams.get('applicationKey') || sdkKey;

const photonClient = new PhotonClient();
const hostSimulator = new LocalSimulator(photonClient, applicationKey);
const clientSimulator = new RemoteSimulator(photonClient, applicationKey);

const context: IContext = {
  photonClient: photonClient,
  sdkClient: clientSimulator,
  sdkHost: hostSimulator,
};

ReactDom.render(
  <ClientContext.Provider value={context}>
    <Main />
  </ClientContext.Provider>,
  document.getElementById('content')
);
