import { MessageType } from '../enums';
import { InfoIcon } from './icons/InfoIcon';
import { SuccessIcon } from './icons/SuccessIcon';
import { WarningIcon } from './icons/WarningIcon';
import { ErrorIcon } from './icons/ErrorIcon';
import classnames from 'classnames';
import './Message.scss';

export function Message(props: { type: MessageType; content: string }) {
    return (
        <div
            class={classnames('flex flex-row items-center gap-[8px] text-white text-base select-none fade-in', {
                'py-[4px]': props.type !== MessageType.Default && props.type !== MessageType.Empty,
                'px-[8px]': props.type !== MessageType.Empty,
                info: props.type === MessageType.Info,
                success: props.type === MessageType.Success,
                warning: props.type === MessageType.Warning,
                error: props.type === MessageType.Error,
            })}
        >
            {props.type === MessageType.Info && <InfoIcon />}
            {props.type === MessageType.Success && <SuccessIcon />}
            {props.type === MessageType.Warning && <WarningIcon />}
            {props.type === MessageType.Error && <ErrorIcon />}
            <div innerHTML={props.content} />
        </div>
    );
}
