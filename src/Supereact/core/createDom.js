const isEvent = (key) => key.startsWith('on');
const isProperty = (key) => key !== 'children' && !isEvent(key);
const isNew = (prev, next) => (key) => prev[key] !== next[key];
const isGone = (prev, next) => (key) => !(key in next);

/**
 * 해당하는 실제 DOM 요소를 생성
 * @param {Object} nodeChain - DOM 요소를 생성할 fiber 노드
 * @param {string} nodeChain.type - 생성할 DOM 요소의 타입 ('div', 'span', 'TEXT_ELEMENT' 등)
 * @param {Object} nodeChain.props - DOM 요소에 적용할 속성들
 * @returns {HTMLElement|Text} 생성된 DOM 요소
 */
export function createDom(nodeChain) {
  const dom =
    nodeChain.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(nodeChain.type);

  updateDom(dom, {}, nodeChain.props);
  return dom;
}

/**
 * DOM 속성들 업데이트
 */
export function updateDom(dom, prevProps, nextProps) {
  // 이전 이벤트 리스너 제거
  Object.keys(prevProps || {})
    .filter(isEvent)
    .filter(isGone(prevProps, nextProps) || isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // 이전 속성 제거
  Object.keys(prevProps || {})
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = '';
    });

  // 새로운 속성 설정
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  // 새로운 이벤트 리스너 추가
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}
