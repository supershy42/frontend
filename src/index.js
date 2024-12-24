/** @jsx Supereact.createElement */
import Supereact from './Supereact/index.js';
import App from './App.jsx';
import './global.css';

const root = document.getElementById('root');
Supereact.render(<App />, root);
