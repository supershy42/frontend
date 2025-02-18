import { jsx } from '../supereact/index.js';
import { createRoot } from '../supereact-dom/index.js';

const container = document.getElementById('root');
const root = createRoot(container);

const element = {
  type: 'div',
  props: {
    children: [
      {
        type: 'h1',
        props: { children: 'Counter: 0' },
      },
      {
        type: 'button',
        props: {
          onclick: () => {
            // 업데이트 테스트
            root.render({
              type: 'div',
              props: {
                children: [
                  {
                    type: 'h1',
                    props: { children: 'Counter: 1' },
                  },
                  {
                    type: 'button',
                    props: {
                      onclick: () => {
                        /* ... */
                      },
                      children: 'Increment',
                    },
                  },
                ],
              },
            });
          },
          children: 'Increment',
        },
      },
    ],
  },
};

root.render(element);
