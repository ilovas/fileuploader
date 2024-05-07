import { useState, useCallback } from 'react';

import labels from '../labels.json';

interface UploadResult {
    submit: (file: File, chunkSize: number) => Promise<void>;
    errorMessage?: string;
    progress: number;
}

const genericErrorMessage = labels['errorMessages.generic'];

export const useUploadSingleFileInChunks = (api: string): UploadResult => {
    const [progress, setProgress] = useState<number>(0);
    const [errorMessage, setError] = useState<string | undefined>();

    const resetProgress = useCallback(() => {
        setProgress(0);
    }, []);

    const submit = useCallback(
        async (file: File, chunkSize: number) => {
            resetProgress();

            let chunkIndex = 0;
            let start = 0;
            let end = chunkSize;

            const totalChunks = Math.ceil(file.size / chunkSize);

            const uploadChunk = async (): Promise<void> => {
                // if (chunkIndex >= totalChunks) {
                //     return;
                // }

                const chunk = file.slice(start, Math.min(end, file.size));
                const formData = new FormData();
                formData.append('file', chunk, file.name);
                formData.append('currentChunkIndex', `${chunkIndex}`);
                formData.append('totalChunks', `${totalChunks}`);

                try {
                    await fetch(api, {
                        method: 'POST',
                        body: formData,
                    });

                    chunkIndex++;
                    start = end;
                    end = Math.min(start + chunkSize, file.size);

                    setProgress((chunkIndex / totalChunks) * 100);

                    if (chunkIndex < totalChunks) {
                        await uploadChunk();
                    }
                } catch (error_) {
                    const errorText = error_ instanceof Error ? error_.message : genericErrorMessage;
                    setError(errorText);
                }
            };

            await uploadChunk();
        },
        [api, genericErrorMessage]
    );

    return { submit: (file, chunkSize) => submit(file, chunkSize), errorMessage, progress };
};
