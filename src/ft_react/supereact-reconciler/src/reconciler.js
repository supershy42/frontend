import { commitRoot } from './commitWork.js';
import { finishHooks, prepareHooks } from './hooks.js';

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
    // 업데이트 큐
    pendingUpdates: [],
    // 업데이트 진행 여부
    isUpdating: false,
  };

  const rootFiber = {
    type: 'ROOT',
    stateNode: root,
    props: { children: [] },
    dom: containerInfo,
    parent: null,
    child: null,
    sibling: null,
    alternate: null,
    flags: 'PLACEMENT',
    deletions: [],
    hooks: [],
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
    stateNode: null,
    dom: null,
    parent: null,
    child: null,
    sibling: null,
    alternate: null,
    flags: 'PLACEMENT',
    deletions: [],
    hooks: [],
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
  console.log('2-1. root:', root);

  const current = root.current;
  current.props = { children: element };

  // workInProgress 트리 생성
  const workInProgress = createWorkInProgress(current);

  // 작업 예약
  root.finishedWork = null;
  root.nextUnitOfWork = workInProgress;

  scheduleUpdateOnFiber(root);
}

/**
 * 두 객체 간의 얕은 비교(객체의 최상위 속성들만 비교, 중첩 객체는 참조만 비교)
 * props나 state 변경 여부 확인
 *
 * @param {Object} objA
 * @param {Object} objB
 * @returns
 */
function shallowEqual(objA, objB) {
  // 1. 참조가 같으면 무조건 true
  if (objA === objB) {
    return true;
  }

  // 2. 객체가 아니면 false
  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  // 3. 객체 속성 개수가 다르면 false
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) {
    return false;
  }

  // 4. 속성 값 비교
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (
      !Object.prototype.hasOwnProperty.call(objB, key) ||
      objA[key] !== objB[key]
    ) {
      return false;
    }
  }

  return true;
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
    workInProgress.hooks = current.hooks ? [...current.hooks] : [];
    workInProgress.alternate = current; // 이전 Fiber 노드와 연결
    current.alternate = workInProgress;
  } else {
    // 기존 workInProgress 재사용하고 필요한 속성만 업데이트
    workInProgress.stateNode = current.stateNode;
    workInProgress.dom = current.dom;
    workInProgress.type = current.type;
    workInProgress.props = current.props;
    workInProgress.flags = current.flags;
    workInProgress.hooks = current.hooks ? [...current.hooks] : [];
    workInProgress.deletions = [];
  }

  return workInProgress;
}

/**
 * Fiber 업데이트 스케쥴링
 * 실제 Dom 업데이트 수행하기 전에 우선순위 설정하고 작업 예약
 *
 * @param {Object} fiber - 업데이트 필요한 Fiber 노드
 */
export function scheduleUpdateOnFiber(root) {
  console.log('scheduleUpdateOnFiber with root:', root);
  console.log('isUpdating:', root.isUpdating);
  console.log('pendingUpdates:', root.pendingUpdates);

  // if (!root.isUpdating) {
  //   root.isUpdating = true;
  //   requestIdleCallback((deadline) => workLoop(root, deadline));
  // } else {
  //   console.log('already updating, skip scheduling');
  // }
  // root.isUpdating = true;
  requestIdleCallback((deadline) => workLoop(root, deadline));
}

/**
 * 작업 루프 실행
 */
function workLoop(root, deadline) {
  console.log('3. workLoop running with root:', root);
  console.log('3-1. root.pendingUpdates', root.pendingUpdates);
  console.log('3-2. root.nextUnitOfWork', root.nextUnitOfWork);
  console.log('3-3. root.isUpdating', root.isUpdating);

  if (root.pendingUpdates.length > 0 && !root.nextUnitOfWork) {
    // 새 작업 트리 생성
    const current = root.current;
    const workInProgress = createWorkInProgress(current);

    root.finishedWork = null;
    root.nextUnitOfWork = workInProgress;
  }

  let nextUnitOfWork = root.nextUnitOfWork;

  while (nextUnitOfWork && deadline.timeRemaining() > 0) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    root.nextUnitOfWork = nextUnitOfWork;
  }

  if (root.nextUnitOfWork) {
    // 작업이 남아있다면 다시 스케쥴링
    requestIdleCallback((deadline) => workLoop(root, deadline));
  } else {
    finishWork(root);
  }
}

