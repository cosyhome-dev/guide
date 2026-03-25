import { ExternalLink, ArrowUpRight, MoveRight } from "lucide-react";

// ── V1 Dark : Fond sombre + underline accent ──
const V1Dark = ({ title, url }: { title: string; url: string }) => (
  <a href={url} target="_blank" rel="noopener noreferrer"
    className="group inline-flex items-center gap-2 bg-[#362f2a] rounded-sm px-5 py-2.5 text-sm text-[#e8e0d8] transition-all duration-300 hover:bg-[#433a34]">
    <span className="relative">{title}
      <span className="absolute bottom-0 left-0 w-full h-[0.5px] bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </span>
    <ArrowUpRight size={13} className="text-accent/60 group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300" />
  </a>
);

// ── V1 Light : Fond clair + underline accent ──
const V1Light = ({ title, url }: { title: string; url: string }) => (
  <a href={url} target="_blank" rel="noopener noreferrer"
    className="group inline-flex items-center gap-2 bg-card border rounded-sm px-5 py-2.5 text-sm text-foreground transition-all duration-300 hover:bg-secondary">
    <span className="relative">{title}
      <span className="absolute bottom-0 left-0 w-full h-[0.5px] bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </span>
    <ArrowUpRight size={13} className="text-accent/60 group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300" />
  </a>
);

// ── V1 Accent : Fond accent + texte clair ──
const V1Accent = ({ title, url }: { title: string; url: string }) => (
  <a href={url} target="_blank" rel="noopener noreferrer"
    className="group inline-flex items-center gap-2 bg-accent rounded-sm px-5 py-2.5 text-sm text-accent-foreground transition-all duration-300 hover:bg-accent/85">
    <span className="relative">{title}
      <span className="absolute bottom-0 left-0 w-full h-[0.5px] bg-accent-foreground/60 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </span>
    <ArrowUpRight size={13} className="text-accent-foreground/60 group-hover:text-accent-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300" />
  </a>
);

// ── V3 Dark : Fond sombre + flèche slide ──
const V3Dark = ({ title, url }: { title: string; url: string }) => (
  <a href={url} target="_blank" rel="noopener noreferrer"
    className="group inline-flex items-center gap-3 bg-[#362f2a] rounded-sm px-5 py-2.5 text-sm text-[#e8e0d8] transition-all duration-300 hover:bg-[#433a34] hover:pr-6">
    <span>{title}</span>
    <MoveRight size={14} className="text-accent opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
  </a>
);

// ── V3 Light : Fond clair + flèche slide ──
const V3Light = ({ title, url }: { title: string; url: string }) => (
  <a href={url} target="_blank" rel="noopener noreferrer"
    className="group inline-flex items-center gap-3 bg-card border rounded-sm px-5 py-2.5 text-sm text-foreground transition-all duration-300 hover:bg-secondary hover:pr-6">
    <span>{title}</span>
    <MoveRight size={14} className="text-accent opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
  </a>
);

// ── V3 Accent : Fond accent + flèche slide ──
const V3Accent = ({ title, url }: { title: string; url: string }) => (
  <a href={url} target="_blank" rel="noopener noreferrer"
    className="group inline-flex items-center gap-3 bg-accent rounded-sm px-5 py-2.5 text-sm text-accent-foreground transition-all duration-300 hover:bg-accent/85 hover:pr-6">
    <span>{title}</span>
    <MoveRight size={14} className="text-accent-foreground/70 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
  </a>
);

const Label = ({ children }: { children: string }) => (
  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{children}</p>
);

const ButtonPreview = () => (
  <div className="min-h-screen bg-background p-6 space-y-10 max-w-lg mx-auto">
    <h1 className="text-2xl text-center">Variantes couleurs</h1>

    {/* STYLE 1 — Underline */}
    <div className="space-y-6">
      <h2 className="text-foreground">Style 1 — Underline</h2>

      <div className="space-y-3">
        <Label>1A — Sombre</Label>
        <div className="flex flex-wrap gap-2">
          <V1Dark title="Domaine skiable" url="#" />
          <V1Dark title="Valais Tourisme" url="#" />
        </div>
      </div>

      <div className="space-y-3">
        <Label>1B — Clair</Label>
        <div className="flex flex-wrap gap-2">
          <V1Light title="Domaine skiable" url="#" />
          <V1Light title="Valais Tourisme" url="#" />
        </div>
      </div>

      <div className="space-y-3">
        <Label>1C — Accent</Label>
        <div className="flex flex-wrap gap-2">
          <V1Accent title="Domaine skiable" url="#" />
          <V1Accent title="Valais Tourisme" url="#" />
        </div>
      </div>
    </div>

    <div className="h-px bg-border" />

    {/* STYLE 3 — Flèche */}
    <div className="space-y-6">
      <h2 className="text-foreground">Style 3 — Flèche</h2>

      <div className="space-y-3">
        <Label>3A — Sombre</Label>
        <div className="flex flex-wrap gap-2">
          <V3Dark title="Domaine skiable" url="#" />
          <V3Dark title="Valais Tourisme" url="#" />
        </div>
      </div>

      <div className="space-y-3">
        <Label>3B — Clair</Label>
        <div className="flex flex-wrap gap-2">
          <V3Light title="Domaine skiable" url="#" />
          <V3Light title="Valais Tourisme" url="#" />
        </div>
      </div>

      <div className="space-y-3">
        <Label>3C — Accent</Label>
        <div className="flex flex-wrap gap-2">
          <V3Accent title="Domaine skiable" url="#" />
          <V3Accent title="Valais Tourisme" url="#" />
        </div>
      </div>
    </div>
  </div>
);

export default ButtonPreview;
