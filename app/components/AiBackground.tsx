export function AiBackground() {
  return (
    <div className="ai-background pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-background" />
      <div className="ai-orb ai-orb-primary" />
      <div className="ai-orb ai-orb-violet" />
      <div className="ai-orb ai-orb-blue" />
      <div className="ai-orb ai-orb-accent" />
      <div className="ai-grid" />
      <div className="ai-vignette absolute inset-0" />
    </div>
  )
}
