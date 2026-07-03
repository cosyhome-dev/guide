import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib";

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  // States
  const [openItems, setOpenItems] = React.useState<Set<number>>(new Set());

  // Handlers
  function toggle(index: number) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  // Render
  return (
    <div className="w-full">
      {items.map((item, i) => {
        const isOpen = openItems.has(i);
        return (
          <div key={i} className="border-b">
            <button
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between py-4 text-left transition-all hover:underline"
            >
              <h2 className="text-left">{item.title}</h2>
              <ChevronDown
                size={16}
                strokeWidth={2}
                className={cn(
                  "shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-200",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="pb-4">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
