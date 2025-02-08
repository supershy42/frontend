import { jsx } from '../supereact/index.js';
import { createRoot } from '../supereact-dom/index.js';

const container = document.getElementById('root');
const root = createRoot(container);

const element = jsx('div', {
  className: 'test',
  children: [
    jsx('h1', { children: 'Hello World' }),
    jsx('p', { children: 'This is a test' }),
  ],
});

root.render(element);
