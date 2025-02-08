/**
 * 1. Virtual DOM과 실제 DOM간의 차이를 조정
 * 2. 상태변화를 실제 DOM에 반영
 * 3. 렌더링 우선순위 관리와 작업 스케쥴링
 */

export function updateContainer(element, root) {
  const container = root.containerInfo;

  const parentNode = container;

  // 기존 내용 지우기
  while (parentNode.firstChild) {
    parentNode.removeChild(parentNode.firstChild);
  }

  // unmount 처리
  if (element === null) {
    return;
  }

  // 새로운 엘리먼트 렌더링
  renderElement(element, parentNode);
}

/**
 * Element를 실제 DOM으로 변환
 */
function renderElement(element, parentNode) {
  // 텍스트, 숫자 처리
  if (typeof element === 'string' || typeof element === 'number') {
    parentNode.appendChild(document.createTextNode(element));
    return;
  }

  const { type, props } = element;
  const dom = document.createElement(type);

  // props 처리
  Object.keys(props).forEach((prop) => {
    if (prop == 'children') {
      return;
    }
    dom[prop] = props[prop];
  });

  // children 처리
  const children = props.children;
  if (Array.isArray(children)) {
    children.forEach((child) => renderElement(child, dom));
  } else {
    renderElement(children, dom);
  }

  parentNode.appendChild(dom);
}
