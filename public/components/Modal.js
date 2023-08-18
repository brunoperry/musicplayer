import Component from './Component.js';

export default class Modal extends Component {
  #currentChild = null;
  constructor(elemID, callback) {
    super(elemID, callback);

    this.element.querySelector('.cancel').onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      this.hide();
    };

    this.#setupLayout();
  }

  #setupLayout() {
    //LOGIN FORM

    const loginForm = this.element.querySelector('#login');
    loginForm.onsubmit = async (e) => {
      e.stopPropagation();
      e.preventDefault();

      const credentials = {
        username: loginForm.querySelector('#username').value,
        password: loginForm.querySelector('#password').value,
      };

      const req = await fetch('https://api.brunoperry.net/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      const res = await req.json();
      if (res.status === 200) {
        localStorage.setItem('musicplayertoken', res.token);

        // To retrieve the JWT token from local storage
        // const storedJwtToken = localStorage.getItem('jwtToken');

        // // To remove the JWT token from local storage (e.g., on logout)
        // localStorage.removeItem('jwtToken');
        window.location.reload();
      } else {
        console.log(res.message);
      }

      // if (res.status === 1) {
      //   window.location.reload();
      // } else {
      //   console.log('there was an error:', res.message);
      // }
    };
  }

  show(elemID) {
    this.#currentChild = this.element.querySelector(`#${elemID}`);

    if (!this.#currentChild) {
      return;
    }

    this.element.style.display = 'flex';
    requestAnimationFrame(() => {
      this.element.style.transform = 'scaleY(1)';
      setTimeout(() => {
        this.#currentChild.style.display = 'flex';
        setTimeout(() => {
          this.#currentChild.style.transform = 'translateY(0)';
          this.#currentChild.style.opacity = 1;
        }, this.SPEED);
      }, this.SPEED);
    });
  }

  hide() {
    if (this.#currentChild) {
      this.#currentChild.style.display = 'none';
      this.#currentChild.style.transform = 'translateY(20px)';
      this.#currentChild.style.opacity = 0;
    }
    this.element.style.transform = 'scaleY(0)';
  }

  do;
}
