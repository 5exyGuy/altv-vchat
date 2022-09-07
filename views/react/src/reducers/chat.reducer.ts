import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Options } from '../interfaces';

export interface ChatState {
    message: string;
    focus: boolean;
    options: Options;
}

const initialState: ChatState = {
    message: '',
    focus: false,
    options: {
        prefix: '/',
        placeholder: 'Type a message...',
        maxCommandSuggestions: 3,
        maxMessageLength: 100,
        maxMessages: 100,
        maxMessageBufferLength: 100,
        scrollStep: 20,
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
        setOptions: (state, action: PayloadAction<Options>) => {
            state.options = action.payload;
        },
    },
});

export const { setMessage, setFocus, setOptions } = chatSlice.actions;

export const chatReducer = chatSlice.reducer;
