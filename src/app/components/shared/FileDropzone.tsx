import { useState, useRef } from "react";
import { Upload, File, X } from "lucide-react";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  accept?: string;
  maxSize?: number; // in MB
  selectedFile?: File | null;
}

export function FileDropzone({
  onFileSelect,
  onFileRemove,
  accept,
  maxSize = 10,
  selectedFile,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }
    onFileSelect(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-input hover:border-primary/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          onChange={handleFileInput}
          accept={accept}
          className="hidden"
        />

        <div
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer"
        >
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <Upload className="w-6 h-6 text-muted-foreground" />
          </div>

          <p className="text-sm font-medium text-foreground mb-1">
            Kéo thả file hoặc click để chọn
          </p>

          <p className="text-xs text-muted-foreground">
            {accept ? `Hỗ trợ: ${accept}` : "Tất cả file"}
            {maxSize && ` (Max ${maxSize}MB)`}
          </p>
        </div>
      </div>

      {selectedFile && (
        <div className="mt-4 p-4 bg-slate-50 rounded-lg flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded">
            <File className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
          {onFileRemove && (
            <button
              onClick={onFileRemove}
              className="p-1.5 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
