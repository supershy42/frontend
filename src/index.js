import { jsx } from 'ft_react';
import { createRoot } from 'ft_react-dom';
import App from './App.jsx';
import './global.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
