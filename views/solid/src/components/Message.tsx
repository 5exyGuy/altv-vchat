import { MessageType } from '../enums';
import { InfoIcon } from './icons/InfoIcon';
import { SuccessIcon } from './icons/SuccessIcon';
import { WarningIcon } from './icons/WarningIcon';
import { ErrorIcon } from './icons/ErrorIcon';
import classnames from 'classnames';
import './Message.scss';
import { createEffect, onMount } from 'solid-js';

export function Message({ type = MessageType.Default, content = '' }) {
    let contentRef: HTMLDivElement | undefined;

    onMount(() => {
        contentRef!.innerHTML = content;
    });

    createEffect(() => {
        contentRef!.innerHTML = content;
    });

    return (
        <div
            class={classnames('flex flex-row items-center gap-[8px] text-white text-base select-none fade-in', {
                'py-[4px]': type !== MessageType.Default && type !== MessageType.Empty,
                'px-[8px]': type !== MessageType.Empty,
                info: type === MessageType.Info,
                success: type === MessageType.Success,
                warning: type === MessageType.Warning,
                error: type === MessageType.Error,
            })}
        >
            {type === MessageType.Info && <InfoIcon />}
            {type === MessageType.Success && <SuccessIcon />}
            {type === MessageType.Warning && <WarningIcon />}
            {type === MessageType.Error && <ErrorIcon />}
            <div ref={contentRef} />
        </div>
    );
}
