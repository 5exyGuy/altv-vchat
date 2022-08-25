import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ChatState {
    message: string;
    focus: boolean;
}

const initialState: ChatState = {
    message: '',
    focus: false,
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

export const { setMessage } = chatSlice.actions;

export const chatReducer = chatSlice.reducer;
