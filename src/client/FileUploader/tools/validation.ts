export const fileExtensionValidation = (file: File, acceptedFileTypes: string[]): boolean =>
    !!acceptedFileTypes.find((type) => type === file.type);

export const fileSizeValidation = (file: File, sizeLimit: number): boolean => file.size <= sizeLimit;
