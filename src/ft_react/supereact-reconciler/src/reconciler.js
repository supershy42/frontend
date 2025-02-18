import { commitRoot } from './commitWork.js';

function createFiberRoot(containerInfo) {
  const root = {
    // 컨테이너 DOM 노드
    containerInfo,
    // 현재 화면에 반영된 Fiber 트리
    current: null,
    // 작업 중인 Fiber 트리 (workInProgress)
    finishedWork: null,
    // 다음 작업 단위
    nextUnitOfWork: null,
  };

  const rootFiber = {
    type: null,
    stateNode: root,
    props: null,
    dom: null,
    parent: null,
    child: null,
    sibling: null,
    alternate: null,
    flags: 'PLACEMENT',
    deletions: [],
  };

  root.current = rootFiber;

  return root;
}

/**
 * Fiber - React의 작업 단위로 컴포넌트의 상태와 DOM을 추적한다.
 * @param {string|function} type
 * @param {Object} props
 * @returns {Object} Fiber Node 객체
 */
function createFiberNode(type, props) {
  const fiber = {
    type,
    props,
    dom: null,
    parent: null,
    child: null,
    sibling: null,
    alternate: null,
    flags: 'PLACEMENT',
    deletions: [],
  };

  return fiber;
}

/**
 * @param {Object} element - 렌더링 할 React Element
 * @param {Object} root - 루트 컨테이너 정보를 담은 객체
 *
 * 1. 최초 렌더링시 root.current(Fiber 트리)가 없다면 생성
 * 2. 현재 Fiber 트리로부터 workInProgress 트리를 생성
 * 3. 업데이트 작업 스케줄링
 */
function updateContainer(element, root) {
  console.log('2. updateContainer called with element:', element);

  const current = root.current;
  const elementType = element.type;
  const elementProps = element.props;

  if (!current.child) {
    // 최초 렌더링시 element에 해당하는 Fiber 생성
    const newChild = createFiberNode(elementType, elementProps);
    newChild.parent = current;
    current.child = newChild;
  }

  // workInProgress 트리 생성
  const workInProgress = createWorkInProgress(current);

  root.finishedWork = workInProgress;
  root.nextUnitOfWork = workInProgress.child;

  scheduleUpdateOnFiber(root);
}

/**
 * 현재 Fiber 트리 기반으로 작업용(WorkInProgress) Fiber 트리 생성
 *
 * React는 더블 버퍼링을 위해 두 개의 Fiber 트리를 사용한다.
 * 1. current: 현재 화면에 렌더링된 상태를 나타내는 Fiber 트리
 * 2. workInProgress: 진행 중인 변경사항을 반영하는 작업용 트리
 *
 * (모든 변경 작업이 완료되면 workInProgress가 current가 되고, 이전 current는 다음 작업의 workInProgress로 재사용)
 *
 * @param {Object} currentFiber - 현재 Fiber 트리
 * @returns {Object} workInProgress Fiber 트리
 */
function createWorkInProgress(current) {
  // 이전 workInProgress가 있으면 그대로 사용
  let workInProgress = current.alternate;

  if (!workInProgress) {
    // 새로운 Fiber 노드 생성
    workInProgress = createFiberNode(current.type, current.props);
    workInProgress.stateNode = current.stateNode;
    workInProgress.dom = current.dom; // DOM 노드는 재사용
    workInProgress.flags = current.flags;
    workInProgress.alternate = current; // 이전 Fiber 노드와 연결
    current.alternate = workInProgress;
  } else {
    // 기존 workInProgress 재사용하고 필요한 속성만 업데이트
    workInProgress.stateNode = current.stateNode;
    workInProgress.dom = current.dom;
    workInProgress.type = current.type;
    workInProgress.props = current.props;
    workInProgress.flags = current.flags;
    workInProgress.deletions = [];
  }

  if (current.child) {
    workInProgress.child = current.child;
    workInProgress.child.parent = workInProgress;
  }

  workInProgress.sibling = current.sibling;

  return workInProgress;
}

/**
 * Fiber 업데이트 스케쥴링
 * 실제 Dom 업데이트 수행하기 전에 우선순위 설정하고 작업 예약
 *
 * @param {Object} fiber - 업데이트 필요한 Fiber 노드
 */
