import { useMutation } from "@tanstack/react-query";
import { validateCode } from "@/api";

export function useValidateCode() {
  return useMutation({
    mutationFn: ({ slug, code }: { slug: string; code: string }) =>
      validateCode(slug, code),
  });
}
