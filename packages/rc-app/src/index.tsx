import './main.css';

import React from 'react';
import * as ReactDOMClient from 'react-dom/client';

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

const container = document.getElementById("content");
const root = ReactDOMClient.createRoot(container);
root.render(
  <ClientContext.Provider value={context}>
    <Main />
  </ClientContext.Provider>
);
