import Component from '../component/component.js';
import Router from '../router.js';

class Home extends Component {
  template() {
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
      }
    });
  }
}

export default Home;
