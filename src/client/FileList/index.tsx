import { type FC, useEffect, useState } from 'react';

import labels from './labels.json';

interface FileListProps {
    counter?: number;
}
interface FileListResponse {
    files: File[];
}

const api = '/api/files';
export const FileList: FC<FileListProps> = ({ counter }) => {
    const [list, setList] = useState<File[]>([]);

    useEffect(() => {
        fetch(api, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data: FileListResponse) => {
                setList(data.files);
            })
            .catch((error) => console.error(error));
    }, [counter]);

    if (!list || list.length === 0) {
        return;
    }

    return (
        <section className="p-4 bg-white/75 border border-zinc-500 rounded">
            <h1 className="font-semibold mb-1">{labels.title}</h1>
            <ul className="ml-4">
                {list.map((file) => {
                    return (
                        <li key={file.name} className="max-w-md space-y-1 list-decimal">
                            {file.name}
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};
