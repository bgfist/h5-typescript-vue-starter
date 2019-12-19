import { isProd } from "@/business/config"
const db = window.localStorage
const prefix = (isProd ? "management-p" : "management-t") + "-"

/**
 * 对localStorage进行封装，更易用
 * 注意：所有key默认都为string类型
 */
const store = {
  set(k: string, v = "") {
    db.setItem(prefix + k, JSON.stringify(v))
  },

  get(k: string) {
    const item = db.getItem(prefix + k)

    if (item === null) {
      return item
    }

    try {
      return JSON.parse(item)
    } catch (e) {
      return item
    }
  },

  remove(k: string) {
    db.removeItem(prefix + k)
  },

  clear() {
    db.clear()
  }
}

export default store
