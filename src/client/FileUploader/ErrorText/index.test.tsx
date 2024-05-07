import { render, type RenderResult } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { ErrorText } from './index';

const setup = (): RenderResult => render(<ErrorText text="some content" />);

describe('ErrorText', () => {
    it('should be rendered properly', () => {
        const { getByTestId } = setup();

        expect(getByTestId('ErrorText')).toBeInTheDocument();
    });
});
