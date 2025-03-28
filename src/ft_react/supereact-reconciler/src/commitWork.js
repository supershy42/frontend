import { updateProperties } from './domProperties.js';

/**
 * Fiber 트리의 변경사항을 실제 DOM에 반영
 * 동기적 실행으로 중단될 수 없음
 *
 * @param {Object} wipRoot - 작업이 완료된 Fiber 트리의 루트
 */
function commitRoot(root) {
  // console.log('9. commitRoot called with root:', root);
  const finishedWork = root.finishedWork;
  if (!finishedWork) {
    // console.log('No finishedWork found');
    return;
  }

  // 루트에서 모든 deletions 배열 찾기
  let allDeletions = collectAllDeletions(finishedWork);


  // 수집된 모든 deletions 처리
  if (allDeletions.length > 0) {

    allDeletions.forEach((fiber) => {
      // 각 삭제될 fiber마다 부모 DOM 노드 찾기
      const parentDom = findClosestParentDom(fiber) || root.containerInfo;
      commitDeletion(fiber, parentDom);
    });
  }

  // 변경된 노드들 커밋
  commitWork(finishedWork.child, root.containerInfo);

  // 이펙트 실행 (Dom 업데이트 이후에 실행)
  runEffects(finishedWork);

  // 현재 트리를 workInProgress 트리로 교체
  // console.log('10. committing finished, new current:', finishedWork);
  root.current = finishedWork;
  root.finishedWork = null;
  root.nextUnitOfWork = null;

  root.isUpdating = false;
  root.pendingUpdates = [];
}

function collectAllDeletions(fiber) {
  if (!fiber) return [];

  let deletions = fiber.deletions || [];

  if (fiber.child) {
    deletions = deletions.concat(collectAllDeletions(fiber.child));
  }

  if (fiber.sibling) {
    deletions = deletions.concat(collectAllDeletions(fiber.sibling));
  }

  return deletions;
}

function findClosestParentDom(fiber) {
  if (!fiber || !fiber.parent) return null;

  let current = fiber.parent;
  while (current) {
    if (current.dom) {
      return current.dom;
    }
    current = current.parent;
  }

  return null;
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
  let domParentFiber = fiber.parent;

  while (domParentFiber && !domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }

  if (domParentFiber) {
    actualParentDom = domParentFiber.dom;
  }

  if (fiber.flags === 'PLACEMENT' && fiber.dom) {
    // 새로운 노드 추가
    actualParentDom.appendChild(fiber.dom);
  } else if (fiber.flags === 'UPDATE' && fiber.dom) {
    // 노드 업데이트
    updateDom(fiber.dom, fiber.alternate?.props || {}, fiber.props);
  } else if (fiber.flags === 'DELETION') {
    commitDeletion(fiber, actualParentDom);
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

  runCleanup(fiber);

  // DOM이 있으면 직접 삭제
  if (fiber.dom) {
    try {
      if (parentDom && parentDom.contains(fiber.dom)) {
        parentDom.removeChild(fiber.dom);
      } else {
        // 더 위쪽의 부모 DOM에서 찾기
        let actualParentDom = parentDom;
        while (actualParentDom && !actualParentDom.contains(fiber.dom)) {
          actualParentDom = actualParentDom.parentNode;
        }
        if (actualParentDom && actualParentDom.contains(fiber.dom)) {
          actualParentDom.removeChild(fiber.dom);
        }
      }
    } catch (error) {
      console.error('Error removing DOM node:', error);
    }
  } else {
    // 함수형 컴포넌트의 경우 자식들을 재귀적으로 삭제
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
  updateProperties(dom, prevProps, nextProps);
}

function runEffects(fiber) {
  if (!fiber) return;

  if (fiber.effects && fiber.effects.length > 0) {
    fiber.effects.forEach((effect) => {
      // 이전 클린업
      if (effect.cleanup) {
        try {
          effect.cleanup();
        } catch (e) {
          console.error(e);
        }
      }

      // 새 이펙트 실행
      try {
        const cleanup = effect.callback();
        effect.cleanup = typeof cleanup === 'function' ? cleanup : undefined;
      } catch (e) {
        console.error(e);
      }
    });
  }

  if (fiber.child) {
    runEffects(fiber.child);
  }

  if (fiber.sibling) {
    runEffects(fiber.sibling);
  }
}

function runCleanup(fiber) {
  // console.log('runCleanup for:', fiber.type);

  if (!fiber) return;

  if (fiber.effects && fiber.effects.length > 0) {

    fiber.effects.forEach((effect, index) => {
      if (effect.cleanup) {
        // console.log(`Running cleanup ${index} for:`, fiber.type);

        try {
          effect.cleanup();
          // console.log(`Cleanup ${index} completed`);
        } catch (e) {
          console.error(e);
        }
      }
    });
  } else {
    // console.log('No effects to clean up');
  }
}

export { commitRoot };
