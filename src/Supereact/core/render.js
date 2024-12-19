import { Core } from './runtime.js';
import { workLoop } from './scheduler.js';

/**
 * Virtual DOM을 실제 DOM으로 변환
 * @param {NodeChain} element - Virtual DOM 엘리먼트
 * @param {HTMLElement} container - 실제 DOM 컨테이너
 * @example
 * // Virtual DOM: { type: "div", props: { children: [] } }
 * // container: document.getElementById("root")
 * render(element, container)
 */
export default function render(element, container) {
  const { getRuntime, setRuntime } = Core;
  const runtime = getRuntime();
  runtime.wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: runtime.currentRoot,
  };
  runtime.deletions = [];
  runtime.nextUnitOfWork = runtime.wipRoot;
  setRuntime(runtime);

  requestIdleCallback(workLoop);
}