function finishWork(root) {
  if (root.current.alternate) {
    root.finishedWork = root.current.alternate;
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

  const isFunctionComponent = typeof fiber.type === 'function';

  if (isFunctionComponent) {
    console.log('4-1. updateFunctionComponent for:', fiber.type);
    updateFunctionComponent(fiber);
  } else {
    console.log('4-2. updateHostComponent for:', fiber.type);
    updateHostComponent(fiber);
  }

  // 다음 작업 단위 찾기 dfs
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

function updateFunctionComponent(fiber) {
  console.log('5. updateFunctionComponent for:', fiber.type);
  console.log('5-1. fiber:', fiber);

  prepareHooks(fiber);

  fiber.hooks = [];
  // // 이전 hooks 상태 복사
  // if (fiber.alternate?.hooks) {
  //   fiber.hooks = fiber.alternate.hooks.map((hook) => ({
  //     state: hook.state,
  //     queue: [...hook.queue],
  //   }));
  // } else {
  //   fiber.hooks = [];
  // }

  // 컴포넌트 함수 실행
  const children = [fiber.type(fiber.props)];

  reconcileChildren(fiber, children);

  finishHooks();
}

function updateHostComponent(fiber) {
  if (!fiber.dom && fiber.type !== null && fiber.flags !== 'DELETION') {
    fiber.dom = createDom(fiber);
  }

  const elements = fiber.props?.children || [];
  reconcileChildren(fiber, elements);
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
      // 이벤트 리스너 - 대소문자 구분없이 처리
      if (prop.toLowerCase().startsWith('on')) {
        const eventType = prop.toLowerCase().substring(2);
        dom.addEventListener(eventType, props[prop]);
      } else {
        dom[prop] = props[prop];
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
  let oldFiber = wipFiber.alternate?.child;
  let prevSibling = null;

  const elementArray = Array.isArray(elements)
    ? elements.filter(Boolean)
    : elements
    ? [elements]
    : [];
  wipFiber.deletions = [];

  if (elementArray.length == 0 && !oldFiber) {
    return;
  }

  while (index < elementArray.length || oldFiber) {
    const element = elementArray[index];
    console.log('6. processing element:', element);

    let processedElement = element;
    if (typeof element === 'string' || typeof element === 'number') {
      processedElement = {
        type: 'TEXT_ELEMENT',
        props: { nodeValue: element },
      };
    }

    const sameType =
      oldFiber && processedElement && processedElement.type === oldFiber.type;
    let newFiber = null;

    if (sameType) {
      // 1. 업데이트 케이스: 동일한 타입
      newFiber = {
        type: oldFiber.type,
        props: processedElement.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        child: null,
        sibling: null,
        flags: 'UPDATE',
        hooks: oldFiber.hooks
          ? oldFiber.hooks.map((h) => ({ state: h.state, queue: [...h.queue] }))
          : [],
      };
    } else {
      // 2. 새로운 요소가 있는 경우: 생성
      if (processedElement) {
        newFiber = {
          type: processedElement.type,
          props: processedElement.props,
          dom: null,
          parent: wipFiber,
          alternate: null,
          child: null,
          sibling: null,
          flags: 'PLACEMENT',
          hooks: [],
        };
      }

      // 3. 이전 요소가 있는 경우: 삭제
      if (oldFiber) {
        oldFiber.flags = 'DELETION';
        wipFiber.deletions.push(oldFiber);
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (newFiber && prevSibling) {
      prevSibling.sibling = newFiber;
    }

    if (newFiber) {
      prevSibling = newFiber;
    }

    index++;
  }
}

export { updateContainer, createFiberRoot };
