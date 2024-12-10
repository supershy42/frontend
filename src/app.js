import Router from './router.js';

export default class App {
  constructor($target) {
    this.$target = $target;
    this.router = new Router(this.$target);
  }
}
