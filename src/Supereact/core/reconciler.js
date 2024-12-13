/**
 * 현재 작업 중인 루트
 * @type {Object|null}
 */
let wipRoot = null;

function setWipRoot(value) {
  wipRoot = value;
}

/**
 * 마지막으로 수정된 nodeChain의 루트
 * @type {Object|null}
 */
let currentRoot = null;

function setCurrentRoot(value) {
  currentRoot = value;
}

/**
 * 삭제될 노드들을 추적하는 배열
 * @type {Array}
 */
let deletions = null;

function setDeletions(value) {
  deletions = value;
}

/**
 * 이전 nodeChain과 새로운 엘리먼트들 비교 후 업데이트
 * @param {Object} wipNodeChain
 * @param {Array} elements
 */
function reconcileChildren(wipNodeChain, elements) {
  // console.log('reconciling children:', elements);
  let index = 0;
  let oldNodeChain = wipNodeChain.alternate && wipNodeChain.alternate.child;
  let prevSibling = null;

  while (index < elements.length || oldNodeChain != null) {
    const element = elements[index];
    let newNodeChain = null;

    // console.log('new nodechain 생성', element);

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
      deletions.push(oldNodeChain);
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

export {
  setWipRoot,
  setDeletions,
  setCurrentRoot,
  reconcileChildren,
  wipRoot,
  currentRoot,
  deletions,
};
