import { Core } from './index.js';

/**
 * 이전 nodeChain과 새로운 엘리먼트들 비교 후 업데이트
 * @param {NodeChain} wipNodeChain - 작업 중인 nodeChain
 * @param {NodeChain[]} elements - 새로운 엘리먼트 배열
 */
export function reconcileChildren(wipNodeChain, elements) {
  let index = 0;
  let oldNodeChain = wipNodeChain.alternate && wipNodeChain.alternate.child;
  let prevSibling = null;

  while (index < elements.length || oldNodeChain != null) {
    const element = elements[index];
    let newNodeChain = null;

    // 이전 nodeChain과 새로운 엘리먼트 비교
    const sameType =
      oldNodeChain && element && element.type === oldNodeChain.type;

    // 같은 타입이면 업데이트
    if (sameType) {
      newNodeChain = {
        type: oldNodeChain.type,
        props: element.props,
        dom: oldNodeChain.dom,
        parent: wipNodeChain,
        alternate: oldNodeChain,
        effectTag: 'UPDATE',
      };
    }

    // 새로운 엘리먼트가 있으면 생성
    if (element && !sameType) {
      newNodeChain = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipNodeChain,
        alternate: null,
        effectTag: 'PLACEMENT',
      };
    }

    // 새로운 엘리먼트 없으면 삭제
    if (oldNodeChain && !sameType) {
      oldNodeChain.effectTag = 'DELETION';
      const runtime = Core.getRuntime();
      runtime.deletions = [...runtime.deletions, oldNodeChain];
      Core.setRuntime(runtime);
    }

    if (oldNodeChain) {
      oldNodeChain = oldNodeChain.sibling;
    }

    if (index === 0) wipNodeChain.child = newNodeChain;
    else if (element) prevSibling.sibling = newNodeChain;

    prevSibling = newNodeChain;
    index++;
  }
}
