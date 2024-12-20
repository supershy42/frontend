import { Core } from './runtime.js';

/**
 * 변경사항 적용
 * @param {NodeChain} nodeChain - 적용할 변경사항 있는 nodeChain
 */
function updateWork(nodeChain) {
  if (!nodeChain) return;

  let domParentNodeChain = nodeChain.parent;
  while (!domParentNodeChain.dom) {
    domParentNodeChain = domParentNodeChain.parent;
  }
  const domParent = domParentNodeChain.dom;

  // DELETION이면 하위 노드 작업을 하지 않고 바로 종료
  if (nodeChain.effectTag === 'DELETION') {
    doDeletion(nodeChain, domParent);
    // 삭제 후 하위 작업 중단
    return;
  }

  if (nodeChain.effectTag === 'PLACEMENT' && nodeChain.dom != null) {
    domParent.appendChild(nodeChain.dom);
  } else if (nodeChain.effectTag === 'UPDATE' && nodeChain.dom != null) {
    updateDom(nodeChain.dom, nodeChain.alternate.props, nodeChain.props);
  }

  updateWork(nodeChain.child);
  updateWork(nodeChain.sibling);
}

/**
 * @param {NodeChain[]} deletions - 삭제될 노드들
 * @param {NodeChain} wipRoot - 작업 중인 루트 nodeChain
 */
function updateRoot() {
  const { getRuntime, setRuntime } = Core;
  const runtime = getRuntime();

  // cleanup effect 실행
  runtime.cleanupEffects.forEach((cleanup) => {
    if (typeof cleanup === 'function') {
      cleanup();
    }
  });
  runtime.cleanupEffects = [];

  // 기존 DOM에서 변경
  console.log({ deletion: runtime.deletions });
  runtime.deletions.forEach(updateWork);
  updateWork(runtime.wipRoot.child);
  runtime.currentRoot = runtime.wipRoot;
  runtime.wipRoot = null;
  setRuntime(runtime);
}

function doDeletion(nodeChain, domParent) {
  // 함수형 컴포넌트인 경우
  if (typeof nodeChain.type === 'function') {
    // 실제 DOM을 가진 첫번째 자식 노드 찾기
    let current = nodeChain;
    while (current && !current.dom) {
      current = current.child;
    }

    if (current && current.dom) {
      // 부모에서 해당 DOM 요소 삭제
      domParent.removeChild(current.dom);
    }

    return;
  }

  // 일반 DOM 노드인 경우
  if (nodeChain.dom) {
    domParent.removeChild(nodeChain.dom);
  } else if (nodeChain.child) {
    // child가 있지만 dom이 없는 경우 (중간 노드)
    doDeletion(nodeChain.child, domParent);
  }
}

/**
 * DOM 속성들 업데이트
 */
function updateDom(dom, prevProps, nextProps) {
  const isEvent = (key) => key.startsWith('on');
  const isStyle = (key) => key === 'style';
  const isProperty = (key) => key !== 'children' && !isEvent(key);

  // 이전 이벤트 리스너 제거
  Object.keys(prevProps || {})
    .filter(isEvent)
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // 이전 스타일 제거
  if (prevProps.style) {
    Object.keys(prevProps.style).forEach((styleKey) => {
      dom.style[styleKey] = '';
    });
  }

  // 이전 속성 제거
  Object.keys(prevProps || {})
    .filter(isProperty)
    .filter((key) => !(key in nextProps))
    .forEach((name) => {
      dom[name] = '';
    });

  // 새로운 속성 설정
  Object.keys(nextProps || {})
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  // 새로운 스타일 설정
  if (nextProps.style) {
    Object.keys(nextProps.style).forEach((styleKey) => {
      dom.style[styleKey] = nextProps.style[styleKey];
    });
  }

  // 새로운 이벤트 리스너 추가
  Object.keys(nextProps || {})
    .filter(isEvent)
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

export { updateWork, updateRoot };
