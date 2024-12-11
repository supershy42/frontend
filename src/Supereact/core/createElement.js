/**
 * JSX를 JS객체로 변환
 * @param {string} type - HTML 태그 이름
 * @param {Object} props - 요소의 속성들
 * @param {...any} children - 자식 요소들
 * @returns {Object} Virtual DOM 객체
 * @example
 * // ex) <div id="hello">Hi</div> => createElement("div", { id: "hello" }, "Hi")
 */
export default function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === 'object' ? child : createTextElement(child)
      ),
    },
  };
}

/**
 * 문자열을 텍스트 노드 객체로 변환
 * @param {string|number} text - 변환할 텍스트
 * @returns {Object} 텍스트 노드 객체
 * @example
 * // ex) "Hello" => { type: "TEXT_ELEMENT", props: { nodeValue: "Hello", children: [] } }
 */
function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
