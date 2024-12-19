import { Core } from '../core/runtime.js';
import { workLoop } from '../core/scheduler.js';

export function useState(initial) {
  const { getRuntime, setRuntime } = Core;
  const runtime = getRuntime();
  const oldHook = runtime.wipNodeChain?.alternate?.hooks?.[runtime.hookIndex];

  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((actions) => {
    hook.state = actions(hook.state);
  });

  const setState = (action) => {
    const runtime = getRuntime();
    hook.queue.push(typeof action === 'function' ? action : () => action);

    const wipRoot = {
      dom: runtime.currentRoot.dom,
      props: runtime.currentRoot.props,
      alternate: runtime.currentRoot,
    };

    setRuntime({
      ...runtime,
      wipRoot,
      nextUnitOfWork: wipRoot,
      deletions: [],
    });

    requestIdleCallback(workLoop);
  };

  runtime.wipNodeChain.hooks.push(hook);
  runtime.hookIndex++;
  setRuntime(runtime);

  return [hook.state, setState];
}
