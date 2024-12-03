import Component from '../component/component.js';

class Home extends Component {
  template() {
    return Component.html`
      <div>
        <a href="/register">Register</a>
        <a href="/login">Login</a>
      </div>
    `;
  }
}

export default Home;
