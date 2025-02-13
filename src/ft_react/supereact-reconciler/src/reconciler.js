import { commitRoot } from "./commitWork.js";

let nextUnitOfWork = null;
let wipRoot = null;

/**
 * Fiber - React의 작업 단위로 컴포넌트의 상태와 DOM을 추적한다.
 * @param {string|function} type
 * @param {Object} props
 * @returns {Object} Fiber Node 객체
 */
function createFiberNode(type, props) {
  return {
    type,           // 컴포넌트 타입
    props,          // 컴포넌트 속성
    dom: null,      // 실제 DOM 노드
    parent: null,   // 부모 Fiber
    child: null,    // 첫 번째 자식 Fiber
    sibling: null,  // 다음 형제 Fiber
    alternate: null,// 이전 Fiber 트리의 대응되는 노드
    flags: 'PLACEMENT', // Fiber 상태
    deletions: [],  // 삭제될 자식들 추적
  }
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
    workInProgress.dom = current.dom; // DOM 노드는 재사용
    workInProgress.alternate = current; // 이전 Fiber 노드와 연결
    current.alternate = workInProgress;
  } else {
    // 기존 workInProgress 재사용하고 필요한 속성만 업데이트
    workInProgress.dom = current.dom;
    workInProgress.type = current.type;
    workInProgress.props = current.props;

    workInProgress.child = null;
    workInProgress.sibling = null;
    workInProgress.flags = 'UPDATE';
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
function scheduleUpdateOnFiber(fiber) {
  nextUnitOfWork = fiber;
  
  requestIdleCallback(workLoop);
}

/**
 * 작업 루프 실행
 */
function workLoop(deadline) {
  while (nextUnitOfWork && deadline.timeRemaining() > 0) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot(wipRoot);
  }

  requestIdleCallback(workLoop);
}

/**
 * Fiber 노드에 해당하는 실제 DOM 노드 생성
 * 
 * @param {Object} fiber - Fiber 노드
 * @returns {HTMLElement} 생성된 DOM 노드
 */
function createDom(fiber) {
  // 텍스트 엘리먼트 처리
  if (fiber.type === 'TEXT_ELEMENT') {
    return document.createTextNode(fiber.props.nodeValue);
  }

  // 일반 DOM 엘리먼트 생성
  const dom = document.createElement(fiber.type);

  // 이벤트 리스너, 속성 처리
  Object.keys(fiber.props).forEach((prop) => {
    // children은 별도 처리
    if (prop === 'children') {
      return;
    }

    // 이벤트 리스너
    if (prop.startsWith('on')) {
      const eventType = prop.toLowerCase().substring(2);
      dom.addEventListener(eventType, fiber.props[prop]);
    } else {
      // 속성
      dom[prop] = fiber.props[prop];
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
    let newFiber = null;

    const sameType = oldFiber && element && element.type === oldFiber.type;

    if (sameType) {
      // 업데이트: 타입이 같으면 DOM 재사용
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        child: null,
        sibling: null,
        flags: 'UPDATE',
      }
    }

    if (element && !sameType) {
      // 생성: 타입이 다르면 새로운 DOM 생성
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        child: null,
        sibling: null,
        flags: 'PLACEMENT',
      }
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
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}



/**
 * 각 Fiber 노드의 작업을 수행하고 다음 작업 단위를 반환
 * 
 * @param {Object} fiber - 작업을 수행할 Fiber 노드
 * @returns {Object} 다음 작업 단위 Fiber 노드
 */
function performUnitOfWork(fiber) {
  // 1. DOM 없으면 생성
  if (!fiber.dom && fiber.flags !== 'DELETION') {
    fiber.dom = createDom(fiber);
  }

  // 2. children 처리
  const elements = fiber.props.children;
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
 * @param {Object} element - 렌더링 할 React Element
 * @param {Object} root - 루트 컨테이너 정보를 담은 객체
 * 
 * 1. 최초 렌더링시 root.current(Fiber 트리)가 없다면 생성
 * 2. 현재 Fiber 트리로부터 workInProgress 트리를 생성
 * 3. 업데이트 작업 스케줄링
 */
export function updateContainer(element, root) {
  // // React 15 이전의 방식
  // const container = root.containerInfo;

  // const parentNode = container;

  // // 기존 내용 지우기
  // while (parentNode.firstChild) {
  //   parentNode.removeChild(parentNode.firstChild);
  // }

  // // unmount 처리
  // if (element === null) {
  //   return;
  // }

  // // 새로운 엘리먼트 렌더링
  // renderElement(element, parentNode);

  if (!root.current) {
    // 최초 렌더링시 루트 Fiber 노드 생성
    root.current = createFiberNode(element.type, element.props);
  }

  const workInProgress = createWorkInProgress(root.current);

  wipRoot = workInProgress;
  nextUnitOfWork = workInProgress;

  scheduleUpdateOnFiber(workInProgress);
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
