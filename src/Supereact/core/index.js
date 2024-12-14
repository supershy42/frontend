import { useState } from '../hooks/useState.js';
import createElement from './createElement.js';
import render from './render.js';
import { workLoop } from './scheduler.js';

/**
 * 라이브러리의 핵심 상태를 관리하는 함수
 * 
 * @returns {Object} 전역 상태 관리를 위한 getter/setter 객체
 */
const createCore = () => {
  /** @type {Object|null} 다음 작업 단위로 처리될 nodeChain */
  let nextUnitOfWork = null;

  /** @type {Object|null} 마지막으로 DOM에 업데이트 된 nodeChain 트리의 루트 */
  let currentRoot = null;

  /** @type {Object|null} 현재 작업 중인 nodeChain 트리의 루트 */
  let wipRoot = null;

  /** @type {Array|null} DOM에서 제거 되어야 할 노드들의 배열 */
  let deletions = null;

  /** @type {Object|null} 현재 처리중인 함수형 컴포넌트의 nodeChain */
  let wipNodeChain = null;

  /** @type {Object|null} 현재 함수형 컴포넌트에서 처리 중인 hook의 인덱스 */
  let hookIndex = null;

  return {
    getRuntime: () => ({
      nextUnitOfWork,
      currentRoot,
      wipRoot,
      deletions,
      wipNodeChain,
      hookIndex,
    }),
    setRuntime: (newRuntime) => {
      nextUnitOfWork = newRuntime.nextUnitOfWork;
      currentRoot = newRuntime.currentRoot;
      wipRoot = newRuntime.wipRoot;
      deletions = newRuntime.deletions;
      wipNodeChain = newRuntime.wipNodeChain;
      hookIndex = newRuntime.hookIndex;
    },
  };
};

requestIdleCallback(workLoop);

const Supereact = {
  createElement,
  render,
  useState,
};

export const Core = createCore();
export default Supereact;
