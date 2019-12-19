export function validateIdCard(val: string) {
  const reg = /^\d{0,17}[0-9Xx]$/
  return reg.test(val)
}

export function validatePhone(val: string) {
  // const reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
  const reg = /^1[\d]{10}$/
  return reg.test(val)
}
