import { updateRoot } from './update.js';
import { updateFunctionComponent, updateHostComponent } from './component.js';
import { Core } from './index.js';

/**
 * @param {IdleDeadline} deadline - 브라우저의 idle 상태정보를 가진 객체
 */
export function workLoop(deadline) {
  const { getRuntime, setRuntime } = Core;
  let runtime = getRuntime();
  let shouldYield = false;

  while (runtime.nextUnitOfWork && !shouldYield) {
    const nextWork = performUnitOfWork(runtime.nextUnitOfWork);
    setRuntime({
      ...runtime,
      nextUnitOfWork: nextWork,
    });
    shouldYield = deadline.timeRemaining() < 1;
    runtime = getRuntime();
  }

  if (!getRuntime().nextUnitOfWork && getRuntime().wipRoot) {
    updateRoot();
  }

  // 다음 작업이 있을 때만 requestIdleCallback 호출
  const currentRuntime = getRuntime();
  if (currentRuntime.nextUnitOfWork || currentRuntime.wipRoot) {
    requestIdleCallback(workLoop);
  }
}

/**
 * 각 작업 단위 수행 후 다음 작업 단위 반환
 * @param {NodeChain} nodeChain - 현재 작업
 * @returns {NodeChain|null} - 다음 작업
 */
function performUnitOfWork(nodeChain) {
  const isFunctionComponent = nodeChain.type instanceof Function;

  if (isFunctionComponent) {
    updateFunctionComponent(nodeChain);
  } else {
    updateHostComponent(nodeChain);
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
}
