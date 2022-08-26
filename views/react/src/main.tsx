import ReactDOM from 'react-dom/client';
import { chatStore } from './stores/chat.store';
import { Provider } from 'react-redux';
import { ChatBox } from './ChatBox';
import './main.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Provider store={chatStore}>
        <ChatBox />
    </Provider>,
);
