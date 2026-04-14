import { Accordion } from "@/components/guide";
import type { DropdownBlock } from "@/content/property";
import { RICHTEXT_CLASS } from "@/lib";

interface DropdownProps {
  data: DropdownBlock;
}

export default function Dropdown({ data }: DropdownProps) {
  return (
    <Accordion
      items={data.elements.map((el) => ({
        title: el.titre,
        content: (
          <div className={RICHTEXT_CLASS} dangerouslySetInnerHTML={{ __html: el.description }} />
        ),
      }))}
    />
  );
}
