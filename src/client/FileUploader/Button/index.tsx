import { type FC, type FormEvent } from 'react';

interface ButtonProps {
    children: string;
    onClickEvent: (e: FormEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}
export const Button: FC<ButtonProps> = ({ children, onClickEvent, disabled }) => {
    const commonClassNames = 'text-white w-full font-medium rounded-lg text-sm px-3 py-1';
    const classNames = disabled
        ? `${commonClassNames} bg-gray-300 cursor-not-allowed`
        : `${commonClassNames} bg-blue-700 hover:bg-blue-800 cursor-pointer`;

    return (
        <input
            className={classNames}
            type="button"
            onClick={(e) => onClickEvent(e)}
            disabled={disabled}
            value={children}
            aria-label={children}
            data-testid="Button"
        />
    );
};
