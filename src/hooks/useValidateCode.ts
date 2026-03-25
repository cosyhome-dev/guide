import { useMutation } from "@tanstack/react-query"
import { validateCode } from "@/api"

export function useValidateCode() {
  return useMutation({
    mutationFn: (code: string) => validateCode(code),
  })
}
