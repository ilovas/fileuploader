import { type ChangeEvent, type FC } from 'react';

interface FileInputProps {
    id: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    label: string;
}
export const FileInput: FC<FileInputProps> = ({ id, label, onChange }) => (
    <input
        className="block w-full mb-1 text-sm text-gray-200 border border-gray-600 rounded-lg cursor-pointer bg-gray-700 focus:outline-none placeholder-gray-400"
        id={id}
        type="file"
        onChange={onChange}
        aria-labelledby={label}
        data-testid="FileInput"
    />
);
