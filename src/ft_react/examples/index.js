import { jsx, useState, useEffect } from '../supereact/index.js';
import { createRoot } from '../supereact-dom/index.js';

// 함수형 컴포넌트 정의
function Counter(props) {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('Mike');

  useEffect(() => {
    console.log('Component mounted or count changed:', count);

    // Optional cleanup function
    return () => {
      console.log('Cleanup before next effect or unmount:', count);
    };
  }, [count]); // Only re-run when count changes

  return {
    type: 'div',
    props: {
      children: [
        {
          type: 'h1',
          props: { children: `Counter: ${count}  Name: ${name}` },
        },
        {
          type: 'button',
          props: {
            onClick: () => setCount((c) => c + 1),
            children: 'Increment',
          },
        },
        {
          type: 'button',
          props: {
            onClick: () => setName('Jane'),
            children: 'Change Name',
          },
        }
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
