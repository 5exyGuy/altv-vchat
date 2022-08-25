import { configureStore } from '@reduxjs/toolkit';
import { chatReducer } from '../reducers/chat.reducer';

export const chatStore = configureStore({
    reducer: {
        chat: chatReducer,
    },
});
export type RootState = ReturnType<typeof chatStore.getState>;
export type AppDispatch = typeof chatStore.dispatch;
