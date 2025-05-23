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
  const oldHook = fiber.alternate?.hooks?.[hookIndex];

  const hook = {
    state:
      oldHook !== undefined
        ? oldHook.state
        : typeof initial === 'function'
        ? initial()
        : initial,
    queue: oldHook?.queue || [],
  };

  const actions = hook.queue;

  if (actions.length > 0) {
    let newState = hook.state;
    for (const action of actions) {
      newState = typeof action === 'function' ? action(newState) : action;
    }
    hook.state = newState;
    // console.log('Updated state:', hook.state);
  }

  const setState = (action) => {
    // console.log('setState called for fiber:', fiber.type.name || fiber.type);

    hook.queue.push(action);

    let fiberRoot = fiber;
    while (fiberRoot.parent) {
      fiberRoot = fiberRoot.parent;
    }

    const root = fiberRoot.stateNode;

    if (!root.pendingUpdates.includes((f) => f === fiber)) {
      root.pendingUpdates.push(fiber);
    }

    if (!root.batchUpdateScheduled) {
      root.batchUpdateScheduled = true;

      Promise.resolve().then(() => {
        root.batchUpdateScheduled = false;
        scheduleUpdateOnFiber(root);
      });
    }
  };

  fiber.hooks = fiber.hooks || [];
  fiber.hooks[hookIndex] = hook;
  hookIndex++;

  return [hook.state, setState];
}

/**
 * useEffect Hook
 *
 * @param {*} callback
 * @param {*} deps
 */
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

/**
 * useMemo Hook
 *
 */
export function useMemo(factory, deps) {
  const fiber = currentlyRenderingFiber;
  const oldHook = fiber.alternate?.hooks?.[hookIndex];

  const hook = {
    tag: 'memo',
    memoizedValue: oldHook?.memoizedValue,
    deps,
    factory,
  };

  const depsChanged =
    !oldHook ||
    !hook.deps ||
    !oldHook.deps ||
    hook.deps.length !== oldHook.deps.length ||
    hook.deps.some((dep, i) => dep !== oldHook.deps[i]);

  if (depsChanged) {
    hook.memoizedValue = factory();
  } else {
    hook.memoizedValue = oldHook.memoizedValue;
  }

  fiber.hooks[hookIndex] = hook;
  hookIndex++;

  return hook.memoizedValue;
}

/**
 * useCallback Hook
 *
 */
export function useCallback(callback, deps) {
  return useMemo(() => callback, deps);
}

/**
 * useRef Hook
 * DOM 요소나 컴포넌트의 인스턴스에 대한 참조를 유지
 *
 * @param {any} initialValue 초기값
 * @returns {Object} current 속성을 가진 ref 객체
 */
export function useRef(initialValue) {
  const fiber = currentlyRenderingFiber;
  const oldHook = fiber.alternate?.hooks?.[hookIndex];

  const hook = {
    tag: 'ref',
    current: oldHook?.current ?? initialValue,
  };

  fiber.hooks = fiber.hooks || [];
  fiber.hooks[hookIndex] = hook;
  hookIndex++;

  return hook;
}
