import { Component, type ReactNode } from "react";

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: unknown) { console.error("App crash:", error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: "100vh", background: "#0b0f0d", color: "#e2e8f0", display: "grid", placeItems: "center", fontFamily: "monospace", padding: 24 }}>
          <div style={{ maxWidth: 720 }}>
            <h1 style={{ color: "#9caf88", letterSpacing: 4 }}>APPLICATION ERROR</h1>
            <p>The interface failed to render.</p>
            <pre style={{ whiteSpace: "pre-wrap", background: "#111714", border: "1px solid #2a3328", padding: 16, borderRadius: 8, color: "#fca5a5" }}>
              {String(this.state.error?.message ?? this.state.error)}
            </pre>
            <button onClick={() => location.reload()} style={{ marginTop: 12, padding: "8px 20px", background: "#556b2f", color: "#fff", border: 0, borderRadius: 8, cursor: "pointer" }}>RELOAD</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
