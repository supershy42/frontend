import Component from '../component/component.js';
import Router from '../router.js';

class Home extends Component {
  setup() {
    this.$state = {
      isLogin: localStorage.getItem('access') ? true : false,
    };
  }

  template() {
    if (this.$state.isLogin) {
      return Component.html`
        <div>
          <button type="button" class="nav-link">Logout</button>
        </div>
      `;
    }
    return Component.html`
      <div>
        <button type="button" class="nav-link">Register</button>
        <button type="button" class="nav-link">Login</button>
      </div>
    `;
  }

  setEvent() {
    this.addEvent('click', '.nav-link', (event) => {
      const text = event.target.textContent;
      if (text === 'Register') {
        Router.instance.navigate('/register');
      } else if (text === 'Login') {
        Router.instance.navigate('/login');
      } else if (text === 'Logout') {
        localStorage.removeItem('access');
        document.cookie = 'refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        Router.instance.navigate('/');
      }
    });
  }
}

export default Home;
