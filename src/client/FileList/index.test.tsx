import { render, waitFor, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import labels from './labels.json';

import { FileList } from './index';

const mockFetch = vi.fn();

vi.stubGlobal('fetch', mockFetch);

beforeEach(() => {
    mockFetch.mockReset();
});

describe('FileList Component', () => {
    it('should fetch and display a list of files', async () => {
        const mockFiles = [{ name: 'file1.txt' }, { name: 'file2.txt' }];
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ files: mockFiles }),
        });

        const { getByText } = render(<FileList update={1} />);

        await waitFor(() => {
            expect(getByText(labels.title)).toBeInTheDocument();

            for (const file of mockFiles) {
                expect(getByText(file.name)).toBeInTheDocument();
            }
        });
    });

    it('should handle fetch errors gracefully', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Failed to fetch files' }),
        });

        const { queryByText } = render(<FileList update={1} />);

        await waitFor(() => {
            expect(queryByText(labels.title)).not.toBeInTheDocument();
        });
    });
});
