import { fireEvent, render, type RenderResult } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { FileInput } from './index';

const mockEvent = vi.fn();
const setup = (): RenderResult => render(<FileInput id="abc123" onChange={mockEvent} />);

describe('FileInput', () => {
    it('should be rendered properly', () => {
        const { getByTestId } = setup();

        expect(getByTestId('FileInput')).toBeInTheDocument();
    });

    it('should call the click event on onChange', () => {
        const { getByTestId } = setup();

        const fileInput = getByTestId('FileInput');

        fireEvent.change(fileInput);

        expect(mockEvent).toHaveBeenCalled();
    });
});
