"use client"
import { useState } from "react";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "../../../components/ui/drop-zone";
import { uploadDoc } from "../../../actions/gcpservices";
import { useUser } from "@clerk/nextjs";

const FileSvgDraw = () => {
    return (
        <>
            <svg
                className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
            >
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
            </svg>
            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span>
                &nbsp; or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
                PDF, TXT only
            </p>
        </>
    );
};

const FileUploaderTest = ({shopDomain}: {shopDomain: string}) => {
    const [files] = useState<File[] | null>(null);
    function handleChange(files: File[] | null) {
        files?.map((file: File) => {
            const form = new FormData();
            form.append('file', file, file.name);
            uploadDoc(form, shopDomain)
            console.log(file.name);
            console.log(file.type);
        });
    }
    const dropZoneConfig = {
        maxFiles: 5,
        accept: {
            'text/plain': ['.txt'],
            'application/pdf': ['.pdf'],
        },
        maxSize: 1024 * 1024 * 4,
        multiple: true,
    };

    return (
        <FileUploader
            value={files}
            onValueChange={handleChange}
            dropzoneOptions={dropZoneConfig}
            className="relative bg-background rounded-lg p-2"
        >
            <FileInput className="outline-dashed outline-1 outline-black/20">
                <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                    <FileSvgDraw />
                </div>
            </FileInput>
        </FileUploader>
    );
};

export default FileUploaderTest;