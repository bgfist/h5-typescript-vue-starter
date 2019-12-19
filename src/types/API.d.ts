type Omitable<T> = T extends undefined ? undefined | "" : T
type QYParams<T> = { [k in keyof T]: Omitable<T[k]> } // 可选参数可以不传这个字段或者传空字符串
type QYResponse<T> = Promise<{ [k in keyof T]-?: Omitable<T[k]> }> // 返回的可选字段若无值将返回空字符串
type APIParams<F> = F extends (...args: any[]) => any ? Parameters<F>[0] : never
type APIResponse<F> = F extends (...args: any[]) => Promise<infer T> ? T : never

/** 分页参数 */
interface Pageable {
  page?: number
  limit?: number
}
/** 搜索参数 */
interface Searchable {
  keyword: string
}
/** id参数 */
interface IdBundle {
  id: number
}
/** 日期查询参数 */
interface DateRange {
  start: string
  end: string
}
/** 分页返回 */
interface Pagination<T> {
  total_count: number
  items: T[]
}
/** 是与否 */
type Bool = 0 | 1

/** 后端公用类型 */
declare namespace API {
  const enum RoleType {
    SuperManager = 1,
    PlainManager = 2,
    Staff = 3
  }
}
