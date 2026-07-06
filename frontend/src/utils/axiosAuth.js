import axios from 'axios';

export const AUTH_TOKEN_KEY = 'jobwiz_auth_token';

export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        return;
    }

    localStorage.removeItem(AUTH_TOKEN_KEY);
    delete axios.defaults.headers.common.Authorization;
};

export const loadAuthToken = () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    return token;
};
