import { MoveRight } from "lucide-react";

interface LinkButtonProps {
  title: string;
  url: string;
}

export default function LinkButton({ title, url }: LinkButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-3 bg-accent px-5 py-2.5 text-sm text-accent-foreground transition-all duration-300 hover:bg-accent/85"
    >
      <span>{title}</span>
      <MoveRight
        size={14}
        className="text-accent-foreground/70 group-hover:translate-x-1.5 group-hover:text-accent-foreground transition-all duration-300"
      />
    </a>
  );
}
