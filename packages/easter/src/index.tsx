import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { MainView } from './react-components/MainView';
import './main.css';

const container = document.getElementById("content");
const root = ReactDOMClient.createRoot(container);
root.render(<MainView/>);
