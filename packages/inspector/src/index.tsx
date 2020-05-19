import * as ReactDOM from 'react-dom';
import * as React from 'react';
import Main from './components/Main';
import { makeSdk } from './Sdk';
import { makeScene } from './Scene';

const sdk = makeSdk('sdk-iframe');
sdk.init();

const scene = makeScene(sdk);

ReactDOM.render(
    <Main sdk={sdk} scene={scene}/>,
    document.getElementById("content")
);

