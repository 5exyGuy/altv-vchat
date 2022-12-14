import { container } from 'tsyringe';
import { Chat } from './chat';

container.resolve(Chat).start();
