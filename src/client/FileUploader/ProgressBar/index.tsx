import { type FC } from 'react';

interface ProgressBarProps {
    value: number;
    visible: boolean;
}
export const ProgressBar: FC<ProgressBarProps> = ({ value, visible }) => (
    <div
        data-testid="ProgressBarContainer"
        className="w-full bg-gray-200 rounded-full mb-2 h-1 border-1"
        aria-live="polite"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
    >
        {visible && (
            <div
                data-testid="ProgressBar"
                className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full transition-all ease-out h-full relative w-0"
                style={{ width: `${value}%` }}
            />
        )}
    </div>
);
