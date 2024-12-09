import Component from '../component/component.js';
import { checkNickname, registerUser, verifyEmail } from '../api/userApi.js';
import Router from '../router.js';

class Register extends Component {
  setup() {
    this.$state = {
      nicknameMessage: '',
      emailMessage: '',
      verificationMessage: '',
      showVerificationSection: false,
      lastCheckedNickname: '',
      lastCheckedEmail: '',
    };
  }

  template() {
    return Component.html`
      <div>
        <h1>Register</h1>
        <form id="register-form">
          <div>
            <label for="nickname">Nickname:</label>
            <input type="text" id="nickname" name="nickname" required />
            <span id="nickname-message" class="message">${this.$state.nicknameMessage}</span>
          </div>
          <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required />
            <label for="confirm-password">Confirm Password:</label>
            <input type="password" id="confirm-password" name="confirm-password" required />
          </div>
          <div>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required />
            <span id="email-message" class="message">${this.$state.emailMessage}</span>
            <button type="button" id="send-verification-code">Send Verification Code</button>
          </div>
          <div>
            <label for="verification-code" style="display: ${this.$state.showVerificationSection} ? 'block' : 'none';">Verification Code:</label>
            <input type="text" id="verification-code" name="verification-code" required />
            <span id="verification-message" class="message">${this.$state.verificationMessage}</span>
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    `;
  }

  setEvent() {
    this.addEvent('blur', '#nickname', this.checkNickname.bind(this));
    this.addEvent('click', '#send-verification-code', this.sendVerificationCode.bind(this));
    this.addEvent('submit', '#register-form', this.registerUser.bind(this));
  }

  async checkNickname(event) {
    const nickname = event.target.value;

    if (this.$state.lastCheckedNickname === nickname) return;

    try {
      const data = await checkNickname({ nickname });
      this.setState({ nicknameMessage: 'Nickname is available' });
      this.setState({ lastCheckedEmail: nickname })
    } catch (error) {
      this.setState({ nicknameMessage: error.message });
    }
  }

  async sendVerificationCode() {
    const email = document.getElementById('email').value;
    if (this.$state.lastCheckedEmail === email) return;

    try {
      await verifyEmail({ email });
      this.setState({ emailMessage: 'Verification code sent', showVerificationSection: true });
    } catch (error) {
      this.setState({ emailMessage: error.message });
    }
  }

  async registerUser(event) {
    event.preventDefault();
    const nickname = document.getElementById('nickname').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const email = document.getElementById('email').value;
    const verificationCode = document.getElementById('verification-code').value;

    if (password !== confirmPassword) {
      this.setState({ verificationMessage: 'Passwords do not match' });
      return;
    }

    if (nickname === this.$state.lastCheckedNickname) {
      this.setState({ nicknameMessage: 'Please check nickname availability' });
      return;
    }

    if (email === this.$state.lastCheckedEmail) {
      this.setState({ emailMessage: 'Please check email availability' });
      return;
    }

    try {
      await registerUser({ nickname, password, email, verificationCode });
      this.setState({ verificationMessage: 'Registration successful. Redirecting to login page...' });
      this.setTimeout(() => {
        Router.instance.navigate('/login');
      }, 2000);
    } catch (error) {
      this.setState({ verificationMessage: error.message });
    }
  }
}

export default Register;
