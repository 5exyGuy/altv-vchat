import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ChatState {
    message: string;
    focus: boolean;
    options: {
        scrollStep: number;
        inputPlaceholder: string;
        cmdPrefix: string;
        maxMessageBufferLength: number;
        maxCmdSuggestions: number;
    };
}

const initialState: ChatState = {
    message: '',
    focus: false,
    options: {
        scrollStep: 20,
        inputPlaceholder: 'Type a message...',
        cmdPrefix: '/',
        maxMessageBufferLength: 100,
        maxCmdSuggestions: 3,
    },
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setMessage: (state, action: PayloadAction<string>) => {
            state.message = action.payload;
        },
        setFocus: (state, action: PayloadAction<boolean>) => {
            state.focus = action.payload;
        },
    },
});

export const { setMessage, setFocus } = chatSlice.actions;

export const chatReducer = chatSlice.reducer;
