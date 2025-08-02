import * as crypto from 'crypto'

export function generatePassword(): string {
  return crypto.randomBytes(8).toString('hex')
}
