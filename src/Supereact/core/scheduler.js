/**
 * 다음 작업 단위를 추적하는 변수
 * @type {Object|null}
 */
let nextUnitOfWork = null;

/**
 * @param {IdleDeadline} deadline - 브라우저의 idle 상태정보를 가진 객체
 */
function workLoop(deadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

    shouldYield = deadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}

/**
 * 각 작업 단위 수행 후 다음 작업 단위 반환
 * @param {Object} nodeChain - 현재 작업
 * @returns {Object|null} - 다음 작업
 */
function performUnitOfWork(nodeChain) {
  if (!nodeChain.dom) {
    nodeChain.dom = createDom(nodeChain);
  }

  const elements = nodeChain.props.children;
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];
    const newNode = {
      type: element.type,
      props: element.props,
      parent: nodeChain,
      dom: null,
    };

    if (index === 0) nodeChain.child = newNode;
    else prevSibling.sibling = newNode;

    prevSibling = newNode;
    index++;
  }

  if (nodeChain.child) {
    return nodeChain.child;
  }

  let nextNode = nodeChain;
  while (nextNode) {
    if (nextNode.sibling) {
      return nextNode.sibling;
    }
    nextNode = nextNode.parent;
  }
}

requestIdleCallback(workLoop);

export { nextUnitOfWork, performUnitOfWork };
