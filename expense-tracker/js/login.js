/**
 * login.js
 * UI Logic for Authentication
 */
import { Auth } from './auth.js';

export const LoginUI = {
    init: () => {
        const authForm = document.getElementById('auth-form');
        const toggleAuth = document.getElementById('toggle-auth');
        const authTitle = document.getElementById('auth-title');
        const authSubmit = document.getElementById('auth-submit');
        const authError = document.getElementById('auth-error');

        let isLogin = true;

        toggleAuth.addEventListener('click', (e) => {
            e.preventDefault();
            isLogin = !isLogin;
            authTitle.innerText = isLogin ? 'Sign in to your account' : 'Create a new account';
            authSubmit.innerText = isLogin ? 'Sign in' : 'Sign up';
            toggleAuth.innerText = isLogin ? 'create a new account' : 'already have an account?';
            authError.classList.add('hidden');
        });

        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(authForm);
            const email = formData.get('email');
            const password = formData.get('password');

            try {
                if (isLogin) {
                    Auth.login(email, password);
                } else {
                    Auth.signup(email, password);
                }
                authForm.reset();
            } catch (err) {
                authError.innerText = err.message;
                authError.classList.remove('hidden');
            }
        });
    }
};
