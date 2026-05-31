"use client"

import { useCallback, useEffect, useState } from "react"
import { Brain, Github, Loader2 } from "lucide-react"
import { UploadZone } from "./components/UploadZone"
import { ResultCard } from "./components/ResultCard"
import { LiveCamera } from "./components/LiveCamera"
import { ModelInsights } from "./components/ModelInsights"
import { getModelInfo, predictEmotion } from "@/lib/api"
import type { PredictionResponse } from "@/types"

const GITHUB_FE = "https://github.com/syedahinamukhtar-dev/EmotionDetection-FE"
const GITHUB_BE = "https://github.com/syedahinamukhtar-dev/EmotionDetection-BE"
const AUTHOR = "Syeda Hina Mukhtar"

type MainTab = "upload" | "camera"

export default function HomePage() {
  const [mainTab, setMainTab] = useState<MainTab>("upload")
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [result, setResult] = useState<PredictionResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [badgeAcc, setBadgeAcc] = useState<string>("61.1%")

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const info = await getModelInfo()
        if (!cancelled) setBadgeAcc(`${(info.val_accuracy * 100).toFixed(1)}%`)
      } catch {
        /* badge keeps default */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const onImageSelected = useCallback((f: File, url: string) => {
    setFile(f)
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })
    setResult(null)
    setError(null)
  }, [])

  const resetAll = useCallback(() => {
    setResult(null)
    setError(null)
    setFile(null)
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }, [])

  const runPredict = useCallback(async (imageFile: File) => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await predictEmotion(imageFile)
      setResult(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Prediction failed.")
    } finally {
      setLoading(false)
    }
  }, [])

  const onAnalyze = useCallback(() => {
    if (file) void runPredict(file)
  }, [file, runPredict])

  const onCameraCapture = useCallback(
    (blob: Blob) => {
      const imageFile = new File([blob], "capture.jpg", { type: blob.type || "image/jpeg" })
      setFile(imageFile)
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return URL.createObjectURL(blob)
      })
      setResult(null)
      void runPredict(imageFile)
    },
    [runPredict],
  )

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="mx-auto max-w-5xl px-4 pt-10 md:px-6">
        <header className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Brain className="h-9 w-9 text-primary" aria-hidden />
              <h1 className="text-3xl font-bold tracking-tight text-text md:text-4xl">FaceEmotion AI</h1>
            </div>
            <p className="mt-2 max-w-xl text-muted">
              Deep Learning Facial Expression Recognition · FER2013 · 7 Emotions
            </p>
            <p className="mt-3 text-sm text-text">
              Developed by{" "}
              <span className="font-semibold text-primary">{AUTHOR}</span>
              <span className="text-muted"> · MS Data Science</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={GITHUB_FE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-text transition hover:border-primary/50 hover:bg-card/80"
              >
                <Github className="h-4 w-4 text-primary" aria-hidden />
                Frontend Repo
              </a>
              <a
                href={GITHUB_BE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-text transition hover:border-primary/50 hover:bg-card/80"
              >
                <Github className="h-4 w-4 text-primary" aria-hidden />
                Backend Repo
              </a>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <span className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-text md:text-sm">
              Model: CustomCNN · Val Acc: {badgeAcc}
            </span>
          </div>
        </header>

        <section className="mt-12">
          <div className="mb-6 flex rounded-xl border border-border bg-card/50 p-1">
            <button
              type="button"
              onClick={() => setMainTab("upload")}
              className={
                mainTab === "upload"
                  ? "flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white shadow"
                  : "flex-1 rounded-lg py-2.5 text-sm font-medium text-muted transition hover:text-text"
              }
            >
              Upload Image
            </button>
            <button
              type="button"
              onClick={() => setMainTab("camera")}
              className={
                mainTab === "camera"
                  ? "flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white shadow"
                  : "flex-1 rounded-lg py-2.5 text-sm font-medium text-muted transition hover:text-text"
              }
            >
              Live Camera
            </button>
          </div>

          {mainTab === "upload" && (
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <UploadZone onImageSelected={onImageSelected} />
                <button
                  type="button"
                  disabled={!file || loading}
                  onClick={onAnalyze}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : null}
                  Analyze Emotion
                </button>
              </div>
              <div>
                {previewUrl && (
                  <div className="overflow-hidden rounded-2xl border border-border bg-card p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element -- blob URL preview */}
                    <img src={previewUrl} alt="Selected preview" className="mx-auto max-h-80 rounded-lg object-contain" />
                  </div>
                )}
              </div>
            </div>
          )}

          {mainTab === "camera" && (
            <div className="max-w-3xl">
              <LiveCamera onCapture={onCameraCapture} />
              {loading && (
                <p className="mt-4 flex items-center gap-2 text-sm text-muted">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Sending capture to the API…
                </p>
              )}
            </div>
          )}

          {error && <p className="mt-6 text-center text-sm text-warning">{error}</p>}

          <div className="mt-10">
            <ResultCard result={result} isLoading={loading} onReset={resetAll} />
          </div>
        </section>

        <ModelInsights />

        <footer className="mt-16 border-t border-border pt-8 text-center text-sm text-muted">
          <p>
            © {new Date().getFullYear()} {AUTHOR} · FaceEmotion AI
          </p>
          <p className="mt-2">Built with PyTorch · FastAPI · Next.js · FER2013 Dataset</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href={GITHUB_FE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-text transition hover:border-primary/50"
            >
              <Github className="h-3.5 w-3.5 text-primary" aria-hidden />
              EmotionDetection-FE
            </a>
            <a
              href={GITHUB_BE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-text transition hover:border-primary/50"
            >
              <Github className="h-3.5 w-3.5 text-primary" aria-hidden />
              EmotionDetection-BE
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}
