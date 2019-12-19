export function sillyClone(obj: object) {
  return JSON.parse(JSON.stringify(obj))
}

export function isEmpty(val: any) {
  return val === "" || val === null || val === undefined
}

export function url2Name(url: string) {
  return decodeURIComponent(url.substring(url.lastIndexOf("/") + 1))
}

export default {}
