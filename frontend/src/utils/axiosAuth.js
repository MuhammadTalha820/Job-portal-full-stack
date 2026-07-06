import axios from 'axios';

export const AUTH_TOKEN_KEY = 'jobwiz_auth_token';

let interceptorRegistered = false;

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        return;
    }

    localStorage.removeItem(AUTH_TOKEN_KEY);
    delete axios.defaults.headers.common.Authorization;
};

export const setupAxiosAuth = () => {
    if (interceptorRegistered) return;

    axios.interceptors.request.use((config) => {
        const token = getAuthToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    interceptorRegistered = true;
};

export const loadAuthToken = () => {
    setupAxiosAuth();
    const token = getAuthToken();
    if (token) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    return token;
};
