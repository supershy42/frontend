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
  if (finishedWork.deletions && finishedWork.deletions.length > 0) {
    finishedWork.deletions.forEach((fiber) => {
      commitDeletion(fiber, root.containerInfo);
    });
  }

  // 루트 div를 컨테이너에 마운트
  // if (finishedWork.child && finishedWork.child.dom) {
  //   console.log('mounting root child:', finishedWork.child);
  //   root.containerInfo.appendChild(finishedWork.child.dom);
  // }

  // 변경된 노드들 커밋
  commitWork(finishedWork.child, root.containerInfo);

  // 현재 트리를 workInProgress 트리로 교체
  console.log('10. committing finished, new current:', finishedWork);
  root.current = finishedWork;
  root.finishedWork = null;
  root.nextUnitOfWork = null;

  root.isUpdating = false;
  root.pendingUpdates = [];
}

/**
 * 단일 Fiber 노드의 변경사항을 DOM에 반영
 *
 * @param {Object} fiber - 처리할 Fiber 노드
 */
function commitWork(fiber, parentDom) {
  if (!fiber) {
    return;
  }

  // 실제 부모 DOM 노드 찾기
  let actualParentDom = parentDom;

  // 함수형 컴포넌트는 DOM이 없으므로 가장 가까운 부모 DOM을 찾음
  if (fiber.parent) {
    let parent = fiber.parent;
    while (parent && !parent.dom) {
      parent = parent.parent;
    }
    if (parent) {
      actualParentDom = parent.dom;
    }
  }

  if (fiber.flags === 'PLACEMENT' && fiber.dom) {
    // 새로운 노드 추가
    console.log(
      '11. appending new node:',
      fiber.type,
      'to parent:',
      actualParentDom
    );
    actualParentDom.appendChild(fiber.dom);
  } else if (fiber.flags === 'UPDATE' && fiber.dom) {
    // 노드 업데이트
    console.log('11. updating node:', fiber.type);
    updateDom(fiber.dom, fiber.alternate?.props || {}, fiber.props);
  } else if (fiber.flags === 'DELETION') {
    // commitDeletion(fiber, domParent);
    return;
  }

  // 자식 형제 노드들 처리
  if (fiber.child) {
    commitWork(fiber.child, fiber.dom || actualParentDom);
  }

  if (fiber.sibling) {
    commitWork(fiber.sibling, actualParentDom);
  }
}

/**
 * 삭제된 Fiber 노드를 DOM에서 제거
 */
function commitDeletion(fiber, parentDom) {
  if (!fiber) return;

  // DOM이 있으면 직접 삭제
  if (fiber.dom) {
    parentDom.removeChild(fiber.dom);
  } else {
    // DOM이 없는 컴포넌트의 경우 자식을 재귀적으로 삭제
    let child = fiber.child;
    while (child) {
      commitDeletion(child, parentDom);
      child = child.sibling;
    }
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
      if (key.toLowerCase().startsWith('on')) {
        // 이벤트 리스너 제거 - 대소문자 구분 없이
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
      if (key.toLowerCase().startsWith('on')) {
        // 이벤트 리스너 업데이트 - 대소문자 구분 없이
        const eventType = key.toLowerCase().substring(2);
        // 이전 이벤트 리스너 제거 후 새로운 리스너 추가
        if (prevProps[key]) {
          dom.removeEventListener(eventType, prevProps[key]);
        }
        dom.addEventListener(eventType, nextProps[key]);
      } else {
        // 일반 속성 업데이트
        dom[key] = nextProps[key];
      }
    }
  });
}

export { commitRoot };
