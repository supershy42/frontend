import { Core } from './index.js';

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

  if (nodeChain.effectTag === 'PLACEMENT' && nodeChain.dom != null) {
    domParent.appendChild(nodeChain.dom);
  } else if (nodeChain.effectTag === 'UPDATE' && nodeChain.dom != null) {
    updateDom(nodeChain.dom, nodeChain.alternate.props, nodeChain.props);
  } else if (nodeChain.effectTag === 'DELETION') {
    doDeletion(nodeChain, domParent);
  }

  updateWork(nodeChain.child);
  updateWork(nodeChain.sibling);
}

/**
 * @param {NodeChain[]} deletions - 삭제될 노드들
 * @param {NodeChain} wipRoot - 작업 중인 루트 nodeChain
 */
function updateRoot(deletions, wipRoot) {
  const { getRuntime, setRuntime } = Core;
  const runtime = getRuntime();
  runtime.deletions.forEach(updateWork);
  updateWork(runtime.wipRoot.child);
  runtime.currentRoot = runtime.wipRoot;
  runtime.wipRoot = null;
  setRuntime(runtime);
}

function doDeletion(nodeChain, domParent) {
  if (nodeChain.dom) {
    domParent.removeChild(nodeChain.dom);
  } else {
    doDeletion(nodeChain.child, domParent);
  }
}

/**
 * DOM 속성들 업데이트
 */
function updateDom(dom, prevProps, nextProps) {

  // 이벤트 리스너인지 확인
  const isEvent = (key) => key.startsWith('on');
  // 일반 속성인지 확인
  const isProperty = (key) => key !== 'children' && !isEvent(key);

  // 이전 이벤트 리스너 제거
  Object.keys(prevProps || {})
    .filter(isEvent)
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

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

  // 새로운 이벤트 리스너 추가
  Object.keys(nextProps || {})
    .filter(isEvent)
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

export { updateWork, updateRoot };
