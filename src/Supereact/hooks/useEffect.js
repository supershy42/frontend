import { Core } from '../core/runtime.js';

export function useEffect(callback, deps) {
  const { getRuntime, setRuntime } = Core;
  const runtime = getRuntime();
  const oldHook = runtime.wipNodeChain?.alternate?.hooks?.[runtime.hookIndex];

  const hook = {
    deps: deps,
    cleanup: oldHook ? oldHook.cleanup : undefined,
  };

  const depsChanged = oldHook
    ? !deps || !oldHook.deps || deps.some((dep, i) => dep !== oldHook.deps[i])
    : true;

  // 의존성 변경 되어을 때 이전 cleanup 실행, 새 effect 등록
  if (depsChanged) {
    if (hook.cleanup) {
      runtime.cleanupEffects.push(hook.cleanup);
    }
  }

  // 다음 업데이트에서 effect 실행 예약
  Promise.resolve().then(() => {
    if (typeof callback === 'function') {
      hook.cleanup = callback();
    }
  });

  runtime.wipNodeChain.hooks.push(hook);
  runtime.hookIndex++;
  setRuntime(runtime);
}
