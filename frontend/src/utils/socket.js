// utils/socket.js
import { io } from 'socket.io-client';
import { SOCKET_URL } from './constant';

let socket;

export const connectSocket = (userId) => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            query: { userId },
            withCredentials: true,
        });
    }
    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
