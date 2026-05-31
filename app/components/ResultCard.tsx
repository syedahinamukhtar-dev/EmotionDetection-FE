"use client"

import clsx from "clsx"
import type { PredictionResponse, EmotionType } from "@/types"
import { EMOTION_COLORS, EMOTION_EMOJIS } from "@/types"
import { EmotionBar } from "./EmotionBar"

function isEmotionType(name: string): name is EmotionType {
  return name in EMOTION_COLORS
}

export interface ResultCardProps {
  result: PredictionResponse | null
  isLoading: boolean
  onReset?: () => void
}

export function ResultCard({ result, isLoading, onReset }: ResultCardProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse rounded-2xl border border-border bg-card/75 p-8 shadow-lg backdrop-blur-md">
        <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-border" />
        <div className="mx-auto mb-2 h-8 w-40 rounded bg-border" />
        <div className="mx-auto h-4 w-28 rounded bg-border" />
        <p className="mt-6 text-center text-muted">
          Analyzing your image
          <span className="inline-flex w-6 justify-start">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce [animation-delay:0.15s]">.</span>
            <span className="animate-bounce [animation-delay:0.3s]">.</span>
          </span>
        </p>
        <div className="mt-8 space-y-3">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="h-3 w-24 rounded bg-border" />
              <div className="h-3 flex-1 rounded bg-border" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!result) {
    return null
  }

  const typed = isEmotionType(result.emotion) ? result.emotion : "neutral"
  const emoji = isEmotionType(result.emotion) ? EMOTION_EMOJIS[typed] : "🙂"
  const color = EMOTION_COLORS[typed]
  const sorted = Object.entries(result.probabilities).sort((a, b) => b[1] - a[1])

  return (
    <div
      className={clsx(
        "rounded-2xl border border-border bg-card/75 p-8 shadow-xl backdrop-blur-md",
        "animate-in fade-in zoom-in-95 duration-500",
      )}
    >
      <div className="text-center">
        <div className="text-[5rem] leading-none" style={{ filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.45))" }}>
          {emoji}
        </div>
        <h3 className="mt-2 text-3xl font-bold capitalize" style={{ color }}>
          {result.emotion}
        </h3>
        <p className="mt-1 text-lg text-text">
          {(result.confidence * 100).toFixed(1)}% confident
        </p>
      </div>
      <div className="my-8 h-px bg-border" />
      <div className="space-y-1">
        {sorted.map(([emotion, prob], index) => (
          <EmotionBar
            key={emotion}
            emotion={emotion}
            probability={prob}
            isTop={index === 0}
            index={index}
          />
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-muted">
        Processing time: {result.processing_time_ms} ms · {result.model_used}
      </p>
      {onReset && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Try another image
          </button>
        </div>
      )}
    </div>
  )
}
