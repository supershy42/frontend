import { reconcileChildren } from './reconciler.js';

/**
 * 함수형 컴포넌트 실행 및 처리
 * @param {Object} nodeChain - 함수형 컴포넌트를 포함한 nodeChain
 * @returns {Object} 컴포넌트가 반환한 엘리먼트 nodeChain
 */
function updateFunctionComponent(nodeChain) {
  const children = [nodeChain.type(nodeChain.props)];

  nodeChain.dom = nodeChain.parent.dom;

  reconcileChildren(nodeChain, children);
}

export default updateFunctionComponent;
