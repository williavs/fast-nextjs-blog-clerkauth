/**
 * Enhanced image upload hook with Vercel Blob support.
 *
 * Provides file selection, preview, and upload to Vercel Blob storage.
 * Backward compatible with existing usage.
 *
 * @module hooks/use-image-upload
 */

import { useCallback, useEffect, useRef, useState } from "react";

interface UseImageUploadProps {
  /** Callback when upload completes (receives blob URL or local preview URL) */
  onUpload?: (url: string) => void;

  /** If true, automatically upload to Vercel Blob on file selection */
  autoUpload?: boolean;
}

export function useImageUpload({ onUpload, autoUpload = false }: UseImageUploadProps = {}) {
  const previewRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentFileRef = useRef<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Upload file to Vercel Blob storage.
   */
  const uploadToBlob = useCallback(async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      setUploadError(null);

      // Upload to Vercel Blob API
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      const url = data.url;

      setBlobUrl(url);
      onUpload?.(url);

      console.log('✅ Uploaded to Vercel Blob:', url);
      return url;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      console.error('❌ Blob upload error:', errorMessage);
      setUploadError(errorMessage);
      return null;
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        // Store file reference for manual upload
        currentFileRef.current = file;

        setFileName(file.name);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        previewRef.current = url;

        // If not auto-uploading, call onUpload with preview URL (backward compatible)
        if (!autoUpload) {
          onUpload?.(url);
        } else {
          // Auto-upload to Vercel Blob
          await uploadToBlob(file);
        }
      }
    },
    [onUpload, autoUpload, uploadToBlob],
  );

  const handleRemove = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileName(null);
    setBlobUrl(null);
    setUploadError(null);
    previewRef.current = null;
    currentFileRef.current = null;

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [previewUrl]);

  /**
   * Manually trigger upload of currently selected file.
   */
  const triggerUpload = useCallback(async (): Promise<string | null> => {
    if (!currentFileRef.current) {
      console.warn('No file selected for upload');
      return null;
    }
    return uploadToBlob(currentFileRef.current);
  }, [uploadToBlob]);

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  return {
    // Original properties (backward compatible)
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,

    // New Vercel Blob properties
    uploading,
    blobUrl,
    uploadError,
    uploadToBlob: triggerUpload,
  };
}