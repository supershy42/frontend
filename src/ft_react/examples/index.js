import { jsx, useState } from '../supereact/index.js';
import { createRoot } from '../supereact-dom/index.js';

// 함수형 컴포넌트 정의
function Counter(props) {
  const [count, setState] = useState(0);

  return {
    type: 'div',
    props: {
      children: [
        {
          type: 'h1',
          props: { children: `Counter: ${count}` },
        },
        {
          type: 'button',
          props: {
            onClick: () => setState((c) => c + 1),
            children: 'Increment',
          },
        },
      ],
    },
  };
}

const container = document.getElementById('root');
const root = createRoot(container);

// Counter 컴포넌트 렌더링
root.render({
  type: Counter,
  props: { count: 0 },
});
