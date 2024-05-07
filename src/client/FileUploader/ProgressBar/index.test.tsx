import { render, type RenderResult } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { ProgressBar } from './index';

const setup = (visible: boolean): RenderResult => render(<ProgressBar value={50} visible={visible} />);

describe('ProgressBar', () => {
    it('should be rendered properly without the progressBar', () => {
        const { getByTestId, queryByTestId } = setup(false);

        expect(getByTestId('ProgressBarContainer')).toBeInTheDocument();
        expect(queryByTestId('ProgressBar')).toBeNull();
    });

    it('should be rendered properly with the progressBar', () => {
        const { getByTestId } = setup(true);

        expect(getByTestId('ProgressBarContainer')).toBeInTheDocument();
        expect(getByTestId('ProgressBar')).toBeInTheDocument();
    });
});
