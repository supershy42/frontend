/**
 * Fiber 트리의 변경사항을 실제 DOM에 반영
 * 동기적 실행으로 중단될 수 없음
 *
 * @param {Object} wipRoot - 작업이 완료된 Fiber 트리의 루트
 */
function commitRoot(root) {
  console.log('9. commitRoot called with root:', root);
  const finishedWork = root.finishedWork;
  if (!finishedWork) return;

  // 삭제된 노드들 처리
  if (finishedWork.deletions) {
    finishedWork.deletions.forEach(commitDeletion);
  }

  // // 루트 div를 컨테이너에 마운트
  // if (finishedWork.child && finishedWork.child.dom) {
  //   console.log('mounting root child:', finishedWork.child);
  //   root.containerInfo.appendChild(finishedWork.child.dom);
  // }

  // 변경된 노드들 커밋
  commitWork(finishedWork.child, root);

  // 현재 트리를 workInProgress 트리로 교체
  console.log('10. committing finished, new current:', finishedWork);
  root.current = finishedWork;
  root.finishedWork = null;
}

/**
 * 단일 Fiber 노드의 변경사항을 DOM에 반영
 *
 * @param {Object} fiber - 처리할 Fiber 노드
 */
function commitWork(fiber, root) {
  if (!fiber) {
    return;
  }

  let parentDom = null;

  if (!fiber.parent) {
    parentDom = root.containerInfo;
  } else {
    let parentFiber = fiber.parent;
    while (parentFiber && !parentFiber.dom) {
      parentFiber = parentFiber.parent;
    }
    parentDom = parentFiber ? parentFiber.dom : root.containerInfo;
  }

  if (fiber.flags === 'PLACEMENT' && fiber.dom) {
    // 새로운 노드 추가
    console.log(
      '11. appending new node:',
      fiber.type,
      'to parent:',
      parentDom
    );
    parentDom.appendChild(fiber.dom);
  } else if (fiber.flags === 'UPDATE' && fiber.dom !== null) {
    // 노드 업데이트
    console.log('11. updating node:', fiber.type);
    updateDom(
      fiber.dom,
      fiber.alternate ? fiber.alternate.props : {},
      fiber.props
    );
  } else if (fiber.flags === 'DELETION') {
    // 노드 삭제
    console.log('11. deleting node:', fiber.type);
    commitDeletion(fiber);
  }

  // 자식 형제 노드들 처리
  commitWork(fiber.child, root);
  commitWork(fiber.sibling, root);
}

/**
 * 삭제된 Fiber 노드를 DOM에서 제거
 */
function commitDeletion(fiber) {
  if (!fiber) return;

  let parentFiber = fiber.parent;
  if (!parentFiber) return;

  // DOM 노드를 찾을 때까지 부모 노드를 탐색
  while (parentFiber && !parentFiber.dom) {
    parentFiber = parentFiber.parent;
  }

  if (fiber.dom) {
    console.log('12. removing node:', fiber.type);
    parentFiber.dom.removeChild(fiber.dom);
  } else {
    //DOM이 없는 경우 자식을 재귀적으로 삭제
    commitDeletion(fiber.child);
  }
}

/**
 * DOM 노드의 속성을 업데이트
 *
 * @param {HTMLElement} dom - 업데이트할 DOM 노드
 * @param {Object} prevProps - 이전 속성들
 * @param {Object} nextProps - 새로운 속성들
 */
function updateDom(dom, prevProps, nextProps) {
  // 이전 속성 제거
  Object.keys(prevProps).forEach((key) => {
    if (key !== 'children' && !(key in nextProps)) {
      if (key.startsWith('on')) {
        // 이벤트 리스너 제거
        const eventType = key.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[key]);
      } else {
        // 일반 속성 제거
        dom[key] = '';
      }
    }
  });

  // 새로운 속성 설정
  Object.keys(nextProps).forEach((key) => {
    if (key !== 'children' && prevProps[key] !== nextProps[key]) {
      if (key.startsWith('on')) {
        // 이벤트 리스너 업데이트
        const eventType = key.toLowerCase().substring(2);
        dom.addEventListener(eventType, nextProps[key]);
      } else {
        // 일반 속성 업데이트
        dom[key] = nextProps[key];
      }
    }
  });
}

export { commitRoot };
