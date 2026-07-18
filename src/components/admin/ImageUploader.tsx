"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, AlertCircle } from "lucide-react";

export function ImageUploader({
  folder = "uploads",
  onUploaded,
  className = "",
}: {
  folder?: string;
  onUploaded: (url: string) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Upload failed.");
        return;
      }
      onUploaded(data.url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-stone-300 py-3 text-[13px] text-ink-muted transition-colors hover:border-ink hover:text-ink disabled:opacity-60"
      >
        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
        {uploading ? "Uploading…" : "Upload from your device"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-[12px] text-danger">
          <AlertCircle size={13} /> {error}
        </p>
      )}
    </div>
  );
}
