import { createDom } from './createDom.js';
import { Core } from './runtime.js';
import { reconcileChildren } from './reconciler.js';

/**
 * 함수형 컴포넌트 실행 및 처리
 * @param {NodeChain} nodeChain - 함수형 컴포넌트를 포함한 nodeChain
 * @returns {NodeChain} 컴포넌트가 반환한 엘리먼트 nodeChain
 */
export function updateFunctionComponent(nodeChain) {
  const { getRuntime, setRuntime } = Core;

  const runtime = getRuntime();
  runtime.wipNodeChain = nodeChain;
  runtime.hookIndex = 0;
  runtime.wipNodeChain.hooks = [];
  setRuntime(runtime);

  const children = [nodeChain.type(nodeChain.props || {})];

  reconcileChildren(nodeChain, children);
}

export function updateHostComponent(nodeChain) {
  const { getRuntime } = Core;
  if (!nodeChain.dom) {
    nodeChain.dom = createDom(nodeChain);
  }
  const children = nodeChain.props?.children || [];
  reconcileChildren(nodeChain, children);
}
