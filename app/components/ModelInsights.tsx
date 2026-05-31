"use client"

import { useEffect, useMemo, useState } from "react"
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { getPlotUrl, getTrainingHistory } from "@/lib/api"
import type { HistoryResponse } from "@/types"

type InsightTab = "history" | "confusion" | "gradcam"

export function ModelInsights() {
  const [tab, setTab] = useState<InsightTab>("history")
  const [history, setHistory] = useState<HistoryResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    void (async () => {
      try {
        const h = await getTrainingHistory()
        if (alive) setHistory(h)
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Failed to load training history.")
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const chartData = useMemo(() => {
    if (!history) return []
    const n = history.train_loss.length
    return Array.from({ length: n }, (_, i) => ({
      epoch: i + 1,
      train_loss: history.train_loss[i],
      val_loss: history.val_loss[i],
      train_acc: history.train_acc[i] * 100,
      val_acc: history.val_acc[i] * 100,
    }))
  }, [history])

  const tabs: { id: InsightTab; label: string }[] = [
    { id: "history", label: "Training History" },
    { id: "confusion", label: "Confusion Matrix" },
    { id: "gradcam", label: "Grad-CAM" },
  ]

  return (
    <section className="mt-20 rounded-2xl border border-border bg-card/75 p-6 backdrop-blur-md md:p-10">
      <h2 className="text-xl font-semibold text-text md:text-2xl">Model Insights</h2>
      <p className="mt-1 text-sm text-muted">Training artifacts and interpretability from the FER2013 run.</p>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={
              tab === t.id
                ? "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
                : "rounded-lg px-4 py-2 text-sm font-medium text-muted transition hover:bg-border hover:text-text"
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8 min-h-[360px]">
        {tab === "history" && (
          <div className="h-[360px] w-full">
            {error && <p className="text-sm text-warning">{error}</p>}
            {!history && !error && <p className="text-muted">Loading chart…</p>}
            {history && chartData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                  <XAxis dataKey="epoch" name="Epoch" stroke="#64748b" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#64748b"
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#12121a", border: "1px solid #1e1e2e" }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="train_loss" name="Train loss" stroke="#6c63ff" dot={false} strokeWidth={2} />
                  <Line yAxisId="left" type="monotone" dataKey="val_loss" name="Val loss" stroke="#f97316" dot={false} strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="train_acc" name="Train acc %" stroke="#10b981" dot={false} strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="val_acc" name="Val acc %" stroke="#facc15" dot={false} strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {tab === "confusion" && (
          <div className="space-y-3 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element -- dynamic API URL from Render */}
            <img
              src={getPlotUrl("confusion_matrix")}
              alt="Confusion matrix for validation predictions"
              className="mx-auto max-h-[420px] rounded-xl border border-border object-contain"
            />
            <p className="text-sm text-muted">
              Rows are true labels and columns are predictions — strong diagonal means correct classifications across the seven FER2013 emotions.
            </p>
          </div>
        )}

        {tab === "gradcam" && (
          <div className="space-y-3 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element -- dynamic API URL from Render */}
            <img
              src={getPlotUrl("gradcam_samples")}
              alt="Grad-CAM heatmaps over sample faces"
              className="mx-auto max-h-[420px] rounded-xl border border-border object-contain"
            />
            <p className="text-sm text-muted">
              Grad-CAM highlights which facial regions the model focuses on when making its decision.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
