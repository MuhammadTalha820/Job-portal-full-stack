import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../redux/messagesSlice';
import { connectSocket, getSocket } from '../utils/socket';

const useGetRealTimeMessages = () => {
    const dispatch = useDispatch();
    const userId = useSelector((store) => store.auth.user?._id);

    useEffect(() => {
        const socket = userId ? connectSocket(userId) : getSocket();
        if (!socket || typeof socket.on !== 'function') return;

        const handleNew = (newMessage) => {
            dispatch(addMessage(newMessage));
        };

        socket.on('newMessage', handleNew);
        return () => {
            socket.off('newMessage', handleNew);
        };
    }, [userId, dispatch]);
};

export default useGetRealTimeMessages;
