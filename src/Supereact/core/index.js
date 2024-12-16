import createElement from './createElement.js';
import render from './render.js';
import { useState } from '../hooks/useState.js';
import { useEffect } from '../hooks/useEffect.js';

/**
 * @typedef {Object} NodeChain
 * @property {(string|Function)} type - 노드의 유형 (예: 'div', 'span', Component 함수 등)
 * @property {(HTMLElement|Text|null)} dom - 실제 DOM 요소 참조
 * @property {Object} props - 속성 및 자식 요소들
 * @property {NodeChain[]} props.children - 자식 노드들의 배열
 * @property {NodeChain|null} parent - 부모 노드
 * @property {NodeChain|null} child - 첫 번째 자식 노드
 * @property {NodeChain|null} sibling - 다음 형제 노드
 * @property {NodeChain|null} alternate - 이전 렌더링의 노드 참조 (상태 비교용)
 * @property {('PLACEMENT'|'UPDATE'|'DELETION')} [effectTag] - DOM 업데이트 유형
 * @property {Array<{state: any, queue: Array<function(any): any>}>} [hooks] - Hooks 관련 (함수형 컴포넌트용)
 */

/**
 * 라이브러리의 핵심 상태를 관리하는 함수
 *
 * @returns {Object} 전역 상태 관리를 위한 getter/setter 객체
 */
const createCore = () => {
  /** @type {NodeChain|null} 다음 작업 단위로 처리될 nodeChain */
  let nextUnitOfWork = null;

  /** @type {NodeChain|null} 마지막으로 DOM에 업데이트 된 nodeChain 트리의 루트 */
  let currentRoot = null;

  /** @type {NodeChain|null} 현재 작업 중인 nodeChain 트리의 루트 */
  let wipRoot = null;

  /** @type {NodeChain[]|null} DOM에서 제거 되어야 할 노드들의 배열 */
  let deletions = null;

  /** @type {NodeChain|null} 현재 처리중인 함수형 컴포넌트의 nodeChain */
  let wipNodeChain = null;

  /** @type {number|null} 현재 함수형 컴포넌트에서 처리 중인 hook의 인덱스 */
  let hookIndex = null;

  /** @type {Array<Function>} 현재 컴포넌트의 effect 정리(cleanup) 함수들 */
  let cleanupEffects = [];

  return {
    getRuntime: () => ({
      nextUnitOfWork,
      currentRoot,
      wipRoot,
      deletions,
      wipNodeChain,
      hookIndex,
      cleanupEffects,
    }),
    setRuntime: (newRuntime) => {
      nextUnitOfWork = newRuntime.nextUnitOfWork;
      currentRoot = newRuntime.currentRoot;
      wipRoot = newRuntime.wipRoot;
      deletions = newRuntime.deletions;
      wipNodeChain = newRuntime.wipNodeChain;
      hookIndex = newRuntime.hookIndex;
      cleanupEffects = newRuntime.cleanupEffects;
    },
  };
};

const Supereact = {
  createElement,
  render,
  useState,
  useEffect,
};

export const Core = createCore();
export default Supereact;
