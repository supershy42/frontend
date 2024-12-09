import Home from './pages/home.js';
import Register from './pages/register.js';
// import VerifyEmail from './pages/verify-email.js';
// import Login from './pages/login.js';
// import Profile from '@pages/profile';
// import Game from '@pages/game/game';

const routes = {
  '/': Home,
  '/register': Register,
  //   '/verify-email': VerifyEmail,
  //   '/login': Login,
};

export default class Router {
  constructor($app) {
    if (Router.instance) {
      return Router.instance;
    }
    Router.instance = this;
    this.$app = $app;
    this.$currentComponent = null;
    this.init();
  }

  init() {
    window.onpopstate = () => {
      this.render();
    };
    this.render();
  }

  render() {
    const path = window.location.pathname;
    const Component = routes[path] || Home;

    if (this.$currentComponent) {
      this.$currentComponent.destroy();
    }
    this.$currentComponent = new Component(this.$app);
  }

  navigate(path) {
    if (window.location.pathname === path) return;
    
    window.history.pushState({}, '', path);
    this.render();
  }
}
