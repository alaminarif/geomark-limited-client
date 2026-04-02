import { AlertCircleIcon, ImageUpIcon, XIcon } from "lucide-react";
import { useEffect } from "react";

import { useFileUpload } from "@/hooks/use-file-upload";

export default function SingleImageUploader({ onChange }: { onChange: (file: File | null) => void }) {
  const maxSizeMB = 3;
  const maxSize = maxSizeMB * 1024 * 1024;

  const [{ files, isDragging, errors }, { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, removeFile, getInputProps }] =
    useFileUpload({
      accept: "image/png,image/jpeg,image/webp,image/gif",
      maxSize,
      multiple: false,
    });

  useEffect(() => {
    if (files.length > 0 && files[0].file instanceof File) {
      onChange(files[0].file);
    } else {
      onChange(null);
    }
  }, [files, onChange]);

  const previewUrl = files[0]?.preview || null;
  const fileId = files[0]?.id;

  return (
    <div className="flex flex-col gap-2 pt-4">
      <div className="relative">
        <div
          role="button"
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]"
        >
          <input {...getInputProps()} className="sr-only" aria-label="Upload image" />

          {previewUrl ? (
            <div className="absolute inset-0">
              <img src={previewUrl} alt={files[0]?.file?.name || "Uploaded image"} className="size-full object-cover" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
                <ImageUpIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 text-sm font-medium">Drop your image here or click to browse</p>
              <p className="text-muted-foreground text-xs">PNG, JPEG, GIF or WEBP (max. {maxSizeMB}MB)</p>
            </div>
          )}
        </div>

        {previewUrl && fileId && (
          <div className="absolute top-4 right-4">
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={() => removeFile(fileId)}
              aria-label="Remove image"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className="text-destructive flex flex-col gap-1 text-xs" role="alert">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center gap-1">
              <AlertCircleIcon className="size-3 shrink-0" />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
