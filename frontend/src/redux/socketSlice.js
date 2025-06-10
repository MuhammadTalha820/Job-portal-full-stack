// src/redux/messagesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name: "socket",
    initialState: {
        socket: null
    },
    reducers: {
        setSocket: (state, action) => {
            state.list = action.payload;
        }
    }
});
export const { setSocket } = socketSlice.actions // ✅ Correct
export default socketSlice.reducer
