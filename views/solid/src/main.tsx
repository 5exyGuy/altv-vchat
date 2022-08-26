/* @refresh reload */
import { render } from 'solid-js/web';
import { ChatBox } from './ChatBox';
import './main.scss';

render(() => <ChatBox />, document.getElementById('root') as HTMLElement);