function scheduleUpdateOnFiber(root) {
  requestIdleCallback((deadline) => workLoop(root, deadline));
}

/**
 * 작업 루프 실행
 */
function workLoop(root, deadline) {
  console.log('3. workLoop running with root:', root);

  let nextUnitOfWork = root.nextUnitOfWork;

  while (nextUnitOfWork && deadline.timeRemaining() > 0) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    root.nextUnitOfWork = nextUnitOfWork;
  }

  if (root.nextUnitOfWork) {
    // 작업이 남아있다면 다시 스케쥴링
    requestIdleCallback((deadline) => workLoop(root, deadline));
  } else if (root.finishedWork) {
    // 작업 완료 후 finishedWork가 있으면
    commitRoot(root);
  }
}

/**
 * 각 Fiber 노드의 작업을 수행하고 다음 작업 단위를 반환
 *
 * @param {Object} fiber - 작업을 수행할 Fiber 노드
 * @returns {Object} 다음 작업 단위 Fiber 노드
 */
function performUnitOfWork(fiber) {
  console.log('4. performUnitOfWork for:', fiber.type);

  // 1. DOM 없으면 생성
  if (!fiber.dom && fiber.type !== null && fiber.flags !== 'DELETION') {
    fiber.dom = createDom(fiber);
  }

  // 2. children 처리
  const elements = fiber.props?.children || [];

  reconcileChildren(fiber, elements);

  // 3. 다음 작업 단위 찾기 dfs
  //   a. 자식이 있으면 자식으로 이동
  if (fiber.child) {
    return fiber.child;
  }

  //   b. 형제가 있으면 형제로 이동, 형제 없으면 부모의 형제로 이동
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }

  return null;
}

/**
 * Fiber 노드에 해당하는 실제 DOM 노드 생성
 *
 * @param {Object} fiber - Fiber 노드
 * @returns {HTMLElement|Text} 생성된 DOM 노드
 */
function createDom(fiber) {
  console.log('7. createDom for:', fiber.type);

  // 텍스트 요소 처리
  if (fiber.type === 'TEXT_ELEMENT') {
    const textNode = document.createTextNode(fiber.props.nodeValue);
    return textNode;
  }

  // 일반 DOM 엘리먼트 생성
  const dom = document.createElement(fiber.type);

  const props = fiber.props || {};

  // 이벤트 리스너, 속성 처리
  Object.keys(props).forEach((prop) => {
    // children은 별도 처리
    if (prop !== 'children') {
      // 이벤트 리스너
      if (prop.startsWith('on')) {
        const eventType = prop.toLowerCase().substring(2);
        dom.addEventListener(eventType, fiber.props[prop]);
      } else {
        // 속성
        dom[prop] = fiber.props[prop];
      }
    }
  });

  return dom;
}

/**
 * Fiber의 자식 노드들을 재조정
 * 이전 Fiber 트리와 새로운 엘리먼트들을 비교해 변경사항 처리
 *
 * @param {Object} wipFiber - 작업 중인 Fiber 노드
 * @param {Array} elements - 자식 엘리먼트들
 */
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  const elementArray = Array.isArray(elements) ? elements : [elements];

  wipFiber.deletions = [];

  while (index < elementArray.length || oldFiber !== null) {
    const element = elementArray[index];
    console.log('6. processing element:', element);

    let processedElement = element;
    if (typeof element === 'string' || typeof element === 'number') {
      processedElement = {
        type: 'TEXT_ELEMENT',
        props: { nodeValue: element },
      };
    }

    let newFiber = null;

    const sameType =
      oldFiber && processedElement && processedElement.type === oldFiber.type;

    if (sameType) {
      // 업데이트: 타입이 같으면 DOM 재사용
      newFiber = {
        type: oldFiber.type,
        props: processedElement.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        child: null,
        sibling: null,
        flags: 'UPDATE',
      };
    }

    if (processedElement && !sameType) {
      // 생성: 타입이 다르면 새로운 DOM 생성
      newFiber = {
        type: processedElement.type,
        props: processedElement.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        child: null,
        sibling: null,
        flags: 'PLACEMENT',
      };
    }

    if (oldFiber && !sameType) {
      // 삭제: 타입이 다르면 이전 DOM 제거
      oldFiber.flags = 'DELETION';
      wipFiber.deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (processedElement) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

export { updateContainer, createFiberRoot };
