import { useState } from 'react';

import { FileList } from './FileList';
import { FileUploader } from './FileUploader';

export const App = () => {
    const [fileCounter, setCount] = useState<number>(0);

    const onUploadSuccess = () => setCount((prevCount) => prevCount + 1);

    return (
        <main className="relative isolate h-dvh">
            <img
                src="https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoid2VhcmVcL2FjY291bnRzXC82ZVwvNDAwMDM4OFwvcHJvamVjdHNcLzk4NFwvYXNzZXRzXC9iOFwvMTE1MjY1XC8xMjYwMTU0YzFhYmVmMDVjNjZlY2Q2MDdmMTRhZTkxNS0xNjM4MjU4MjQwLmpwZyJ9:weare:_kpZgwnGPTxOhYxIyfS1MhuZmxGrFCzP6ZW6dc-F6BQ?width=2400"
                alt="background image"
                aria-hidden="true"
                className="absolute inset-0 -z-10 h-full w-full object-cover object-top"
            />
            <div className="flex h-screen p-4 flex-col">
                <div className="flex flex-col mx-auto max-w-lg w-full">
                    <div className="mx-auto min-w-full">
                        <FileUploader chunkSize={1048576} onUploadSuccess={onUploadSuccess} />
                    </div>
                    <div className="mx-auto min-w-full mt-3">
                        <FileList counter={fileCounter} />
                    </div>
                </div>
            </div>
        </main>
    );
};
