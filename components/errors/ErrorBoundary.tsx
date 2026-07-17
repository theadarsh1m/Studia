"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an uncaught exception:", error, errorInfo);
  }

  private handleReset = () => {
    // Clear study storage to recover from bad state
    try {
      localStorage.removeItem("aistudi_study_session");
    } catch {}
    // Force reload
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-2xl mx-auto my-12 px-4 select-none">
          <Card className="border-amber-500/20 bg-amber-500/5 backdrop-blur-xs shadow-md">
            <CardContent className="p-8 flex flex-col items-center text-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-full text-amber-500">
                <AlertTriangle className="w-8 h-8 animate-bounce" />
              </div>
              
              <div className="space-y-1">
                <h4 className="font-bold text-foreground text-lg">
                  Oops! Something went wrong
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  An unexpected error occurred while rendering the study deck.
                </p>
              </div>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="w-full text-left p-3 rounded-lg bg-black/10 dark:bg-white/5 border border-border/40 max-h-36 overflow-auto text-xs font-mono text-muted-foreground/80 mt-2">
                  <span className="font-bold text-foreground">Rendering Error Info:</span>
                  <pre className="mt-1 whitespace-pre-wrap">{this.state.error.stack}</pre>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                <Button
                  type="button"
                  variant="default"
                  onClick={this.handleReset}
                  className="gap-2 font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
                  aria-label="Reload and reset layout"
                >
                  <RefreshCw className="w-4 h-4 animate-spin-once" />
                  <span>Reload Application</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
