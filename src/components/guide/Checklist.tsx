import React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib"
import type { ChecklistBlock } from "@/content/property"

interface ChecklistProps {
  data: ChecklistBlock
}

export default function Checklist({ data }: ChecklistProps) {
  const storageKey = `checklist-${data.id}`

  const [checked, setChecked] = React.useState<Set<number>>(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      return stored ? new Set(JSON.parse(stored) as number[]) : new Set()
    } catch {
      return new Set()
    }
  })

  function toggle(index: number) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      try {
        localStorage.setItem(storageKey, JSON.stringify([...next]))
      } catch {
        /* localStorage full or disabled */
      }
      return next
    })
  }

  return (
    <div>
      <h2 className="text-foreground mb-4">{data.titre}</h2>
      {data.elements.map((item, i) => {
        const isDone = checked.has(i)
        return (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            className="flex w-full items-start gap-3 py-3 border-b last:border-b-0 text-left"
          >
            <div
              className={cn(
                "w-5 h-5 shrink-0 mt-0.5 flex items-center justify-center transition-colors",
                isDone ? "bg-accent/30" : "bg-accent/15",
              )}
            >
              {isDone && <Check size={12} className="text-accent" />}
            </div>
            <p
              className={cn(
                "text-sm leading-relaxed transition-colors",
                isDone ? "text-muted-foreground line-through" : "text-foreground",
              )}
            >
              {item.texte}
            </p>
          </button>
        )
      })}
    </div>
  )
}
