import { Core } from './runtime.js';

/**
 * 이전 nodeChain과 새로운 엘리먼트들 비교 후 업데이트
 * @param {NodeChain} wipNodeChain - 작업 중인 nodeChain
 * @param {NodeChain[]} elements - 새로운 엘리먼트 배열
 */
export function reconcileChildren(wipNodeChain, elements) {
  // 이전 필터링 제거
  if (!Array.isArray(elements)) {
    elements = [elements];
  }

  let index = 0;
  let oldNodeChain = wipNodeChain.alternate && wipNodeChain.alternate.child;
  let prevSibling = null;

  while (index < elements.length || oldNodeChain != null) {
    const element = elements[index];

    let newNodeChain = null;

    // element가 null이거나 undefined인 경우에도 oldNodeChain이 있다면 삭제
    if ((!element || element === null) && oldNodeChain) {
      oldNodeChain.effectTag = 'DELETION';
      const runtime = Core.getRuntime();
      runtime.deletions = runtime.deletions || [];
      runtime.deletions.push(oldNodeChain);
      Core.setRuntime(runtime);
    } else if (oldNodeChain && element && element.type === oldNodeChain.type) {
      newNodeChain = {
        type: oldNodeChain.type,
        props: element.props,
        dom: oldNodeChain.dom,
        parent: wipNodeChain,
        alternate: oldNodeChain,
        effectTag: 'UPDATE',
      };
    } else if (element && element !== null) {
      // null이 아닌 새로운 element만 추가
      newNodeChain = {
        type: element.type,
        props: element.props || {},
        dom: null,
        parent: wipNodeChain,
        alternate: null,
        effectTag: 'PLACEMENT',
      };
    }

    if (oldNodeChain) {
      oldNodeChain = oldNodeChain.sibling;
    }

    if (newNodeChain) {
      // newNodeChain이 있을 때만 연결
      if (index === 0) {
        wipNodeChain.child = newNodeChain;
      } else {
        prevSibling.sibling = newNodeChain;
      }
      prevSibling = newNodeChain;
    }
    index++;
  }
}
