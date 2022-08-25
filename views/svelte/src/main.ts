import ChatBox from './ChatBox.svelte';
import './app.scss';

const app = new ChatBox({
    target: document.getElementById('app'),
});

export default app;
