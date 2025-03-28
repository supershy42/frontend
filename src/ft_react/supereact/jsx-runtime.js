/**
 * JSX 표현식을 React Element로 변환
 * 바벨에 의해 JSX가 자바스크립트로 변횐될 때 호출되는 함수
 *
 * @param {string|function} type - HTML 태그 또는 컴포넌트 함수
 * @param {Object} config - 컴포넌트에 전달될 모든 props를 포함하는 객체
 * @param {string|null} maybeKey - 선택적으로 전달되는 key
 * @returns {Object} React Element 객체
 *
 * @example
 */

export function jsx(type, config, maybeKey) {
  if (type == null || type === false) {
    return null;
  }

  let key = null;

  let ref = null;

  let props = {};

  if (config != null) {
    // key 처리
    if (maybeKey !== undefined) {
      key = '' + maybeKey;
    } else if (config.key !== undefined) {
      key = '' + config.key;
    }

    // ref 처리
    if (config.ref !== undefined) {
      ref = config.ref;
    }

    // props 복사
    for (const prop in config) {
      if (prop !== 'key' && prop !== 'ref') {
        props[prop] = config[prop];
      }
    }
  }

  return {
    $$typeof: Symbol.for('react.element'),
    type,
    key,
    ref,
    props,
  };
}

/**
 * 정적 children을 처리하는 jsx 함수
 */
export const jsxs = jsx;

/**
 * Fragment <></>를 처리하기 위한 jsx 함수
 */
export function jsxDEV(type, config) {
  return jsx(type, config);
}
