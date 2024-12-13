export default function createDom(nodeChain) {
  const dom =
    nodeChain.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(nodeChain.type);

  // 이벤트 리스너인지 확인
  const isEvent = (key) => key.startsWith('on');
  // 일반 속성인지 확인
  const isProperty = (key) => key !== 'children' && !isEvent(key);

  // 속성 설정
  Object.keys(nodeChain.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = nodeChain.props[name];
    });

  // 이벤트 리스너 추가
  Object.keys(nodeChain.props)
    .filter(isEvent)
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nodeChain.props[name]);
    });

  return dom;
}
