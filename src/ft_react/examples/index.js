import { jsx } from '../supereact/index.js';
import { createRoot } from '../supereact-dom/index.js';

// 함수형 컴포넌트 정의
function Counter(props) {
  return {
    type: 'div',
    props: {
      children: [
        {
          type: 'h1',
          props: { children: `Counter: ${props.count || 0}` },
        },
        {
          type: 'button',
          props: {
            onclick: () => {
              // 업데이트 테스트
              root.render({
                type: Counter,
                props: { count: (props.count || 0) + 1 },
              });
            },
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
