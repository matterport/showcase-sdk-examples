import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Main } from './components/Main';
import './main.css';
import { AppState, items, slots } from './AppState';

const appState = new AppState();
appState.items = items;
appState.slots = slots;

ReactDom.render(
  <Main appState={appState}/>,
  document.getElementById("content")
);
