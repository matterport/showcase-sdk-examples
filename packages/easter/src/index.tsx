import * as React from 'react';
import * as ReactDom from 'react-dom';
import { MainView } from './react-components/MainView';
import './main.css';

ReactDom.render(<MainView/>, document.getElementById("content"));
