import React from "react";

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="min-h-screen bg-paper text-paper-text flex flex-col justify-between selection:bg-paper-border selection:text-paper-text">
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-12 md:py-16 flex-1 flex flex-col">
        {children}
      </div>
      <footer className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 text-center border-t border-paper-border/40 text-xs text-paper-muted">
        <p>Still — Make room for what matters. Local-first &amp; distraction-free.</p>
      </footer>
    </div>
  );
}
