/**
 * 변경사항 적용
 * @param {Object} nodeChain - 적용할 변경사항 있는 nodeChain
 */
function updateWork(nodeChain) {
  if (!nodeChain) return;

  console.log('updateWork', nodeChain);
  // 함수형컴포넌트 아닌 실제 DOM 요소만 처리
  if (!nodeChain.type || typeof nodeChain.type !== 'function') {
    const domParent = nodeChain.parent ? nodeChain.parent.dom : null;

    if (domParent) {
      if (nodeChain.effectTag === 'PLACEMENT' && nodeChain.dom != null) {
        domParent.appendChild(nodeChain.dom);
      } else if (nodeChain.effectTag === 'UPDATE' && nodeChain.dom != null) {
        updateDom(nodeChain.dom, nodeChain.alternate.props, nodeChain.props);
      } else if (nodeChain.effectTag === 'DELETION') {
        domParent.removeChild(nodeChain.dom);
      }
    }
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

// /**
//  * 이벤트 리스너인지 확인
//  */
// const isEvent = (key) => key.startsWith('on');
// /**
//  * 일반 속성인지 확인 (children과 이벤트 제외)
//  */
// const isProperty = (key) => key !== 'children' && !isEvent(key);

/**
 * DOM 속성들 업데이트
 */
function updateDom(dom, prevProps, nextProps) {
  console.log('updateDom 호출:', { dom, prevProps, nextProps }); // 추가

  // 이벤트 리스너인지 확인
  const isEvent = (key) => key.startsWith('on');
  // 일반 속성인지 확인
  const isProperty = (key) => key !== 'children' && !isEvent(key);

  // 이전 이벤트 리스너 제거
  Object.keys(prevProps || {})
    .filter(isEvent)
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      console.log('이벤트 리스너 제거:', eventType); // 추가
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // 이전 속성 제거
  Object.keys(prevProps || {})
    .filter(isProperty)
    .filter((key) => !(key in nextProps))
    .forEach((name) => {
      dom[name] = '';
    });

  // 새로운 속성 설정
  Object.keys(nextProps || {})
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  // 새로운 이벤트 리스너 추가
  Object.keys(nextProps || {})
    .filter(isEvent)
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      console.log('이벤트 리스너 추가:', eventType, nextProps[name]); // 추가
      dom.addEventListener(eventType, nextProps[name]);
    });
}

export { updateWork, updateRoot };
