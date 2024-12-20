export default function (babel) {
  const { types: t } = babel;

  return {
    name: 'supereact-jsx',
    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push('jsx');
    },
    visitor: {
      JSXFragment(path) {
        const children = path.node.children
          .map((child) => {
            if (t.isJSXText(child)) {
              const text = child.value.trim();
              return text ? t.stringLiteral(text) : null;
            }
            if (t.isJSXExpressionContainer(child)) {
              return child.expression;
            }
            if (t.isJSXElement(child)) {
              // JSX 요소는 그대로 두어 JSXElement visitor가 처리하도록 함
              return child;
            }
            return null;
          })
          .filter(Boolean);

        path.replaceWith(
          t.callExpression(
            t.memberExpression(
              t.identifier('Supereact'),
              t.identifier('createElement')
            ),
            [t.stringLiteral('div'), t.nullLiteral(), ...children]
          )
        );
      },

      JSXElement(path) {
        const openingElement = path.node.openingElement;
        const tagName = openingElement.name.name;
        const attributes = openingElement.attributes;
        const children = path.node.children;

        // 컴포넌트 이름이 대문자로 시작하는지 확인
        const isComponent = /^[A-Z]/.test(tagName);
        const elementType = isComponent
          ? t.identifier(tagName)
          : t.stringLiteral(tagName);

        // props 처리
        const props = [];
        for (const attr of attributes) {
          if (t.isJSXSpreadAttribute(attr)) {
            // 스프레드 연산자 처리
            props.push(t.spreadElement(attr.argument));
          } else {
            const key = attr.name.name;
            // 값이 없는 속성 처리
            if (attr.value === null) {
              props.push(
                t.objectProperty(t.identifier(key), t.booleanLiteral(true))
              );
              continue;
            }

            let value = attr.value;

            // style 속성 특별 처리
            if (key === 'style' && t.isJSXExpressionContainer(value)) {
              props.push(t.objectProperty(t.identifier(key), value.expression));
              continue;
            }

            // 이벤트 핸들러 처리
            if (key.startsWith('on')) {
              value = value.expression;
            }
            // className 처리
            else if (key === 'className') {
              props.push(
                t.objectProperty(
                  t.identifier('class'),
                  value.expression || value
                )
              );
              continue;
            }
            // 일반 props
            else {
              value = value.expression || value;
            }

            props.push(t.objectProperty(t.identifier(key), value));
          }
        }

        // children 처리
        const childElements = children
          .map((child) => {
            if (t.isJSXText(child)) {
              const text = child.value.trim();
              return text ? t.stringLiteral(text) : null;
            }
            if (t.isJSXExpressionContainer(child)) {
              // 논리 연산자(&& 등) 처리
              if (t.isLogicalExpression(child.expression)) {
                return child.expression;
              }
              // 일반 표현식 처리
              return child.expression;
            }
            return child;
          })
          .filter(Boolean);

        const args = [elementType, t.objectExpression(props), ...childElements];

        path.replaceWith(
          t.callExpression(
            t.memberExpression(
              t.identifier('Supereact'),
              t.identifier('createElement')
            ),
            args
          )
        );
      },
    },
  };
}
