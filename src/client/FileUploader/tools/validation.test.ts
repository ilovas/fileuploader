import { describe, it, expect } from 'vitest';

import { fileExtensionValidation, fileSizeValidation } from './validation';

const createBlob = (content: string, file: string, type: string) => {
    const blob = new Blob([content], { type });
    return new File([blob], file, { type });
};

describe('fileExtensionValidation', () => {
    it('should return true for an accepted file type', () => {
        const mockFile = createBlob('content', 'test.pdf', 'application/pdf');
        const acceptedFileTypes = ['application/pdf', 'image/jpeg', 'image/png'];

        const isValid = fileExtensionValidation(mockFile, acceptedFileTypes);

        expect(isValid).toBe(true);
    });

    it('should return false for a non-accepted file type', () => {
        const mockFile = createBlob('content', 'test.txt', 'text/plain');
        const acceptedFileTypes = ['application/pdf', 'image/jpeg', 'image/png'];

        const isValid = fileExtensionValidation(mockFile, acceptedFileTypes);

        expect(isValid).toBe(false);
    });
});

describe('fileSizeValidation', () => {
    it('should return true for a file within the size limit', () => {
        const mockFile = createBlob('content', 'test.txt', 'text/plain');

        const sizeLimit = 10;
        const isValid = fileSizeValidation(mockFile, sizeLimit);

        expect(isValid).toBe(true);
    });

    it('should return false for a file exceeding the size limit', () => {
        const mockFile = createBlob('Hello, this is more content', 'test.txt', 'text/plain');

        const sizeLimit = 10;
        const isValid = fileSizeValidation(mockFile, sizeLimit);

        expect(isValid).toBe(false);
    });

    it('should return true for a file exactly at the size limit', () => {
        const mockFile = createBlob('Hello!', 'test.txt', 'text/plain');

        const sizeLimit = 6;
        const isValid = fileSizeValidation(mockFile, sizeLimit);

        expect(isValid).toBe(true);
    });
});
