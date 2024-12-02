import Router from './router.js';

export default class App {
  constructor($target) {
    this.$target = $target;
    this.router = new Router(this.$target);
    this.setup();
  }

  setup() {
    this.$target = $target;
    this.bindEvents();
  }

  template() {
    return `
            <header>
                <a href="/">Home</a>
                <a  href="/register">SignUp</a>
                <a href="/login">Login</a>
            </header>
            <main></main>
        `;
  }

  bindEvents() {
    this.$target.addEventListener('click', (e) => {
      const target = e.target.closest('a');
      if (target) {
        e.preventDefault();
        const path = target.getAttribute('href');
        this.router.navigate(path);
      }
    });
  }
}
