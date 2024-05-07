import { fireEvent, render, type RenderResult } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Button } from './index';

const mockEvent = vi.fn();
const label = 'Label';
const setup = (disabled: boolean): RenderResult =>
    render(
        <Button onClickEvent={mockEvent} disabled={disabled}>
            {label}
        </Button>
    );

describe('Button', () => {
    it('should be rendered properly', () => {
        const { getByTestId } = setup(false);
        const button = getByTestId('Button');

        expect(button).toBeInTheDocument();
        expect(button.value).toEqual(label);
        expect(button.className).toContain('cursor-pointer');
    });

    it('should call the click event on onClick', () => {
        const { getByTestId } = setup(false);
        const button = getByTestId('Button');

        expect(button).toBeInTheDocument();

        fireEvent.click(button);

        expect(mockEvent).toHaveBeenCalled();
    });

    it('should be rendered properly when the button is disabled', () => {
        const { getByTestId } = setup(true);

        expect(getByTestId('Button').disabled).toBeTruthy();
        expect(getByTestId('Button').className).toContain('cursor-not-allowed');
    });
});
