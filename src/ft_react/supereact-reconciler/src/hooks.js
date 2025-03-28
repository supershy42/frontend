import { scheduleUpdateOnFiber } from './reconciler.js';

let currentlyRenderingFiber = null;
let hookIndex = 0;

/**
 * Hook 시스템 초기화
 * 컴포넌트 렌더링 전 호출
 */
export function prepareHooks(fiber) {
  // console.log('prepareHooks', fiber);
  currentlyRenderingFiber = fiber;
  // console.log('currentlyRenderingFiber', currentlyRenderingFiber);
  hookIndex = 0;
}

/**
 * Hook 시스템 정리
 * 컴포넌트 렌더링 후 호출
 */
export function finishHooks() {
  currentlyRenderingFiber = null;
}

/**
 * useState Hook
 * 컴포넌트에 상태 추가
 *
 * @param {any} initial 초기 상태 값
 * @returns {[any, Function]} 상태 값과 상태 변경 함수
 */
export function useState(initial) {
  const fiber = currentlyRenderingFiber;
  // console.log('fiber', fiber);
  const oldHook = fiber.alternate?.hooks?.[hookIndex];

  const hook = {
    state:
      oldHook !== undefined
        ? oldHook.state
        : typeof initial === 'function'
        ? initial()
        : initial,
    queue: [],
  };

  const actions = oldHook?.queue || [];
  if (actions.length > 0) {
    for (const action of actions) {
      // console.log('action', action, 'hook.state', hook.state);
      hook.state = typeof action === 'function' ? action(hook.state) : action;
      // console.log('hook.state', hook.state);
    }
  }

  const setState = (action) => {
    // console.log('currentlyRenderingFiber', fiber);

    hook.queue.push(action);

    let fiberRoot = fiber;
    while (fiberRoot.parent) {
      fiberRoot = fiberRoot.parent;
    }

    const root = fiberRoot.stateNode;
    // console.log('Found root:', root);

    // 업데이트 대기열에 추가
    root.pendingUpdates.push(fiber);
    // console.log('Added to pendingUpdates:', root.pendingUpdates);

    scheduleUpdateOnFiber(root);
  };

  fiber.hooks = fiber.hooks || [];
  fiber.hooks[hookIndex] = hook;
  hookIndex++;

  return [hook.state, setState];
}

export function useEffect(callback, deps) {
  const fiber = currentlyRenderingFiber;
  const oldHook = fiber.alternate?.hooks?.[hookIndex];

  const hook = {
    tag: 'effect',
    callback,
    deps,
    cleanup: oldHook?.cleanup,
  };

  const depsChanged =
    !oldHook ||
    !hook.deps ||
    !oldHook.deps ||
    hook.deps.length !== oldHook.deps.length ||
    hook.deps.some((dep, i) => dep !== oldHook.deps[i]);

  if (depsChanged) {
    fiber.effects = fiber.effects || [];
    fiber.effects.push({
      callback,
      cleanup: oldHook?.cleanup,
    });
  }

  fiber.hooks[hookIndex] = hook;
  hookIndex++;
}
