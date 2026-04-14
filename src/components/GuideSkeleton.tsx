import logoRectDark from "@/assets/logo-cosyhome-rect-dark.png";

function Bone({ className }: { className?: string }) {
  return <div className={`bg-border/60 animate-pulse ${className ?? ""}`} />;
}

export default function GuideSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <img src={logoRectDark} alt="" className="h-10 w-auto object-contain" />
          <div className="flex items-center gap-4">
            <Bone className="h-3 w-20 hidden sm:block" />
            <Bone className="h-4 w-4" />
            <Bone className="h-4 w-12" />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero skeleton */}
        <div className="relative h-[280px] md:h-[340px] bg-primary/20 animate-pulse">
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-[calc(1.5rem+10px)] text-center">
            <Bone className="h-8 w-48 mx-auto mb-2" />
            <Bone className="h-3 w-32 mx-auto" />
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4">
          {/* Quick info skeleton */}
          <div className="my-6">
            {/* Desktop */}
            <div className="hidden md:block">
              <div className="flex items-stretch divide-x divide-border border bg-card">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex-1 p-3 flex flex-col items-center gap-1.5">
                    <Bone className="h-2.5 w-16" />
                    <Bone className="h-3.5 w-20" />
                  </div>
                ))}
              </div>
            </div>
            {/* Mobile */}
            <div className="md:hidden">
              <div className="bg-card border p-5 space-y-4">
                <div className="flex justify-center gap-8">
                  <div className="flex-1 flex flex-col items-center gap-1.5">
                    <Bone className="h-2.5 w-14" />
                    <Bone className="h-3.5 w-16" />
                  </div>
                  <div className="w-px bg-border" />
                  <div className="flex-1 flex flex-col items-center gap-1.5">
                    <Bone className="h-2.5 w-14" />
                    <Bone className="h-3.5 w-16" />
                  </div>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-center gap-8">
                  <div className="flex-1 flex flex-col items-center gap-1.5">
                    <Bone className="h-2.5 w-14" />
                    <Bone className="h-3.5 w-20" />
                  </div>
                  <div className="w-px bg-border" />
                  <div className="flex-1 flex flex-col items-center gap-1.5">
                    <Bone className="h-2.5 w-14" />
                    <Bone className="h-3.5 w-20" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section grid skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-5 pb-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border p-6 flex flex-col items-center gap-3">
                <Bone className="h-6 w-6" />
                <Bone className="h-2.5 w-16" />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom nav skeleton */}
      <nav className="border-t bg-card/90 backdrop-blur-sm sticky bottom-0 z-50">
        <div className="mx-auto max-w-5xl px-2">
          <div className="flex justify-around py-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1 px-3 py-2.5">
                <Bone className="h-5 w-5" />
                <Bone className="h-2 w-10" />
              </div>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
