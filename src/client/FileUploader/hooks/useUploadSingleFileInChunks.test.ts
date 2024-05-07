import { renderHook, act } from '@testing-library/react-hooks';
import { describe, it, expect, vi } from 'vitest';

import labels from '../labels.json';

import { useUploadSingleFileInChunks } from './useUploadSingleFileInChunks';

const chunkSize = 10;
const createBlob = (content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    return new File([blob], 'test.txt', { type: 'text/plain' });
};

describe('useUploadSingleFileInChunks', () => {
    const api = 'api/upload-chunk';
    const genericErrorMessage = labels['errorMessages.generic'];

    it('should update progress during successful chunked upload', async () => {
        const content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
        const mockFile = createBlob(content);

        const totalChunks = Math.ceil(mockFile.size / chunkSize);

        const mockFetch = vi.fn().mockResolvedValue({ ok: true });
        vi.stubGlobal('fetch', mockFetch);

        const { result } = renderHook(() => useUploadSingleFileInChunks(api));

        await act(async () => {
            await result.current.submit(mockFile, chunkSize);
        });

        expect(result.current.progress).toBe(100);
        expect(mockFetch).toHaveBeenCalledTimes(totalChunks);
    });

    it('should set an error message if fetch throws an exception', async () => {
        const content = 'This will throw an error.';
        const mockFile = createBlob(content);

        const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
        vi.stubGlobal('fetch', mockFetch);

        const { result } = renderHook(() => useUploadSingleFileInChunks(api));

        await act(async () => {
            await result.current.submit(mockFile, chunkSize);
        });

        expect(result.current.errorMessage).toBe('Network error');
    });

    it('should set an error message if fetch throws an exception with no Error', async () => {
        const content = 'This will throw an error.';
        const mockFile = createBlob(content);

        const mockFetch = vi.fn().mockRejectedValue('Network error');
        vi.stubGlobal('fetch', mockFetch);

        const { result } = renderHook(() => useUploadSingleFileInChunks(api));

        await act(async () => {
            await result.current.submit(mockFile, chunkSize);
        });

        expect(result.current.errorMessage).toBe(genericErrorMessage);
    });
});
