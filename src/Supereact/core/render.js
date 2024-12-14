import { Core } from './index.js';

/**
 * Virtual DOM을 실제 DOM으로 변환
 * @param {Object} element
 * @param {HTMLElement} container
 * @example
 * // Virtual DOM: { type: "div", props: { children: [] } }
 * // container: document.getElementById("root")
 * render(element, container)
 */
export default function render(element, container) {
  const { getRuntime, setRuntime } = Core;
  setRuntime({
    wipRoot: {
      dom: container,
      props: {
        children: [element],
      },
      alternate: Core.getRuntime().currentRoot,
    },
    deletions: [],
    nextUnitOfWork: null,
    currentRoot: null,
  });

  const runtime = getRuntime();
  runtime.nextUnitOfWork = runtime.wipRoot;
  setRuntime(runtime);
}
