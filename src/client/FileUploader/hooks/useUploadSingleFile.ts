import { useState } from 'react';

import labels from '../labels.json';

interface UploadResult {
    submit: (file: File) => Promise<void>;
    errorMessage?: string;
}

const genericErrorMessage = labels['errorMessages.generic'] as string;
export const useUploadSingleFile = (api: string): UploadResult => {
    const [errorMessage, setError] = useState<string>();

    const submit = async (file: File): Promise<void> => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(api, { method: 'POST', body: formData });

            setError(!response.ok ? genericErrorMessage : undefined);
        } catch (error_) {
            const errorMessage = error_ instanceof Error ? error_.message : genericErrorMessage;
            setError(errorMessage);
        }
    };

    return { submit: (file) => submit(file), errorMessage };
};
