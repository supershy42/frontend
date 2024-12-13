let currentNodeChain = null;
let hookIndex = 0;

export function useEffect(callback, deps) {
  const hooks = currentNodeChain.hooks || (currentNodeChain.hooks = []);

  const hook = hooks[hookIndex] || {
    deps: null,
    cleanup: null,
  };

  // 첫 실행(이전 의존성 x), 의존성 배열 제공 x, 의존성 값 변경 경우
  const hasChanged =
    !hook.deps || !deps || deps.some((dep, i) => dep !== hook.deps[i]);

  if (hasChanged) {
    if (hook.cleanup) {
      hook.cleanup();
    }

    hook.cleanup = callback();
    hook.deps = deps;
  }

  hooks[hookIndex] = hook;
  hookIndex++;
}
