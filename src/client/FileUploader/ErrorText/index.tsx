import { type FC } from 'react';

interface ErrorTextProps {
    text: string;
}
export const ErrorText: FC<ErrorTextProps> = ({ text }) => (
    <div className="text-sm text-red-500" aria-live="assertive" data-testid="ErrorText">
        {text}
    </div>
);
