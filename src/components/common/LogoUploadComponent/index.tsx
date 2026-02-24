"use client";
import * as React from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";

export type LogoUploadProps = {
    label?: string;
    required?: boolean;
    description?: string;
    value?: string; // URL of uploaded logo
    onFileUpload: (file: File) => void;
    onRemove: () => void;
    disabled?: boolean;
    isUploading?: boolean;
    accept?: string[];
    maxSizeBytes?: number;
    error?: string;
};

function humanSize(bytes: number): string {
    if (!Number.isFinite(bytes)) return "";
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    let n = bytes;
    while (n >= 1024 && i < units.length - 1) {
        n = n / 1024;
        i++;
    }
    return `${n.toFixed(n >= 100 ? 0 : n >= 10 ? 1 : 2)} ${units[i]}`;
}

export const LogoUploadComponent: React.FC<LogoUploadProps> = ({
    label,
    required,
    description,
    value,
    onFileUpload,
    onRemove,
    disabled,
    isUploading = false,
    accept = ['image/png', 'image/jpeg', 'image/jpg'],
    maxSizeBytes = 5 * 1024 * 1024,
    error,
}) => {
    const uploadDisabled = disabled || isUploading;

    const handleDropAccepted = React.useCallback(
        (acceptedFiles: File[]) => {
            if (uploadDisabled || acceptedFiles.length === 0) return;
            onFileUpload(acceptedFiles[0]);
        },
        [uploadDisabled, onFileUpload]
    );

    const { getRootProps, getInputProps, isDragActive, fileRejections, open } = useDropzone({
        onDropAccepted: handleDropAccepted,
        noClick: true,
        noKeyboard: true,
        multiple: false,
        accept: accept && accept.length ? accept.reduce<Record<string, string[]>>((acc, a) => { acc[a] = []; return acc; }, {}) : undefined,
        maxSize: maxSizeBytes,
        disabled: uploadDisabled,
    });

    const hasRejections = fileRejections && fileRejections.length > 0;

    return (
        <div className="space-y-2">
            {label ? (
                <Label className="text-sm">
                    {label}
                    {required ? <span className="text-red-500 ml-1">*</span> : null}
                </Label>
            ) : null}

            {value ? (
                // Show uploaded logo preview
                <div className="flex items-center gap-3 p-3 border rounded-md bg-gray-50">
                    <div className="relative w-16 h-16 flex-shrink-0 border rounded-md overflow-hidden bg-white">
                        <img 
                            src={value} 
                            alt="Logo preview" 
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Logo uploaded</p>
                        <p className="text-xs text-gray-500">Click remove to change</p>
                    </div>
                    {!isUploading && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onRemove}
                            disabled={disabled}
                            className="flex-shrink-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ) : (
                // Show upload area
                <div
                    {...getRootProps({
                        className: `relative border-2 border-dashed rounded-md p-4 transition-colors ${
                            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                        } ${uploadDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`,
                    })}
                    onClick={() => {
                        if (!uploadDisabled) open();
                    }}
                >
                    <input {...getInputProps()} />
                    
                    {isUploading ? (
                        <div className="flex flex-col items-center justify-center py-3">
                            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                            <p className="text-sm font-medium text-gray-900">Uploading logo...</p>
                            <p className="text-xs text-gray-500 mt-1">Please wait</p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                {isDragActive ? (
                                    <Upload className="h-5 w-5 text-blue-500" />
                                ) : (
                                    <ImageIcon className="h-5 w-5 text-gray-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                    {isDragActive ? "Drop to upload" : "Click to upload or drag and drop"}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    PNG, JPG up to {humanSize(maxSizeBytes)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {description && !error ? (
                <p className="text-xs text-gray-500">{description}</p>
            ) : null}

            {error ? (
                <p className="text-xs text-red-600">{error}</p>
            ) : null}

            {hasRejections ? (
                <div className="text-xs text-red-600">
                    {fileRejections.map((rej, i) => (
                        <div key={i}>
                            {rej.file.name}: {rej.errors.map(e => e.message).join(", ")}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default LogoUploadComponent;
