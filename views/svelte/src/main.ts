import ChatBox from './ChatBox.svelte';
import './main.scss';

const app = new ChatBox({
    target: document.getElementById('app'),
});

export default app;
