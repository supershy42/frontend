export default function createDom(nodeChain) {
  const dom =
    nodeChain.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(nodeChain.type);

  const isProperty = (key) => key !== 'children';
  Object.keys(nodeChain.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = nodeChain.props[name];
    });

  return dom;
}
