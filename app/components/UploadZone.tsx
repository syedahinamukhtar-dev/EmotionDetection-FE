"use client"

import clsx from "clsx"
import { useCallback, useRef, useState } from "react"
import { ImagePlus } from "lucide-react"

const MAX_BYTES = 10 * 1024 * 1024

export interface UploadZoneProps {
  onImageSelected: (file: File, previewUrl: string) => void
}

export function UploadZone({ onImageSelected }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<{ name: string; size: string } | null>(null)

  const handleFile = useCallback(
    (file: File | undefined) => {
      setError(null)
      if (!file) return
      if (!file.type.startsWith("image/")) {
        setError("Please choose an image file (PNG, JPEG, WebP, etc.).")
        return
      }
      if (file.size >= MAX_BYTES) {
        setError("Image must be smaller than 10 MB.")
        return
      }
      const url = URL.createObjectURL(file)
      setMeta({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
      })
      onImageSelected(file, url)
    },
    [onImageSelected],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      const f = e.dataTransfer.files?.[0]
      handleFile(f)
    },
    [handleFile],
  )

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
        }}
        onDragEnter={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setDragActive(false)
        }}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={clsx(
          "cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300",
          dragActive
            ? "border-primary bg-primary/10 shadow-[0_0_0_1px_rgba(108,99,255,0.35)]"
            : "border-border bg-card/50 backdrop-blur-md hover:border-primary/60 hover:bg-card/70",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <ImagePlus className="mx-auto mb-3 h-10 w-10 text-primary" aria-hidden />
        <p className="text-lg font-medium text-text">Drop a face image here</p>
        <p className="mt-1 text-sm text-muted">or click to browse</p>
      </div>
      {meta && (
        <p className="text-sm text-muted">
          Selected: <span className="text-text">{meta.name}</span> · {meta.size}
        </p>
      )}
      {error && <p className="text-sm text-warning">{error}</p>}
    </div>
  )
}
