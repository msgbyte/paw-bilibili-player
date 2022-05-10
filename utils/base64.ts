export function toBase64(text: string) {
  return Buffer.from(text).toString('base64');
}

export function fromBase64(base64: string) {
  return Buffer.from(base64, 'base64').toString();
}
