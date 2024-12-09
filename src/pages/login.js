import Component from '../component/component.js';
import { loginUser } from '../api/userApi.js';

export default class Login extends Component {
  setup() {
    this.state = {
      loginMessage: '',
    };
  }

  template() {
    return `
      <form id="login-form">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
        
        <span id="login-message" class="message">${this.state.loginMessage}</span>
        
        <button type="submit">Login</button>
      </form>
    `;
  }

  setEvent() {
    this.addEvent('submit', '#login-form', this.loginUser.bind(this));
  }

  async loginUser(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    
    if (!email || !password) {
      return;
    }

    try {
      await loginUser({ email, password });
      document.cookie = `refresh=${data.refresh}; path=/; secure: HttpOnly`;
      localStorage.setItem('access', data.access);

      this.setState({
        loginMessage: 'Login successful. Redirecting to home page...',
      });
      setTimeout(() => {
        Router.instance.navigate('/');
      }, 2000);
    } catch (error) {
      this.setState({ loginMessage: 'Login failed. Please check your email and password.' });
    }
  }
}
