// /**
//  * Virtual DOM을 실제 DOM으로 변환
//  * @param {Object} element
//  * @param {HTMLElement} container
//  * @example
//  * // Virtual DOM: { type: "div", props: { children: [] } }
//  * // container: document.getElementById("root")
//  * render(element, container)
//  */

// export default function render(element, container) {
//   // DOM노드 생성
//   const dom =
//     element.type === 'TEXT_ELEMENT'
//       ? document.createTextNode('')
//       : document.createElement(element.type);

//   // children 제외한 props 처리
//   const isProperty = (key) => key !== 'children';
//   Object.keys(element.props)
//     .filter(isProperty)
//     .forEach((name) => {
//       dom[name] = element.props[name];
//     });

//   // children 재귀적으로 렌더
//   element.props.children.forEach((child) => render(child, dom));

//   // container에 추가
//   container.appendChild(dom);
// }

import { setNextUnitOfWork } from './scheduler.js';
import { setWipRoot, currentRoot, setDeletions } from './reconciler.js';

export default function render(element, container) {
  const root = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };
  setWipRoot(root);
  setDeletions([]);
  setNextUnitOfWork(root);
}
