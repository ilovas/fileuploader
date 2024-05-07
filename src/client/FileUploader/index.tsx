import isEqual from 'lodash/isequal';
import { type ChangeEvent, type FC, useState, type FormEvent, useEffect, memo } from 'react';

import { Button } from './Button';
import { ErrorText } from './ErrorText';
import { FileInput } from './FileInput';
import { ProgressBar } from './ProgressBar';
import { useUploadSingleFile } from './hooks/useUploadSingleFile';
import { useUploadSingleFileInChunks } from './hooks/useUploadSingleFileInChunks';
import labels from './labels.json';
import { fileExtensionValidation, fileSizeValidation } from './tools/validation';

interface FileUploaderProps {
    acceptedFileTypes?: string[];
    chunkSize?: number;
    sizeLimit?: number;
    fileUploadLabel?: string;
    buttonLabel?: string;
    progressBarVisible?: boolean;
    onFileChange?: (file: File) => void;
    onUploadSuccess?: () => void;
    onError?: (error: string) => void;
}

const fileUploadApi = {
    single: 'api/upload-single',
    chunk: 'api/upload-chunk',
};

// TODO: unit test
// TODO: nth: use aria-invalid on error
const FileUploaderComponent: FC<FileUploaderProps> = ({
    acceptedFileTypes = ['application/pdf', 'image/jpeg', 'image/png'],
    chunkSize,
    sizeLimit = 10485760,
    fileUploadLabel = labels.fileUploadLabel,
    buttonLabel = labels.button,
    progressBarVisible = true,
    onFileChange,
    onUploadSuccess,
    onError,
}) => {
    const [file, setFile] = useState<File | undefined>();
    const [error, setError] = useState<string | undefined>();
    const [disable, setDisable] = useState<boolean>(false);
    const [isSuccessMessageVisible, setSuccessMessageVisible] = useState<boolean>(false);
    const [progressBarCounterVisible, setprogressBarCounterVisible] = useState<boolean>(false);
    const [chunkSubmitProgress, setChunkSubmitProgress] = useState<number>(0);

    const { submit, errorMessage } = useUploadSingleFile(fileUploadApi.single);
    const {
        submit: chunkSubmit,
        errorMessage: chunkErrorMessage,
        progress: initialChunkSubmitProgress,
    } = useUploadSingleFileInChunks(fileUploadApi.chunk);

    useEffect(() => {
        setChunkSubmitProgress(initialChunkSubmitProgress);
    }, [initialChunkSubmitProgress]);

    const cleanUpStates = () => {
        setDisable(false);
        setError(undefined);
    };
    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        const file = files?.[0];

        cleanUpStates();
        setFile(file);
        setprogressBarCounterVisible(false);
        setSuccessMessageVisible(false);
        setChunkSubmitProgress(0);

        onFileChange && file && onFileChange(file);

        if (file) {
            const isValid = fileExtensionValidation(file, acceptedFileTypes) && fileSizeValidation(file, sizeLimit);

            if (isValid) {
                setFile(file);
            } else {
                const message = labels['errorMessages.single'];
                setError(message);
                onError && onError(message);
            }
        }
    };

    const uploadSingleFileEvent = async (event: FormEvent<HTMLInputElement>) => {
        event.preventDefault();
        setDisable(true);

        if (file) {
            await submit(file);

            setSuccessMessageVisible(true);
            onUploadSuccess && onUploadSuccess();
            cleanUpStates();
        }

        errorMessage && setError(errorMessage);
        onError && errorMessage && onError(errorMessage);
    };

    const uploadChunkFileEvent = async (event: FormEvent<HTMLInputElement>) => {
        event.preventDefault();
        setDisable(true);
        setprogressBarCounterVisible(true);

        if (file && chunkSize) {
            await chunkSubmit(file, chunkSize);

            setSuccessMessageVisible(true);
            onUploadSuccess && onUploadSuccess();
            cleanUpStates();
        }

        chunkErrorMessage && setError(chunkErrorMessage);
        onError && chunkErrorMessage && onError(chunkErrorMessage);
    };

    return (
        <section className="p-4 bg-white/75 border border-zinc-500 rounded" data-testid="FileUploader">
            {progressBarVisible && chunkSize && (
                <ProgressBar value={chunkSubmitProgress} visible={progressBarCounterVisible} />
            )}
            <div className="mb-3">
                <h1 className="font-semibold mb-1">
                    <label htmlFor="file-upload" id="file-upload-label">
                        {fileUploadLabel}
                    </label>
                </h1>
                <FileInput id="file-upload-label" onChange={onChangeHandler} />
                {!!error && <ErrorText text={error} />}
            </div>
            <Button
                onClickEvent={(e) => (chunkSize ? uploadChunkFileEvent(e) : uploadSingleFileEvent(e))}
                disabled={disable}
            >
                {buttonLabel}
            </Button>
            {isSuccessMessageVisible && (
                <div className="format text-md" aria-live="polite" data-testid="SuccessText">
                    {labels.success}
                </div>
            )}
        </section>
    );
};

const propCompare = (prevProps: FileUploaderProps, nextProps: FileUploaderProps) => isEqual(prevProps, nextProps);
export const FileUploader = memo(FileUploaderComponent, propCompare);
