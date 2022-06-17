import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Main } from './components/Main';
import './main.css';
import { AppState, items, slots } from './AppState';

const appState = new AppState();
appState.items = items;
appState.slots = slots;

const container = document.getElementById("content");
const root = ReactDOMClient.createRoot(container);
root.render(  <Main appState={appState}/>);
