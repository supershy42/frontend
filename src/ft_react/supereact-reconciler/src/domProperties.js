/**
 * DOM 속성을 설정하는 함수
 *
 * @param {HTMLElement} dom - 속성을 설정할 DOM 요소
 * @param {string} name - 속성 이름
 * @param {any} value - 새 속성 값
 * @param {any} prevValue - 이전 속성 값
 */
export function setProperty(dom, name, value, prevValue) {
  console.log('setProperty called with:', {
    dom: dom,
    domType: dom ? dom.constructor.name : 'null',
    nodeType: dom ? dom.nodeType : 'N/A',
    name: name,
    value: value,
  });

  if (!dom || !dom.nodeType) {
    return;
  }

  if (name === 'children' || name === 'key') {
    return;
  }

  // 이벤트 리스너 처리
  if (name.toLowerCase().startsWith('on')) {
    handleEventListener(dom, name, value, prevValue);
    return;
  }

  // 스타일 처리
  if (name === 'style') {
    handleStyleProperty(dom, value, prevValue);
    return;
  }

  // className 처리
  if (name === 'className') {
    if (dom instanceof HTMLElement) {
      dom.className = value || '';
    }
    return;
  }

  // checked, value 등 특수 속성 처리
  if (name === 'checked' || name === 'value' || name === 'selected') {
    if (dom instanceof HTMLElement) {
      if (
        (name === 'checked' && dom instanceof HTMLInputElement) ||
        (name === 'value' &&
          (dom instanceof HTMLInputElement ||
            dom instanceof HTMLSelectElement ||
            dom instanceof HTMLTextAreaElement)) ||
        (name === 'selected' && dom instanceof HTMLOptionElement)
      ) {
        dom[name] = value;
      }
    }
    return;
  }

  // data-* 속성 처리
  if (name.startsWith('data-')) {
    if (dom instanceof HTMLElement) {
      try {
        dom.setAttribute(name, value);
      } catch (e) {
        console.error('Error setting data-* attribute:', e);
      }
    }
    return;
  }

  // 일반 속성 처리
  if (value === null || value === false || value === undefined) {
    try {
      if (dom instanceof HTMLElement) {
        dom.removeAttribute(name);
      }
    } catch (e) {
      console.error('Error removing attribute:', e);
    }
  } else {
    try {
      if (dom instanceof HTMLElement) {
        dom.setAttribute(name, value);
      } else {
        dom[name] = value;
      }
    } catch (e) {
      console.error('Error setting attribute:', e);
    }
  }
}

/**
 * 이벤트 리스너 처리
 */
function handleEventListener(dom, name, newHandler, oldHandler) {
  const eventType = name.toLowerCase().substring(2);

  // 이전 핸들러 제거
  if (oldHandler) {
    dom.removeEventListener(eventType, oldHandler);
  }

  // 새 핸들러 추가
  if (newHandler) {
    dom.addEventListener(eventType, newHandler);
  }
}

/**
 * 스타일 속성 처리
 */
function handleStyleProperty(dom, newStyle, prevStyle) {
  const style = dom.style;
  prevStyle = prevStyle || {};
  newStyle = newStyle || {};

  // 이전 스타일 중 새 스타일에 없는 것은 제거
  for (const key in prevStyle) {
    if (!(key in newStyle)) {
      style[key] = '';
    }
  }

  // 새 스타일 설정
  for (const key in newStyle) {
    const value = newStyle[key];
    if (value !== prevStyle[key]) {
      style[key] = value;
    }
  }
}

/**
 * 속성 제거 함수
 */
export function removeProperty(dom, name, prevValue) {
  setProperty(dom, name, null, prevValue);
}

/**
 * 모든 속성 설정
 */
export function setInitialProperties(dom, props) {
  Object.keys(props).forEach((propName) => {
    if (propName !== 'children' && propName !== 'key') {
      setProperty(dom, propName, props[propName], null);
    }
  });
}

/**
 * 속성 업데이트
 */
export function updateProperties(dom, prevProps, nextProps) {
  prevProps = prevProps || {};
  nextProps = nextProps || {};

  // 제거된 속성 처리
  for (const name in prevProps) {
    if (name !== 'children' && !(name in nextProps)) {
      removeProperty(dom, name, prevProps[name]);
    }
  }

  // 추가/수정된 속성 처리
  for (const name in nextProps) {
    if (name !== 'children' && prevProps[name] !== nextProps[name]) {
      setProperty(dom, name, nextProps[name], prevProps[name]);
    }
  }
}
