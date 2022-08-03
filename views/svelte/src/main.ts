import './app.scss';
import ChatBox from './ChatBox.svelte';

const app = new ChatBox({
    target: document.getElementById('app'),
});

export default app;
