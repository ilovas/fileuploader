import { renderHook, act } from '@testing-library/react-hooks';
import { describe, it, expect, vi } from 'vitest';

import labels from '../labels.json';

import { useUploadSingleFile } from './useUploadSingleFile';

const createBlob = (content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    return new File([blob], 'test.txt', { type: 'text/plain' });
};

describe('useUploadSingleFile', () => {
    const api = 'api/upload-single';
    const genericErrorMessage = labels['errorMessages.generic'];

    it('should not have an error message initially', () => {
        const { result } = renderHook(() => useUploadSingleFile(api));

        expect(result.current.errorMessage).toBeUndefined();
    });

    it('should call the submit method and not set an error if successful', async () => {
        const mockFile = createBlob('content');
        const mockFetch = vi.fn().mockResolvedValue({ ok: true });
        vi.stubGlobal('fetch', mockFetch);

        const { result } = renderHook(() => useUploadSingleFile(api));

        await act(async () => {
            await result.current.submit(mockFile);
        });

        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(result.current.errorMessage).toBeUndefined();
    });

    it('should set an error message if fetch fails', async () => {
        const mockFile = createBlob('content');
        const mockFetch = vi.fn().mockResolvedValue({ ok: false });
        vi.stubGlobal('fetch', mockFetch);

        const { result } = renderHook(() => useUploadSingleFile(api));

        await act(async () => {
            await result.current.submit(mockFile);
        });

        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(result.current.errorMessage).toBe(genericErrorMessage);
    });

    it('should set an error message on fetch exception with no error message', async () => {
        const mockFile = createBlob('content');
        const mockFetch = vi.fn().mockRejectedValue('error');
        vi.stubGlobal('fetch', mockFetch);

        const { result } = renderHook(() => useUploadSingleFile(api));

        await act(async () => {
            await result.current.submit(mockFile);
        });

        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(result.current.errorMessage).toBe(genericErrorMessage);
    });

    it('should set an error message on fetch exception', async () => {
        const mockFile = createBlob('content');
        const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
        vi.stubGlobal('fetch', mockFetch);

        const { result } = renderHook(() => useUploadSingleFile(api));

        await act(async () => {
            await result.current.submit(mockFile);
        });

        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(result.current.errorMessage).toBe('Network error');
    });
});
