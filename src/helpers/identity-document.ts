const CEDULA_LENGTH = 11
const CEDULA_WEIGHTS = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2]

/**
 * Removes any non-digit characters from the provided identity document.
 */
export function normalizeIdentityDocument(value?: string | null): string {
  if (!value) {
    return ''
  }

  return value.replace(/\D/g, '')
}

/**
 * Validates a Dominican identity document (cedula) using the official algorithm.
 */
export function isValidDominicanIdentityDocument(value?: string | null): boolean {
  const normalized = normalizeIdentityDocument(value)

  if (normalized.length !== CEDULA_LENGTH || /[^0-9]/.test(normalized)) {
    return false
  }

  const digits = normalized.split('').map(Number)

  let checksum = 0
  for (let index = 0; index < CEDULA_LENGTH - 1; index += 1) {
    let product = digits[index] * CEDULA_WEIGHTS[index]

    if (product >= 10) {
      product = Math.floor(product / 10) + (product % 10)
    }

    checksum += product
  }

  const remainder = checksum % 10
  const expectedDigit = remainder === 0 ? 0 : 10 - remainder

  return digits[CEDULA_LENGTH - 1] === expectedDigit
}
