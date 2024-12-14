import { createDom } from './createDom.js';
import { Core } from './index.js';
import { reconcileChildren } from './reconciler.js';

/**
 * 함수형 컴포넌트 실행 및 처리
 * @param {Object} nodeChain - 함수형 컴포넌트를 포함한 nodeChain
 * @returns {Object} 컴포넌트가 반환한 엘리먼트 nodeChain
 */
export function updateFunctionComponent(nodeChain) {
  const { getRuntime, setRuntime } = Core;

  let runtime = getRuntime();
  runtime.wipNodeChain = nodeChain;
  runtime.hookIndex = 0;
  runtime.wipNodeChain.hooks = [];
  setRuntime(runtime);

  const children = [nodeChain.type(nodeChain.props)];
  reconcileChildren(nodeChain, children);
}

export function updateHostComponent(nodeChain) {
  if (!nodeChain.dom) {
    nodeChain.dom = createDom(nodeChain);
  }
  reconcileChildren(nodeChain, nodeChain.props.children);
}
