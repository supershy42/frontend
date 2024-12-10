export default class Component {
  static html(strings, ...values) {
    return String.raw({ raw: strings }, ...values);
  }

  $target; //컴포넌트를 넣을 부모
  $props;
  $state;

  constructor($target, $props) {
    this.$target = $target;
    this.$props = $props;
    this.setup();
    this.render();
    this.setEvent();
  }

  setup() {} //컴포넌트 state 설정

  mounted() {
    console.log(`${this.constructor.name} mounted.`);
  } //컴포넌트가 마운트 되었을 때

  template() {
    //UI 구성
    return '';
  }

  render() {
    this.$target.innerHTML = this.template(); //UI 렌더링
    this.mounted();
  }

  setEvent() {} //컴포넌트에서 필요한 이벤트 설정

  setState(newState) {
    //상태 변경 후 렌더링
    this.$state = { ...this.$state, ...newState };

    // 가상 DOM 생성 (현재 DOM 복사)
    const oldNode = this.$target.cloneNode(true);

    // 새로운 상태로 렌더링
    this.render();

    // 실제 변경된 부분만 업데이트
    this.updateDOM(this.$target, oldNode);
  }

  updateDOM(newNode, oldNode) {
    // 노드 타입이 다르면 교체
    if (
      newNode.nodeType !== oldNode.nodeType ||
      newNode.tagName !== oldNode.tagName
    ) {
      oldNode.parentNode?.replaceChild(newNode, oldNode);
      return;
    }

    // input, select, textarea의 값 보존
    if (
      oldNode instanceof HTMLInputElement ||
      oldNode instanceof HTMLSelectElement ||
      oldNode instanceof HTMLTextAreaElement
    ) {
      const oldValue = oldNode.value;
      const oldChecked = oldNode.checked;
      const newValue = newNode.value;
      const newChecked = newNode.checked;

      if (newValue !== oldValue) {
        newNode.value = oldValue;
      }
      if (newChecked !== oldChecked) {
        newNode.checked = oldChecked;
      }
    }

    // 텍스트 노드면 내용만 업데이트
    if (newNode.nodeType === Node.TEXT_NODE) {
      if (newNode.textContent !== oldNode.textContent) {
        oldNode.textContent = newNode.textContent;
      }
      return;
    }

    // 속성 업데이트
    if (newNode.attributes && oldNode.attributes) {
      [...newNode.attributes].forEach((attr) => {
        const oldAttr = oldNode.getAttribute(attr.name);
        if (oldAttr !== attr.value) {
          oldNode.setAttribute(attr.name, attr.value);
        }
      });
    }

    // 자식 노드들 재귀적으로 비교
    const newChildren = [...newNode.childNodes];
    const oldChildren = [...oldNode.childNodes];
    const maxLen = Math.max(newChildren.length, oldChildren.length);

    for (let i = 0; i < maxLen; i++) {
      if (!oldChildren[i]) {
        oldNode.appendChild(newChildren[i].cloneNode(true));
      } else if (!newChildren[i]) {
        oldNode.removeChild(oldChildren[i]);
      } else {
        this.updateDOM(newChildren[i], oldChildren[i]);
      }
    }
  }

  addEvent(eventType, selector, callback) {
    //이벤트 등록 추상화
    const nonBubblingEvents = ['focus', 'blur', 'mouseenter', 'mouseleave'];

    if (nonBubblingEvents.includes(eventType)) {
      const element = this.$target.querySelector(selector);
      if (element) {
        element.addEventListener(eventType, callback);
      }
    } else {
      this.$target.addEventListener(eventType, (event) => {
        if (!event.target.closest(selector)) return false;
        callback(event);
      });
    }
  }

  destroy() {
    console.log(`${this.constructor.name} will unmount.`);
    this.cleanup();
    this.$target.innerHTML = '';
  }

  cleanup() {
    // 정리작업
  }
}
