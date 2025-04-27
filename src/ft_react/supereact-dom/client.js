import { createFiberRoot, updateContainer } from '../supereact-reconciler/index.js';
/**
 * 1. createRoot(): React 애플리케이션의 진입점을 생성, 컨테이너 DOM에 React를 마운트
 * 2. 생성된 root 객체의 render(): React 트리를 DOM에 렌더링
 * 3. 생성된 root 객체의 unmount(): React 트리를 언마운트, 정리 작업 수행
 */

function SupereactDomRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

SupereactDomRoot.prototype.render = function (children) {
  const root = this._internalRoot;
  updateContainer(children, root); //실제 렌더링 로직
};

SupereactDomRoot.prototype.unmount = function () {
  const root = this._internalRoot;
  if (root !== null) {
    this._internalRoot = null;
    updateContainer(null, root);
  }
};

/**
 * 브라우저에서 React 애플리케이션의 진입점 생성
 *
 * @param {Element|DocumentFragment} container - 렌더링할 루트 컨테이너
 * @returns {Object} 렌더와 언마운트 메서드를 가진 객체
 */
export function createRoot(container) {
  // console.log('1. createRoot called with container:', container);
  if (!isValidContainer(container)) {
    throw new Error(
      'Target container is not a DOM element or Document Fragment'
    );
  }

  const root = createFiberRoot(container);

  return new SupereactDomRoot(root);
}

/**
 * 렌더링할 컨테이너가 유효한지 확인
 */
function isValidContainer(container) {
  return (
    container &&
    (container.nodeType === Node.ELEMENT_NODE ||
      container.nodeType === Node.DOCUMENT_FRAGMENT_NODE)
  );
}
