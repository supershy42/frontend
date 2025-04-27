import { useState, useEffect } from '../supereact/index.js';
import { createRoot } from '../supereact-dom/index.js';

// 조건부로 렌더링되는 자식 컴포넌트
function ChildComponent({ id, onRemove }) {
  useEffect(() => {
    console.log(`Child ${id} mounted`);

    return () => {
      console.log(`Child ${id} will unmount`);
    };
  }, []);

  return {
    type: 'div',
    props: {
      style: {
        margin: '10px',
        padding: '10px',
        border: '1px solid blue',
        borderRadius: '5px',
      },
      children: [
        {
          type: 'h3',
          props: { children: `Child ${id}` },
        },
        {
          type: 'button',
          props: {
            onClick: () => onRemove(id),
            style: {
              marginLeft: '10px',
              background: 'red',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer',
            },
            children: 'Remove',
          },
        },
      ],
    },
  };
}

// 메인 앱 컴포넌트
function App() {
  const [children, setChildren] = useState([1, 2, 3]);
  const [count, setCount] = useState(4);
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    console.log('App mounted or updated, children:', children);

    return () => {
      console.log('App cleanup');
    };
  }, [children]);

  // 새 자식 추가
  const addChild = () => {
    setChildren((prevChildren) => [...prevChildren, count]);
    setCount(count + 1);
  };

  // 특정 자식 제거
  const removeChild = (id) => {
    const newChildren = children.filter((childId) => childId !== id);
    setChildren(newChildren);
  };

  // 헤더 토글
  const toggleHeader = () => {
    console.log('toggleHeader called, current showHeader', showHeader);
    setShowHeader(!showHeader);
    console.log('toggleHeader: new value will be:', !showHeader);
  };

  return {
    type: 'div',
    props: {
      style: {
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px',
      },
      children: [
        // 조건부 헤더
        showHeader && {
          type: 'div',
          props: {
            style: {
              backgroundColor: '#f0f0f0',
              padding: '10px',
              marginBottom: '20px',
              borderRadius: '5px',
              border: '1px solid #FF0000',
            },
            children: [
              {
                type: 'h1',
                props: { children: 'Component Test' },
              },
              {
                type: 'p',
                props: {
                  children:
                    'This example tests node creation, updates, and removal.',
                },
              },
            ],
          },
        },

        // 컨트롤 버튼들
        {
          type: 'div',
          props: {
            style: {
              marginBottom: '20px',
              display: 'flex',
              gap: '10px',
            },
            children: [
              {
                type: 'button',
                props: {
                  onClick: addChild,
                  style: {
                    background: 'green',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  },
                  children: 'Add Child',
                },
              },
              {
                type: 'button',
                props: {
                  onClick: toggleHeader,
                  style: {
                    background: 'purple',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  },
                  children: showHeader ? 'Hide Header' : 'Show Header',
                },
              },
            ],
          },
        },

        // 자식 컴포넌트들
        {
          type: 'div',
          props: {
            style: {
              border: '1px dashed #ccc',
              padding: '10px',
              borderRadius: '5px',
            },
            children: children.map((id) => ({
              type: ChildComponent,
              props: { id, onRemove: removeChild, key: id },
            })),
          },
        },

        // 상태 정보 표시
        {
          type: 'div',
          props: {
            style: {
              marginTop: '20px',
              padding: '10px',
              backgroundColor: '#f8f8f8',
              borderRadius: '5px',
              fontSize: '14px',
              border: `1px solid ${showHeader ? '#FF0000' : '#00FF00'}`,
            },
            children: [
              {
                type: 'p',
                props: {
                  children: `Current number of children: ${children.length}`,
                },
              },
              {
                type: 'p',
                props: {
                  children: `Header is ${showHeader ? 'visible' : 'hidden'}`,
                },
              },
            ],
          },
        },
      ].filter(Boolean), // null/undefined 항목 제거
    },
  };
}

// 앱 마운트
const container = document.getElementById('root');
const root = createRoot(container);
root.render({
  type: App,
  props: {},
});
