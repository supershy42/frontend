import {
  wipRoot,
  setWipRoot,
  setCurrentRoot,
  deletions,
  setDeletions,
  reconcileChildren,
  currentRoot,
} from './reconciler.js';
import { updateRoot } from './update.js';
import createDom from './createDom.js';
import updateFunctionComponent from './component.js';

/**
 * 다음 작업 단위를 추적하는 변수
 * @type {Object|null}
 */
let nextUnitOfWork = null;

function setNextUnitOfWork(value) {
  console.log('setNextUnitOfWork 호출됨:', value);
  nextUnitOfWork = value;
  console.log('nextUnitOfWork 설정됨:', nextUnitOfWork);
}

/**
 * @param {IdleDeadline} deadline - 브라우저의 idle 상태정보를 가진 객체
 */
function workLoop(deadline) {
  console.log('=== workLoop 시작 ===');
  console.log('nextUnitOfWork:', nextUnitOfWork);
  console.log('wipRoot:', wipRoot);
  console.log('currentRoot:', currentRoot);

  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    console.log('DOM 업데이트 시작');
    console.log('업데이트할 wipRoot:', wipRoot);
    console.log('deletions:', deletions);

    updateRoot(deletions, wipRoot);
    setCurrentRoot(wipRoot);
    setWipRoot(null);
    setDeletions([]);
  }

  console.log('=== workLoop 종료 ===');
  console.log('작업 후 nextUnitOfWork:', nextUnitOfWork);
  console.log('작업 후 wipRoot:', wipRoot);
}

/**
 * 각 작업 단위 수행 후 다음 작업 단위 반환
 * @param {Object} nodeChain - 현재 작업
 * @returns {Object|null} - 다음 작업
 */
function performUnitOfWork(nodeChain) {
  console.log('performUnitOfWork 실행', nodeChain);

  const isFunctionComponent = nodeChain.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(nodeChain);
  } else {
    if (!nodeChain.dom) {
      nodeChain.dom = createDom(nodeChain);
    }
    reconcileChildren(nodeChain, nodeChain.props.children);
  }

  if (nodeChain.child) {
    return nodeChain.child;
  }

  let nextNodeChain = nodeChain;
  while (nextNodeChain) {
    if (nextNodeChain.sibling) {
      return nextNodeChain.sibling;
    }
    nextNodeChain = nextNodeChain.parent;
  }

  return null;
}

requestIdleCallback(workLoop);

export { nextUnitOfWork, setNextUnitOfWork, workLoop };
