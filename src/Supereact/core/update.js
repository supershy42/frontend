/**
 * 변경사항 적용
 * @param {Object} nodeChain - 적용할 변경사항 있는 nodeChain
 */
function updateWork(nodeChain) {
  // console.log('updating node:', nodeChain);
  if (!nodeChain) {
    // console.log('nodeChain is undefined');
    return;
  }

  const domParent = nodeChain.parent.dom;

  if (nodeChain.effectTag === 'PLACEMENT' && nodeChain.dom != null) {
    domParent.appendChild(nodeChain.dom);
  } else if (nodeChain.effectTag === 'UPDATE' && nodeChain.dom != null) {
    updateDom(nodeChain.dom, nodeChain.alternate.props, nodeChain.props);
  } else if (nodeChain.effectTag === 'DELETION') {
    domParent.removeChild(nodeChain.dom);
  }

  updateWork(nodeChain.child);
  updateWork(nodeChain.sibling);
}

/**
 * @param {Array} deletions - 삭제될 노드들
 * @param {Object} wipRoot - 작업 중인 루트 nodeChain
 */
function updateRoot(deletions, wipRoot) {
  deletions.forEach(updateWork);
  updateWork(wipRoot.child);
}

/**
 * DOM 속성들 업데이트
 */
function updateDom(dom, prevProps, nextProps) {
  // 이전 속성 제거
  Object.keys(prevProps)
    .filter((key) => key !== 'children')
    .filter((key) => !(key in nextProps))
    .forEach((name) => {
      dom[name] = '';
    });

  // 새 속성 설정
  Object.keys(nextProps)
    .filter((key) => key !== 'children')
    .forEach((name) => {
      dom[name] = nextProps[name];
    });
}

export { updateWork, updateRoot };
