import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useUploadSingleFile } from './hooks/useUploadSingleFile';
import { useUploadSingleFileInChunks } from './hooks/useUploadSingleFileInChunks';

import { FileUploader } from './index';

const chunkSubmit = vi.fn();
const singleSubmit = vi.fn();
const onFileChange = vi.fn();
const onUploadSuccess = vi.fn();
const onError = vi.fn();

const mocks = vi.hoisted(() => ({
    useUploadSingleFile: vi.fn(() => ({
        submit: singleSubmit,
        errorMessage: '',
    })),
    useUploadSingleFileInChunks: vi.fn(() => ({
        submit: chunkSubmit,
        errorMessage: '',
        progress: 10,
    })),
}));

vi.mock('./hooks/useUploadSingleFile', () => ({
    useUploadSingleFile: mocks.useUploadSingleFile,
}));

vi.mock('./hooks/useUploadSingleFileInChunks', () => ({
    useUploadSingleFileInChunks: mocks.useUploadSingleFileInChunks,
}));

vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));

describe('FileUploader', () => {
    beforeEach(() => {
        vi.resetModules();
        singleSubmit.mockReset();
    });
    const setup = (props = {}) => {
        return render(<FileUploader {...props} />);
    };

    it('should be render properly without props', () => {
        const { getByTestId, queryByTestId } = setup();

        const fileInput = getByTestId('FileInput');
        expect(queryByTestId('ProgressBarContainer')).toBeNull();
        expect(fileInput).toBeInTheDocument();
        expect(getByTestId('Button')).toBeInTheDocument();
    });

    it('should re-render when chunkSize changes', () => {
        const { rerender, getByTestId } = setup({
            chunkSize: 1024,
        });

        rerender(<FileUploader chunkSize={2048} />);

        const button = getByTestId('Button');
        expect(button).toBeInTheDocument();
    });

    it('should not re-render if props dont change', () => {
        const { rerender, getByTestId } = setup({
            chunkSize: 1024,
        });

        rerender(<FileUploader chunkSize={1024} />);

        const button = getByTestId('Button');
        expect(button).toBeInTheDocument();
    });

    it('should call onFileChange prop', () => {
        const { getByTestId } = setup({
            onFileChange,
        });

        const fileInput = getByTestId('FileInput');

        const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

        fireEvent.change(fileInput, { target: { files: [mockFile] } });

        expect(onFileChange).toBeCalledWith(mockFile);
    });

    it('should select a new valid file', () => {
        const { getByTestId } = setup();

        const fileInput = getByTestId('FileInput');
        const button = getByTestId('Button');

        const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

        fireEvent.change(fileInput, { target: { files: [mockFile] } });

        expect(button.disabled).toBeFalsy();
    });

    it('should display error when selecting an invalid file', () => {
        const { getByTestId, queryByTestId } = setup({
            onError,
        });

        const fileInput = getByTestId('FileInput');
        const button = getByTestId('Button');

        const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });

        fireEvent.change(fileInput, { target: { files: [mockFile] } });

        expect(button.disabled).toBeFalsy();
        expect(onError).toHaveBeenCalled();
        expect(queryByTestId('ErrorText')).toBeInTheDocument();
    });

    it('should not render ProgressBar when the progressBarVisible is false', () => {
        const { queryByTestId } = setup({
            progressBarVisible: false,
        });

        expect(queryByTestId('ProgressBarContainer')).toBeNull();
    });

    it('should select a new valid file and submit as a single file', async () => {
        const { getByTestId } = setup({
            onUploadSuccess,
        });

        const fileInput = getByTestId('FileInput');
        const button = getByTestId('Button');

        const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

        fireEvent.change(fileInput, { target: { files: [mockFile] } });

        expect(button.disabled).toBeFalsy();

        fireEvent.click(button);

        expect(singleSubmit).toHaveBeenCalled();

        await waitFor(() => expect(onUploadSuccess).toHaveBeenCalled());
    });

    it('should select a new valid file and fail the request', async () => {
        const errorMessage = 'Upload failed';
        vi.mocked(useUploadSingleFile).mockReturnValue({
            submit: vi.fn(),
            errorMessage,
        });
        const { getByTestId, queryByTestId } = setup({
            onError,
        });

        const fileInput = getByTestId('FileInput');
        const button = getByTestId('Button');

        const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

        fireEvent.change(fileInput, { target: { files: [mockFile] } });

        expect(button.disabled).toBeFalsy();

        fireEvent.click(button);

        await waitFor(() => expect(onError).toHaveBeenCalled());
        await waitFor(() => expect(queryByTestId('ErrorText')).toBeInTheDocument());
    });

    it('should select a new valid file and fail the request on submit in chunks', async () => {
        const { getByTestId } = setup({
            chunkSize: 1024,
            onUploadSuccess,
        });

        const fileInput = getByTestId('FileInput');
        const button = getByTestId('Button');

        const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

        fireEvent.change(fileInput, { target: { files: [mockFile] } });

        expect(button.disabled).toBeFalsy();

        fireEvent.click(button);

        expect(chunkSubmit).toHaveBeenCalled();
        expect(onUploadSuccess).toHaveBeenCalled();

        await waitFor(() => expect(getByTestId('SuccessText')).toBeInTheDocument());
    });

    it('should select a new valid file  and fail the request on submit in chunks', async () => {
        const errorMessage = 'Upload failed';
        vi.mocked(useUploadSingleFileInChunks).mockReturnValue({
            submit: vi.fn(),
            progress: 0,
            errorMessage,
        });
        const { getByTestId, queryByTestId } = setup({
            chunkSize: 1024,
            onError,
        });
        const fileInput = getByTestId('FileInput');
        const button = getByTestId('Button');

        const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

        fireEvent.change(fileInput, { target: { files: [mockFile] } });

        expect(button.disabled).toBeFalsy();

        fireEvent.click(button);

        expect(chunkSubmit).toHaveBeenCalled();

        await waitFor(() => expect(onError).toHaveBeenCalled());
        await waitFor(() => expect(queryByTestId('ErrorText')).toBeInTheDocument());
    });
});
