"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Upload, Loader2, AlertCircle, Film } from "lucide-react";

/**
 * Uploads media straight from the browser to Vercel Blob (multipart), so large
 * product photos and video aren't capped by the serverless request-body limit.
 */
export function ImageUploader({
  folder = "uploads",
  kind = "image",
  label,
  onUploaded,
  className = "",
}: {
  folder?: string;
  kind?: "image" | "video";
  label?: string;
  onUploaded: (url: string) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const isVideo = kind === "video";

  const handleFile = async (file: File) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    try {
      if (isVideo && !file.type.startsWith("video/")) {
        setError("Please choose a video file (MP4 or WebM).");
        return;
      }
      if (!isVideo && !file.type.startsWith("image/")) {
        setError("Please choose an image file.");
        return;
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const blob = await upload(`${folder}/${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/blob-upload",
        multipart: true,
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });
      onUploaded(blob.url);
    } catch (e) {
      setError((e as Error).message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
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
        {uploading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : isVideo ? (
          <Film size={16} />
        ) : (
          <Upload size={16} />
        )}
        {uploading
          ? progress > 0
            ? `Uploading… ${progress}%`
            : "Uploading…"
          : (label ?? (isVideo ? "Upload a video" : "Upload from your device"))}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={isVideo ? "video/mp4,video/webm,video/quicktime" : "image/*"}
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
