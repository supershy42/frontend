import Component from '../component/component.js';
import { registerUser } from '../api/userApi.js';
import Router from '../router.js';

class Register extends Component {
  setup() {
    this.$state = {
      nickname: '',
      email: '',
      password: '',
      error: null,
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
          </div>
          <div>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit">Register</button>
        </form>
        <div id="error-message" style="color: red;"></div>
      </div>
    `;
  }

  mounted() {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  async handleSubmit(event) {
    event.preventDefault(); // 기본 폼 제출 방지

    const nickname = event.target.nickname.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const userData = { nickname, email, password };
      await registerUser(userData); // API 호출
      alert('Registration successful!'); // 성공 메시지
      Router.instance.navigate('/login'); // 로그인 페이지로 이동
    } catch (error) {
      this.setState({ error: error.message });
      document.getElementById('error-message').innerText = this.$state.error; // 오류 메시지 표시
    }
  }
}

export default Register;
