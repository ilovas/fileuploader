import { render, type RenderResult } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { App } from './App';

const setup = (): RenderResult => render(<App />);

describe('App', () => {
    it('should be rendered properly', () => {
        const { getByTestId } = setup();

        expect(getByTestId('FileUploader')).toBeInTheDocument();
    });
});
