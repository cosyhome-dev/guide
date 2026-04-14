import React from "react";
import type { StaticContent } from "@/content/static";
import type { Property } from "@/content/property";

export interface GuideContextValue {
  content: StaticContent;
  property: Property;
}

export const GuideContext = React.createContext<GuideContextValue | null>(null);

export function useGuideContext() {
  const ctx = React.useContext(GuideContext);
  if (!ctx) throw new Error("useGuideContext must be used within GuideProvider");
  return ctx;
}
