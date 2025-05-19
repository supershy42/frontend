import {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from '../supereact/index.js';
import { createRoot } from '../supereact-dom/index.js';

function HooksDemo() {
  // useState 예제
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // useMemo 예제
  const expensiveComputation = useMemo(() => {
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += count;
    }
    return result;
  }, [count]);

  // useCallback 예제
  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  const handleTextChange = useCallback((e) => {
    setText(e.target.value);
  }, []);

  // useEffect 예제
  useEffect(() => {
    console.log('Component mounted or count updated:', count);
    return () => {
      console.log('Cleanup for count:', count);
    };
  }, [count]);

  return {
    type: 'div',
    props: {
      style: {
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
      },
      children: [
        {
          type: 'h1',
          props: { children: 'Hooks Demo' },
        },
        {
          type: 'div',
          props: {
            children: [
              {
                type: 'p',
                props: { children: `Count: ${count}` },
              },
              {
                type: 'p',
                props: {
                  children: `Expensive computation: ${expensiveComputation}`,
                },
              },
              {
                type: 'button',
                props: {
                  onClick: handleClick,
                  style: {
                    padding: '8px 16px',
                    background: 'blue',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  },
                  children: 'Increment Count',
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { marginTop: '20px' },
            children: [
              {
                type: 'input',
                props: {
                  type: 'text',
                  value: text,
                  onChange: handleTextChange,
                  placeholder: 'Type something...',
                  style: {
                    padding: '8px',
                    width: '100%',
                    marginBottom: '10px',
                  },
                },
              },
              {
                type: 'p',
                props: { children: `Text input: ${text}` },
              },
              {
                type: 'p',
                props: {
                  children:
                    'Notice: typing here does not trigger the expensive computation',
                },
              },
            ],
          },
        },
      ],
    },
  };
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render({
  type: HooksDemo,
  props: {},
});
