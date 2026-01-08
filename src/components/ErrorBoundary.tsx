/**
 * Error Boundary Component
 * Catches and handles React errors gracefully
 * Touchpoint 5: Shows Commander Arka with confused/empty pose during errors
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { CommanderArkaFullDisplay } from '@/components/ChatUIEnhancers';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
          <Card className="bg-white/5 border-white/10 max-w-2xl w-full p-8">
            <div className="text-center space-y-6">
              {/* Touchpoint 5: Commander Arka with confused/empty pose */}
              <div className="flex justify-center">
                <div className="w-32 h-32">
                  <CommanderArkaFullDisplay pose="empty" showLabel={false} />
                </div>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">⚠️ Maaf Warrior</h1>
                <p className="text-gray-300 text-base">
                  Sistem sedang ada gangguan teknis. Commander sedang memperbaikinya!
                </p>
              </div>

              {this.state.error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-left">
                  <p className="text-sm text-red-300 font-mono break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={this.handleReset}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg font-bold transition-colors"
                >
                  <RefreshCcw className="w-5 h-5" />
                  Refresh Halaman
                </button>
                
                <a
                  href="/dashboard"
                  className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-colors"
                >
                  <Home className="w-5 h-5" />
                  Kembali ke Dashboard
                </a>
              </div>

              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-300">
                  💡 Jika masalah berlanjut, silakan hubungi tim support.
                </p>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
