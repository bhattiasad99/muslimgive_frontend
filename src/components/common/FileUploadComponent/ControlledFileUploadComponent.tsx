"use client";
import * as React from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypographyComponent } from "../TypographyComponent";
import { X, FileText, Upload } from "lucide-react";

export type UploadedItem = {
    id: string; // your stable identifier, for example returned by backend after upload
    name: string;
    size: number;
    type: string;
    url?: string; // optional, if already stored remotely
    file?: File; // optional, if you keep the File around before upload completes
};

export type FileUploadProps = {
    label?: string;
    required?: boolean;
    description?: string;
    value: UploadedItem[]; // externally controlled list
    onFileUpload: (files: File[]) => void; // parent uploads or transforms and then updates value
    onRemove: (id: string) => void;
    disabled?: boolean;
    limit?: number; // max number of files allowed total
    multiple?: boolean; // allow selecting multiple in one go
    accept?: string[]; // list of accepted mime types or extensions, ex: ["image/*", ".pdf"]
    maxSizeBytes?: number; // per file size limit in bytes
    name?: string; // input name
    idPrefix?: string; // to ensure stable ids for a11y
    className?: string;
    emptyStateText?: string;
    error?: string; // surface validation errors from parent
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

export const ControlledFileUploadComponent: React.FC<FileUploadProps> = ({
    label,
    required,
    description,
    value,
    onFileUpload,
    onRemove,
    disabled,
    limit = Infinity,
    multiple = true,
    accept,
    maxSizeBytes,
    name,
    idPrefix,
    className,
    emptyStateText = "Drop files here or click to browse",
    error,
}) => {
    const reactId = React.useId();
    const baseId = idPrefix ?? `fu-${reactId}`;
    const descId = description ? `${baseId}-desc` : undefined;
    const errId = error ? `${baseId}-err` : undefined;
    const helpId = error ? errId : descId;

    const remaining = Math.max(0, limit - value.length);
    const isAtLimit = remaining === 0;
    const uploadDisabled = !!disabled;

    const handleDropAccepted = React.useCallback(
        (acceptedFiles: File[]) => {
            if (uploadDisabled || remaining <= 0) return;
            const allowed = acceptedFiles.slice(0, remaining);
            if (allowed.length) {
                onFileUpload(allowed);
            }
        },
        [uploadDisabled, onFileUpload, remaining]
    );

    const validateLimit = React.useCallback(
        () => {
            if (isAtLimit) {
                return { code: "file-limit-reached", message: "File limit reached. Remove a file to add another." };
            }
            return null;
        },
        [isAtLimit]
    );

    const { getRootProps, getInputProps, isDragActive, fileRejections, open } = useDropzone({
        onDropAccepted: handleDropAccepted,
        noClick: true,
        noKeyboard: true,
        multiple,
        accept: accept && accept.length ? accept.reduce<Record<string, string[]>>((acc, a) => { acc[a] = []; return acc; }, {}) : undefined,
        maxSize: maxSizeBytes,
        disabled: uploadDisabled,
        validator: validateLimit,
    });

    const hasRejections = fileRejections && fileRejections.length > 0;

    return (
        <div className={className} aria-disabled={disabled}>
            {label ? (
                <TypographyComponent>
                    <strong>
                        {label}
                        {required ? <span className="text-red-500">*</span> : null}
                    </strong>
                </TypographyComponent>
            ) : null}

            <Card
                {...getRootProps({
                    className: `border-dashed cursor-pointer focus-visible:outline-none`,
                    onClick: () => {
                        if (!uploadDisabled) open();
                    },
                    role: "button",
                    "aria-disabled": uploadDisabled,
                    "aria-describedby": helpId,
                })}
            >
                <CardContent className="flex flex-col items-center justify-center gap-2 py-8">
                    <input {...getInputProps({ name })} />
                    <Upload className="h-6 w-6" aria-hidden="true" />
                    <div className="text-sm font-medium">
                        {isAtLimit ? "File limit reached. Remove a file to add another." : isDragActive ? "Drop to upload" : emptyStateText}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {limit !== Infinity ? `${value.length} of ${limit} selected` : `${value.length} selected`}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <Button type="button" variant="secondary" disabled={uploadDisabled} onClick={open}>
                            Browse files
                        </Button>
                        {accept && accept.length ? (
                            <span className="text-xs text-muted-foreground">Accepted: {accept.join(", ")}</span>
                        ) : null}
                        {maxSizeBytes ? (
                            <span className="text-xs text-muted-foreground">Max size: {humanSize(maxSizeBytes)} each</span>
                        ) : null}
                    </div>
                </CardContent>
            </Card>

            {error ? (
                <p id={errId} className="text-sm text-red-600 mt-2">{error}</p>
            ) : description ? (
                <p id={descId} className="text-sm text-muted-foreground mt-2">{description}</p>
            ) : null}

            {hasRejections ? (
                <div className="mt-2 text-sm text-red-600">
                    {fileRejections.map((rej, i) => (
                        <div key={i}>
                            {rej.file.name}: {rej.errors.map(e => e.message).join(", ")}
                        </div>
                    ))}
                </div>
            ) : null}

            {/* File list */}
            <ul className="mt-4 space-y-2">
                {value.map((item) => (
                    <li key={item.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
                            <div className="min-w-0">
                                <div className="truncate text-sm font-medium" title={item.name}>{item.name}</div>
                                <div className="text-xs text-muted-foreground">{humanSize(item.size)}</div>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Remove ${item.name}`}
                            onClick={() => onRemove(item.id)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </li>
                ))}
                {value.length === 0 ? (
                    <li className="text-sm text-muted-foreground">
                        No files yet
                    </li>
                ) : null}
            </ul>
        </div>
    );
};

export default ControlledFileUploadComponent;

/*
Usage example in a parent component:

const Example = () => {
  const [files, setFiles] = React.useState<UploadedItem[]>([]);

  const handleUpload = async (incoming: File[]) => {
    // send to backend or storage, then set state with returned ids
    const mapped = incoming.map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      type: f.type,
      file: f,
    }));
    setFiles((prev) => {
      const limit = 5; // example
      const next = [...prev, ...mapped];
      return next.slice(0, limit);
    });
  };

  return (
    <FileUpload
      label="Attachments"
      description="Add supporting documents"
      value={files}
      onFileUpload={handleUpload}
      onRemove={(id) => setFiles((prev) => prev.filter((x) => x.id !== id))}
      limit={5}
      accept={["image/*", ".pdf"]}
      maxSizeBytes={10 * 1024 * 1024}
    />
  );
};
*/
