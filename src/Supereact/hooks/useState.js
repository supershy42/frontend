import {
  wipRoot,
  setWipRoot,
  currentRoot,
  setDeletions,
} from '../core/reconciler.js';
import { setNextUnitOfWork, workLoop } from '../core/scheduler.js';

let currentComponent = null;
let hookIndex = 0;
const componentHooks = new Map();

function setCurrentComponent(value) {
  currentComponent = value;
}

function setHookIndex(index) {
  hookIndex = index;
}

function useState(initial) {
  console.log('useState 호출됨:', { currentComponent, hookIndex, initial });

  const hooks = componentHooks.get(currentComponent) || [];
  const hook = hooks[hookIndex] || { state: initial };

  const setState = (value) => {
    console.log('setState 호출됨:', {
      oldState: hook.state,
      newState: value,
      currentRoot,
    });
    console.log(hooks);
    hook.state = value;

    const newRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    };

    console.log('새 root 생성:', newRoot);

    setWipRoot(newRoot);
    setNextUnitOfWork(newRoot);
    setDeletions([]);

    requestIdleCallback(workLoop);
  };

  hooks[hookIndex] = hook;
  componentHooks.set(currentComponent, hooks);
  hookIndex++;

  return [hook.state, setState];
}

export { useState, currentComponent, setCurrentComponent, setHookIndex };
