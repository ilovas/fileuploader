import { type Meta, type StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { FileUploader } from './index';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'FileUploader',
    component: FileUploader,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {},
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    args: {
        // onFileChange: fn(),
        // onUploadSuccess: fn(),
        // onError: fn(),
    },
} satisfies Meta<typeof FileUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const uploadInChunks: Story = {
    args: {
        chunkSize: 1048576,
        sizeLimit: 20971520,
        onFileChange: (file: File) => {
            console.log('File changed:', file);
        },
        onUploadSuccess: () => {
            console.log('The upload was successful');
        },
        onError: (error: string) => {
            console.log('The error:', error);
        },
    },
};

export const simpleUpload: Story = {
    args: {
        onFileChange: (file: File) => {
            console.log('File changed:', file);
        },
        onUploadSuccess: () => {
            console.log('The upload was successful');
        },
        onError: (error: string) => {
            console.log('The error:', error);
        },
    },
};
